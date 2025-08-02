require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Import specific modules for AWS SDK v3
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner"); // For presigned URLs

const app = express();
app.use(cors());
app.use(express.json());

// Configure AWS S3 Client (v3)
const s3Client = new S3Client({
  credentials: {
    // Use credentials for direct keys
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// The only endpoint we need for now
app.post("/api/get-presigned-url", async (req, res) => {
  // ADD THIS LINE FOR DEBUGGING
  console.log("Backend received request body:", req.body);

  // Make function async
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res
      .status(400)
      .json({ error: "fileName and fileType are required" });
  }

  const s3Key = `uploads/${Date.now()}_${fileName}`;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
    ContentType: fileType,
  };

  try {
    // Create a command object for PutObject
    const command = new PutObjectCommand(s3Params);
    // Get the presigned URL using the v3 utility
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // URL valid for 60 seconds
    res.json({ signedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not get signed URL" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Minimal backend running on http://localhost:${PORT}`)
);
