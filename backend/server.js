// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // New: Mongoose for MongoDB
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Configure CORS to allow your Netlify frontend domain
const corsOptions = {
  origin: "https://lucent-mochi-66ab64.netlify.app/", 
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
  credentials: true, // If you send cookies or authorization headers
};
app.use(cors(corsOptions));

app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// --- MongoDB Schema and Model ---
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  s3Url: { type: String, default: null },
  paymentIntentId: { type: String, unique: true, required: true },
  amount: { type: Number, required: true }, // Amount in cents
  currency: { type: String, default: "usd" },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "succeeded", "failed", "processing", "completed"],
  },
  timestamp: { type: Date, default: Date.now },

  deliveryDate: { type: Date, default: null },
  notes: { type: String, default: "" },
  uploadType: { type: String, enum: ["file", "link"], required: true }, // Add this
  fileLink: { type: String, default: null }, // Add this
});

const Order = mongoose.model("Order", orderSchema);

// Configure AWS S3 Client (v3)
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Add this to your server.js
app.get("/", (req, res) => {
  res.status(200).send("Backend is alive!");
});

// --- API Endpoint: Create Payment Intent ---
app.post("/api/create-payment-intent", async (req, res) => {
  // Destructure client info from request body
  const {
    amount,
    currency,
    fileName,
    fileType,
    fileSize,
    clientName,
    clientEmail,
    clientPhone,
    deliveryDate, // ADD
    notes, // ADD
    uploadType, // ADD
    fileLink, // ADD
  } = req.body;

  // --- Cost Control Logic (Backend Enforcement) ---
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return res
      .status(400)
      .json({ error: "File size exceeds maximum allowed limit." });
  }

  if (amount < 50) {
    // Example: minimum 0.50 USD (Stripe amounts are in cents)
    return res
      .status(400)
      .json({ error: "Minimum payment amount is required ($0.50)." });
  }

  if (!clientName || !clientEmail || !clientPhone) {
    return res
      .status(400)
      .json({ error: "Client name, email, and phone are required." });
  }

  const orderId = `RO-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`; // Unique order ID

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents, must be integer
      currency: currency || "usd",
      metadata: {
        orderId: orderId,
        fileName: fileName,
        clientEmail: clientEmail, // Store client email in Stripe metadata for convenience
      },
      receipt_email: clientEmail, // Stripe can send receipt to this email
    });

    // --- Save order to MongoDB with pending status ---
    const newOrder = new Order({
      orderId: orderId,
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,

      paymentIntentId: paymentIntent.id,
      amount: amount, // Store original amount for your records, not in cents
      currency: currency || "usd",
      status: "pending",
      deliveryDate: deliveryDate, // ADD
      notes: notes, // ADD
      uploadType: uploadType, // ADD
      fileLink: fileLink, // ADD
    });

    await newOrder.save();
    console.log(`Order ${orderId} saved as pending in MongoDB.`);

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId, // Send generated orderId back to frontend
      paymentIntentId: paymentIntent.id, // Send paymentIntentId for S3 upload step
    });
  } catch (error) {
    console.error(
      "Error creating payment intent or saving order:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// --- API Endpoint: Get Presigned URL ---
app.post("/api/get-presigned-url", async (req, res) => {
  const { fileName, fileType, orderId, paymentIntentId } = req.body;

  if (!fileName || !fileType || !orderId || !paymentIntentId) {
    return res.status(400).json({
      error: "fileName, fileType, orderId, and paymentIntentId are required.",
    });
  }

  try {
    // --- IMPORTANT: Verify Payment Intent Status with Stripe ---
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      console.warn(
        `Payment Intent ${paymentIntentId} is not succeeded. Current status: ${paymentIntent.status}`
      );
      // Update order status to 'failed' if payment didn't succeed
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntentId },
        { status: "failed" }
      );
      return res
        .status(403)
        .json({ error: "Payment not successful. Cannot generate upload URL." });
    }

    // Optional: Re-verify file size against DB if needed, though primary check is on PI creation
    const order = await Order.findOne({
      orderId: orderId,
      paymentIntentId: paymentIntentId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found or mismatch." });
    }

    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB (re-define or import from config)
    if (order.fileSize > MAX_FILE_SIZE_BYTES) {
      return res
        .status(400)
        .json({ error: "File size in order exceeds maximum allowed limit." });
    }

    // Construct S3 key using orderId for organization
    const s3Key = `uploads/${orderId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(s3Params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // URL valid for 10 minutes

    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // --- Update order in MongoDB with S3 URL and status 'processing' ---
    await Order.findOneAndUpdate(
      { orderId: orderId, paymentIntentId: paymentIntentId },
      { s3Url: s3Url, status: "processing" } // Change status to 'processing' as file is now uploading
    );
    console.log(
      `Order ${orderId} updated with S3 URL and status 'processing'.`
    );

    res.json({ signedUrl, s3Url });
  } catch (error) {
    console.error(
      "Error getting signed URL or verifying payment/updating DB:",
      error
    );
    res.status(500).json({
      error: "Could not get signed URL or verify payment or update order.",
    });
  }
});

// --- API Endpoint: Update Order to Completed (You'd call this after rendering) ---
app.post("/api/update-order-status", async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "Order ID and status are required." });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status, updatedAt: Date.now() },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({
      message: `Order ${orderId} status updated to ${status}.`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

// --- API Endpoint: Get All Orders (for your admin panel) ---
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ timestamp: -1 }); // Sort by newest first
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Minimal backend running on http://localhost:${PORT}`)
);
