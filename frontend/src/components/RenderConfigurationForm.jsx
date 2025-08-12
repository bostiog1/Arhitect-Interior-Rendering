import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Info,
  Upload,
  CheckCircle,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  AlertCircle,
} from "lucide-react";
import CustomSelect from "./CustomSelect";
import ResolutionInfoDialog from "./ResolutionInfoDialog";
import PaymentForm from "./PaymentForm"; // ADD THIS LINE

const RenderConfigurationForm = () => {
  // Configuration state
  const [renders, setRenders] = useState("3");
  const [resolution, setResolution] = useState("2K");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [notes, setNotes] = useState("2 horizontal\n1 vertical");
  const [acceptPromotion, setAcceptPromotion] = useState(false);
  const [showResolutionInfo, setShowResolutionInfo] = useState(false);

  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [showPaymentUI, setShowPaymentUI] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Client info state
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [orderId, setOrderId] = useState(null);

  // File link state
  const [fileLink, setFileLink] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");

  const [currentStep, setCurrentStep] = useState(1);

  // Loading states
  const [stepLoading, setStepLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Add this state variable near your other states
  const [promoNotification, setPromoNotification] = useState({
    message: "",
    type: "", // 'success' or 'error'
  });

  const resolutionOptions = [
    { value: "HD", label: "HD (1920x1080)", price: 50 },
    { value: "2K", label: "2K (2048x1080)", price: 70 },
    { value: "4K", label: "4K (3840x2160)", price: 120 },
    { value: "8K", label: "8K (7680x4320)", price: 200 },
  ];

  const renderOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
  ];

  // Mock promo codes
  const promoCodes = {
    SAVE10: 0.1,
    NEWCLIENT: 0.15,
    SUMMER20: 0.2,
  };

  // Validation functions
  const validateFile = (file) => {
    const errors = {};
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
    const ALLOWED_EXTENSIONS = [
      ".skp",
      ".obj",
      ".fbx",
      ".glb",
      ".gltf",
      ".zip",
    ];

    if (file.size > MAX_FILE_SIZE) {
      errors.fileSize = "File size must be less than 5GB";
    }

    const extension = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      errors.fileType =
        "File must be a 3D model (.skp, .obj, .fbx, .glb, .gltf) or .zip archive";
    }

    return errors;
  };

  const validateClientInfo = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;

    if (!clientInfo.name.trim()) errors.name = "Name is required";
    if (!clientInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(clientInfo.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!clientInfo.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!phoneRegex.test(clientInfo.phone.replace(/[\s\-\(\)]/g, ""))) {
      errors.phone = "Please enter a valid phone number";
    }

    return errors;
  };

  const validateFileLink = (link) => {
    const errors = {};
    const urlRegex = /^https?:\/\/.+/;

    if (!link.trim()) {
      errors.fileLink = "File link is required";
    } else if (!urlRegex.test(link)) {
      errors.fileLink =
        "Please enter a valid URL starting with http:// or https://";
    }

    return errors;
  };

  // Add this new validation function
  // const validateDeliveryDate = (date) => {
  //   const errors = {};
  //   if (!date) return errors; // It's an optional field, so it's valid if empty

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0); // Set to midnight to compare dates only

  //   if (new Date(date) < today) {
  //     errors.deliveryDate = "Delivery date cannot be in the past.";
  //   }
  //   return errors;
  // };

  const applyPromoCode = () => {
    const discount = promoCodes[promoCode.toUpperCase()];
    if (discount) {
      setAppliedPromoCode(promoCode.toUpperCase());
      setPromoDiscount(discount);
      setPromoCode("");
      // alert(`Promo code applied! ${Math.round(discount * 100)}% discount`);
      setPromoNotification({
        message: `Success! ${Math.round(discount * 100)}% discount applied.`,
        type: "success",
      });
    } else {
      // alert("Invalid promo code");
      setPromoNotification({
        message: "Invalid or expired promo code.",
        type: "error",
      });
    }
    // Clear the message after 5 seconds
    setTimeout(() => setPromoNotification({ message: "", type: "" }), 5000);
  };

  const removePromoCode = () => {
    setAppliedPromoCode("");
    setPromoDiscount(0);
    // Also clear any lingering notifications
    setPromoNotification({ message: "", type: "" });
  };

  const calculatePrice = () => {
    const basePrice =
      resolutionOptions.find((r) => r.value === resolution)?.price || 70;
    const renderCount = Number.parseInt(renders);
    const rushMultiplier =
      deliveryDate &&
      deliveryDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ? 1.5
        : 1;
    const promotionDiscount = acceptPromotion ? 0.9 : 1;
    const promoCodeDiscount = 1 - promoDiscount;
    return Math.round(
      basePrice *
        renderCount *
        rushMultiplier *
        promotionDiscount *
        promoCodeDiscount
    );
  };
  // Add this helper function outside or at the top of your component/file
  const getFileType = (fileName) => {
    const parts = fileName.split(".");
    const extension =
      parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
    switch (extension) {
      case "skp":
        return "application/vnd.sketchup.skp"; // A common MIME type for .skp files
      case "obj":
        return "model/obj"; // Example for a 3D model
      case "fbx":
        return "application/x-fbx"; // Example for FBX
      case "glb":
        return "model/gltf-binary"; // Example for GLB
      case "gltf":
        return "model/gltf+json"; // Example for GLTF
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "bmp":
        return "image/bmp";
      case "webp":
        return "image/webp";
      case "pdf":
        return "application/pdf";
      case "zip":
        return "application/zip";
      case "txt":
        return "text/plain";
      case "html":
        return "text/html";
      case "css":
        return "text/css";
      case "js":
        return "application/javascript";
      // Add more cases for other specific file types you expect
      default:
        return "application/octet-stream"; // Generic binary type for unknown
    }
  };

  const executeS3Upload = useCallback(
    async (fileToUpload, orderIdForUpload, paymentIntentIdForUpload) => {
      if (!fileToUpload) {
        console.log(
          "No file to upload, likely a link-based order. Finalizing."
        );
        // If you have a backend process for link-based orders, call it here.
        // For now, we just proceed to the success screen.
        setUploading(false);
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      console.log("DEBUG: Starting S3 upload with:", {
        fileName: fileToUpload.name,
        orderId: orderIdForUpload,
        paymentIntentId: paymentIntentIdForUpload,
      });

      const calculatedFileType =
        fileToUpload.type || getFileType(fileToUpload.name);

      try {
        // Step 1: Get the presigned URL from the backend
        const response = await fetch(
          // "http://localhost:3001/api/get-presigned-url",
          "https://arhitect-interior-rendering-6lzv.vercel.app/api/get-presigned-url",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: fileToUpload.name,
              fileType: calculatedFileType,
              orderId: orderIdForUpload,
              paymentIntentId: paymentIntentIdForUpload,
            }),
          }
        );

        const responseData = await response.json();
        console.log("DEBUG: Response from /get-presigned-url:", responseData);

        if (!response.ok) {
          throw new Error(responseData.error || "Failed to get presigned URL.");
        }

        const { signedUrl } = responseData;
        if (!signedUrl) throw new Error("Server did not return a signed URL.");

        // Step 2: Upload the file using XMLHttpRequest for progress tracking
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signedUrl, true);
          xhr.setRequestHeader("Content-Type", calculatedFileType);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round(
                (event.loaded / event.total) * 100
              );
              setUploadProgress(percentComplete);
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`Upload failed: Status ${xhr.status}`));
          xhr.onerror = () => reject(new Error("Network error during upload."));
          xhr.send(fileToUpload);
        });

        console.log("File uploaded successfully to S3!");
      } catch (error) {
        console.error("S3 Upload failed:", error);
        setPaymentError(
          `Payment succeeded, but file upload failed: ${error.message}. Please contact support with Order ID ${orderIdForUpload}.`
        );
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const cancelUpload = () => {
    if (window.currentUpload && window.currentUpload.uploadCancelFunction) {
      window.currentUpload.uploadCancelFunction();
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePaymentSuccess = async (newOrderId, newPaymentIntentId) => {
    console.log("DEBUG: Payment Succeeded! Received from PaymentForm:", {
      newOrderId,
      newPaymentIntentId,
    });

    setOrderId(newOrderId); // Now setOrderId exists!
    setPaymentIntentId(newPaymentIntentId);
    setPaymentError(null);
    setShowPaymentUI(false);

    // Immediately move to the final step to show progress/confirmation
    setCurrentStep(5);

    // Check if the order was file-based or link-based and act accordingly
    if (uploadedFile && uploadedFile.source instanceof File) {
      await executeS3Upload(
        uploadedFile.source,
        newOrderId, // Use the newOrderId parameter directly
        newPaymentIntentId
      );
    } else {
      // This is a link-based order, so no file to upload.
      await executeS3Upload(null, newOrderId, newPaymentIntentId);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);
    setPaymentError(error);
    setUploading(false);
  };

  /**
   * MODIFICATION: This function now ONLY sets the state. It does not perform an upload.
   */
  // const handleFileSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setUploadedFile({
  //       name: file.name,
  //       size: file.size,
  //       source: file, // Keep the actual file object
  //     });
  //   }
  // };

  // const handleDrop = useCallback((e) => {
  //   e.preventDefault();
  //   const file = e.dataTransfer.files[0];
  //   if (file) {
  //     setUploadedFile({
  //       name: file.name,
  //       size: file.size,
  //       source: file,
  //     });
  //   }
  // }, []);

  // Replace your existing handleFileSelect function
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileErrors = validateFile(file);
      if (Object.keys(fileErrors).length > 0) {
        setValidationErrors(fileErrors);
        setUploadedFile(null); // Ensure no file is set if invalid
        // Clear the file input so the user can re-select the same file if they want
        e.target.value = null;
        return;
      }

      setValidationErrors({}); // Clear previous file errors
      setUploadedFile({
        name: file.name,
        size: file.size,
        source: file,
      });
    }
  };

  // Replace your existing handleDrop function
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileErrors = validateFile(file);
      if (Object.keys(fileErrors).length > 0) {
        setValidationErrors(fileErrors);
        setUploadedFile(null);
        return;
      }

      setValidationErrors({});
      setUploadedFile({
        name: file.name,
        size: file.size,
        source: file,
      });
    }
  }, []); // The dependency array is correct

  const handleFileLink = () => {
    const linkErrors = validateFileLink(fileLink);
    if (Object.keys(linkErrors).length > 0) {
      setValidationErrors(linkErrors);
      return;
    }

    setValidationErrors({});
    setUploadedFile({
      name: `${fileLink.substring(0, 40)}...`,
      size: 0,
      source: fileLink,
      sourceLink: fileLink,
    });
    setFileLink("");
  };

  // --- NAVIGATION LOGIC ---
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return (
          clientInfo.name.trim() &&
          clientInfo.email.trim() &&
          clientInfo.phone.trim()
        );
      case 3:
        return uploadedFile !== null;
      default:
        return false;
    }
  };

  // const nextStep = () => {
  //   if (isStepValid(currentStep)) {
  //     if (currentStep < 4) {
  //       setCurrentStep((prev) => prev + 1);
  //     }
  //   }
  // };

  const nextStep = () => {
    // Add validation logic for the current step before proceeding
    if (currentStep === 2) {
      const errors = validateClientInfo();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return; // Stop execution if there are errors
      }
    }

    if (isStepValid(currentStep)) {
      setValidationErrors({}); // Clear old errors on successful navigation
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };
  const prevStep = () => {
    setShowPaymentUI(false);
    setPaymentError(null);
    if (currentStep === 3) setUploadedFile(null); // Clear file selection when going back from step 3
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const downloadReceipt = () => {
    // Create a simple receipt
    const receiptData = {
      orderId: orderId,
      clientName: clientInfo.name,
      amount: calculatePrice(),
      date: new Date().toLocaleDateString(),
      renders: renders,
      resolution: resolution,
    };

    const receiptText = `
RECEIPT
Order ID: ${receiptData.orderId}
Client: ${receiptData.clientName}
Amount: $${receiptData.amount}
Date: ${receiptData.date}
Renders: ${receiptData.renders}
Resolution: ${receiptData.resolution}
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Enhanced step indicator
  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2 md:space-x-4">
        {["Config", "Info", "File", "Pay"].map((label, index) => {
          const step = index + 1;
          const isActive = currentStep >= step;
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                      : "bg-gray-600 text-gray-300 border-gray-600"
                  } ${
                    isCurrent
                      ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-[#1C1C44]"
                      : ""
                  }`}
                >
                  {isActive ? <CheckCircle size={18} /> : step}
                </div>
                <span
                  className={`text-xs mt-2 transition-colors duration-300 ${
                    isActive ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`w-12 md:w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                    currentStep > step
                      ? "bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm shadow-blue-500/30"
                      : "bg-gray-600"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-32 bg-gray-700 rounded"></div>
    </div>
  );

  return (
    <div className="backdrop-blur-sm shadow-2xl bg-[#1C1C44] min-h-[600px]">
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {currentStep < 5 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 md:space-x-4">
              {["Config", "Info", "File", "Pay"].map((label, index) => {
                const step = index + 1;
                const isActive = currentStep >= step;
                const isCurrent = currentStep === step;

                return (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                          isActive
                            ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                            : "bg-gray-600 text-gray-300 border-gray-600"
                        } ${
                          isCurrent
                            ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-[#1C1C44]"
                            : ""
                        }`}
                      >
                        {isActive ? <CheckCircle size={18} /> : step}
                      </div>
                      <span
                        className={`text-xs mt-2 transition-colors duration-300 ${
                          isActive ? "text-white font-medium" : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-10 md:w-10 h-1 mx-2 rounded-full transition-all duration-500 ${
                          currentStep > step
                            ? "bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm shadow-blue-500/30"
                            : "bg-gray-600"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stepLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        ) : (
          <>
            {/* Step 1: Configuration */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 md:gap-6 justify-evenly">
                  {/* Renders Dropdown */}
                  <CustomSelect
                    label="Renders"
                    value={renders}
                    options={renderOptions}
                    onChange={setRenders}
                  />

                  {/* Resolution Dropdown */}
                  <CustomSelect
                    label="Resolution"
                    value={resolution}
                    options={resolutionOptions}
                    onChange={setResolution}
                    infoIcon={<Info size={18} />}
                    onInfoClick={() => setShowResolutionInfo(true)}
                  />

                  {/* Delivery Date Input */}
                  <div>
                    <label
                      htmlFor="delivery-date-input"
                      className="block text-white font-bold text-lg mb-4"
                    >
                      Delivery Date
                    </label>
                    <input
                      id="delivery-date-input"
                      type="date"
                      value={
                        deliveryDate
                          ? deliveryDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDeliveryDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 bg-[#1c1c44] text-white text-center rounded-3xl appearance-none pr-10 border-2 border-white shadow-md shadow-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/40 transition-all duration-200"
                    />
                  </div>

                  {/* Price and Pay Button */}
                  <div
                    className="flex items-center justify-between gap-x-7 mt-5"
                    style={{ backgroundColor: "#1c1c44" }}
                  >
                    <div>
                      <span className="block text-white font-bold text-2xl mb-1">
                        Price
                      </span>
                      <span className="text-[oklch(0.74_0.16_87.89)] font-bold text-2xl">
                        ${calculatePrice()}
                      </span>
                      {appliedPromoCode && (
                        <div className="text-green-400 text-sm mt-1">
                          {appliedPromoCode} applied (-
                          {Math.round(promoDiscount * 100)}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="bg-[#1c1c44] border-2 border-white/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-blue-400" size={20} />
                    <span className="text-white font-bold text-lg">
                      Promo Code
                    </span>
                  </div>
                  {/* {promoNotification.message && (
                    <div
                      className={`p-3 rounded-xl mb-4 text-center text-sm font-semibold transition-opacity duration-300 ${
                        promoNotification.type === "success"
                          ? "bg-green-500/20 text-green-300 border border-green-500"
                          : "bg-red-500/20 text-red-300 border border-red-500"
                      }`}
                    >
                      {promoNotification.message}
                    </div>
                  )} */}

                  {!appliedPromoCode ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter promo code"
                        className="flex-1 p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 transition-all duration-200 placeholder:text-white/70"
                      />
                      {promoNotification.message && (
                        <div
                          className={`p-3 rounded-xl mb-4 text-center text-sm font-semibold transition-opacity duration-300 ${
                            promoNotification.type === "success"
                              ? "bg-green-500/20 text-green-300 border border-green-500"
                              : "bg-red-500/20 text-red-300 border border-red-500"
                          }`}
                        >
                          {promoNotification.message}
                        </div>
                      )}
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                          promoCode.trim()
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-500/20 border border-green-500 rounded-xl p-3">
                      <div className="text-green-400">
                        <span className="font-bold">{appliedPromoCode}</span> -{" "}
                        {Math.round(promoDiscount * 100)}% discount applied
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <div className="text-white/60 text-sm mt-2">
                    Try: SAVE10, NEWCLIENT, or SUMMER20
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-white font-medium text-2xl mb-3">
                    Notes
                  </span>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any specific requirements or notes..."
                    className="w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/20 transition-all duration-200 resize-y overflow-auto min-h-[6rem] placeholder:text-white/70"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Client Information */}
            {currentStep === 2 && (
              <div className="space-y-6 max-w-md mx-auto">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  Your Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-bold text-lg mb-2">
                      <User className="inline w-5 h-5 mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={clientInfo.name}
                      onChange={(e) =>
                        setClientInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                      className={`w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 focus:outline-none transition-all duration-200 placeholder:text-white/70 ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-white hover:ring-2 hover:ring-white/50 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-bold text-lg mb-2">
                      <Mail className="inline w-5 h-5 mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) =>
                        setClientInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email"
                      className={`w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 focus:outline-none transition-all duration-200 placeholder:text-white/70 ${
                        validationErrors.email
                          ? "border-red-500"
                          : "border-white hover:ring-2 hover:ring-white/50 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-bold text-lg mb-2">
                      <Phone className="inline w-5 h-5 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) =>
                        setClientInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Enter your phone number"
                      className={`w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 focus:outline-none transition-all duration-200 placeholder:text-white/70 ${
                        validationErrors.phone
                          ? "border-red-500"
                          : "border-white hover:ring-2 hover:ring-white/50 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-center text-white/70 text-sm">
                  Order ID will be generated after payment
                </div>
              </div>
            )}

            {/* Step 3: File Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  Upload Your File or Provide a Link
                </h2>

                {/* Upload Method Selector */}
                <div className="flex justify-center mb-6">
                  <div className="bg-[#1c1c44] border-2 border-white/30 rounded-xl p-1 flex">
                    <button
                      onClick={() => setUploadMethod("file")}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        uploadMethod === "file"
                          ? "bg-blue-500 text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Upload className="inline w-4 h-4 mr-2" /> Upload File
                    </button>
                    <button
                      onClick={() => setUploadMethod("link")}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        uploadMethod === "link"
                          ? "bg-blue-500 text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      File Link
                    </button>
                  </div>
                </div>

                {!uploadedFile ? (
                  <>
                    {uploadMethod === "file" ? (
                      <div>
                        <div
                          className="border-2 border-dashed border-white rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          style={{ backgroundColor: "#1c1c44" }}
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() =>
                            document.getElementById("file-input").click()
                          }
                        >
                          <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                          <div className="text-white text-lg mb-2">
                            Click to upload or drag and drop
                          </div>
                          <div className="text-white/70">
                            3D Models (.skp, .obj, .fbx, .glb, .gltf) or .zip
                            files up to 5GB
                          </div>
                          <input
                            id="file-input"
                            type="file"
                            onChange={handleFileSelect}
                            accept=".skp,.obj,.fbx,.glb,.gltf,.zip"
                            className="hidden"
                          />
                        </div>

                        {/* File validation errors */}
                        {(validationErrors.fileSize ||
                          validationErrors.fileType) && (
                          <div className="mt-4 space-y-2">
                            {validationErrors.fileSize && (
                              <p className="text-red-400 text-sm flex items-center">
                                <AlertCircle size={16} className="mr-1" />
                                {validationErrors.fileSize}
                              </p>
                            )}
                            {validationErrors.fileType && (
                              <p className="text-red-400 text-sm flex items-center">
                                <AlertCircle size={16} className="mr-1" />
                                {validationErrors.fileType}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-[#1c1c44] border-2 border-white rounded-xl p-6">
                        <div className="text-white text-lg font-bold flex-1 text-center mb-4">
                          Provide File Link
                        </div>
                        <div className="space-y-4">
                          <input
                            type="url"
                            value={fileLink}
                            onChange={(e) => setFileLink(e.target.value)}
                            placeholder="https://drive.google.com/file/..."
                            className={`w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              validationErrors.fileLink
                                ? "border-red-500"
                                : "border-white/50"
                            }`}
                          />
                          {validationErrors.fileLink && (
                            <p className="text-red-400 text-sm flex items-center">
                              <AlertCircle size={16} className="mr-1" />
                              {validationErrors.fileLink}
                            </p>
                          )}
                          <button
                            onClick={handleFileLink}
                            disabled={!fileLink.trim()}
                            className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
                              fileLink.trim()
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Process File Link
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-[#1c1c44] border-2 border-green-500 rounded-xl p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <div className="text-white text-lg font-bold mb-2">
                      {uploadMethod === "file" ? "File Ready!" : "Link Ready!"}
                    </div>
                    <div className="text-white/70 break-all">
                      {uploadedFile.name}
                    </div>
                    {uploadedFile.size > 0 && (
                      <div className="text-white/70">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="mt-4 text-blue-400 hover:text-blue-300 underline"
                    >
                      Change {uploadMethod === "file" ? "File" : "Link"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  {showPaymentUI
                    ? "Enter Payment Details"
                    : "Review Your Order"}
                </h2>

                {showPaymentUI ? (
                  <div>
                    {/* {paymentProcessing && (
                      <div className="text-center mb-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="text-white mt-2">Processing payment...</p>
                      </div>
                    )} */}
                    <PaymentForm
                      amount={calculatePrice()}
                      fileDetails={{
                        clientName: clientInfo.name,
                        clientEmail: clientInfo.email,
                        clientPhone: clientInfo.phone,
                        deliveryDate: deliveryDate,
                        notes: notes,
                        uploadType: uploadMethod,
                        fileLink: uploadedFile?.sourceLink || null,
                        name:
                          uploadedFile.source instanceof File
                            ? uploadedFile.source.name
                            : uploadedFile.source,
                        type:
                          uploadedFile.source instanceof File
                            ? uploadedFile.source.type ||
                              getFileType(uploadedFile.source.name)
                            : "link",
                        size:
                          uploadedFile.source instanceof File
                            ? uploadedFile.source.size
                            : 0,
                      }}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                    {paymentError && (
                      <div className="text-red-500 text-center mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500">
                        <AlertCircle className="inline mr-2" size={20} />
                        {paymentError}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Order Summary */}
                    <div className="bg-[#1c1c44] border-2 border-white rounded-xl p-6 max-w-md mx-auto">
                      <div className="space-y-4 text-white">
                        <div className="flex justify-between">
                          <span>Client:</span>
                          <span>{clientInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Renders:</span>
                          <span>{renders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resolution:</span>
                          <span>{resolution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {uploadMethod === "file" ? "File" : "Link"}:
                          </span>
                          <span className="text-sm text-right break-all">
                            {uploadedFile?.name}
                          </span>
                        </div>
                        {deliveryDate && (
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>{deliveryDate.toLocaleDateString()}</span>
                          </div>
                        )}
                        {appliedPromoCode && (
                          <div className="flex justify-between text-green-400">
                            <span>Promo Code:</span>
                            <span>
                              {appliedPromoCode} (-
                              {Math.round(promoDiscount * 100)}%)
                            </span>
                          </div>
                        )}
                        <div className="border-t border-white/20 pt-4">
                          <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span className="text-[oklch(0.74_0.16_87.89)]">
                              ${calculatePrice()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setShowPaymentUI(true);
                          setPaymentProcessing(true);
                        }}
                        className="bg-blue-500 text-white font-bold text-lg px-8 py-3 rounded-full shadow-md hover:bg-blue-600 transition-all transform hover:scale-105"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 5: Completion */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                {uploading ? (
                  <>
                    <h2 className="text-white text-2xl font-bold mb-6">
                      Uploading Your File...
                    </h2>
                    <div className="w-full bg-gray-600 rounded-full h-4 mb-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-300 text-center text-white text-sm flex items-center justify-center"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                    <p className="text-white/80 mb-4">
                      Please keep this window open.
                    </p>
                    <button
                      onClick={cancelUpload}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel Upload
                    </button>
                  </>
                ) : paymentError ? (
                  <div className="bg-[#1c1c44] border-2 border-red-500 rounded-xl p-8">
                    <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-red-400 text-3xl font-bold mb-4">
                      An Error Occurred
                    </h2>
                    <p className="text-white/90">{paymentError}</p>
                  </div>
                ) : (
                  <div className="bg-[#1c1c44] border-2 border-green-500 rounded-xl p-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-white text-3xl font-bold mb-4">
                      Order Complete!
                    </h2>
                    <p className="text-white/90">
                      Thank you, {clientInfo.name}.
                    </p>
                    <p className="text-white/90">
                      Your order has been received successfully.
                    </p>
                    <div className="mt-4 text-white/70">
                      Order ID: <span className="font-mono">{orderId}</span>
                    </div>
                    <p className="mt-4 text-white/90">
                      We will contact you shortly regarding your delivery.
                    </p>

                    {/* Download Receipt Button */}
                    <button
                      onClick={downloadReceipt}
                      className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
                    >
                      <Download className="mr-2" size={18} />
                      Download Receipt
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                disabled={stepLoading}
                className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep) || stepLoading}
              className={`px-6 py-2 rounded-full transition-all ml-auto flex items-center ${
                isStepValid(currentStep) && !stepLoading
                  ? "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {stepLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  {currentStep === 3 && !uploadedFile
                    ? "Select File to Continue"
                    : "Next"}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <ResolutionInfoDialog
        show={showResolutionInfo}
        onClose={() => setShowResolutionInfo(false)}
      />
    </div>
  );
};

export default RenderConfigurationForm;
