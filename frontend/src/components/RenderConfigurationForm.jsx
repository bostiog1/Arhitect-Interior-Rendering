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
} from "lucide-react";
import CustomSelect from "./CustomSelect";
import ResolutionInfoDialog from "./ResolutionInfoDialog";

const RenderConfigurationForm = () => {
  // Configuration state
  const [renders, setRenders] = useState("3");
  const [resolution, setResolution] = useState("2K");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [notes, setNotes] = useState("2 horizontal\n1 vertical");
  const [acceptPromotion, setAcceptPromotion] = useState(false);
  const [showResolutionInfo, setShowResolutionInfo] = useState(false);

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
  const [orderId] = useState(
    () => `RO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );

  // File link state
  const [fileLink, setFileLink] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // "file" or "link"

  // Form step state
  const [currentStep, setCurrentStep] = useState(1); // 1: config, 2: client info, 3: upload, 4: pay

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

  const applyPromoCode = () => {
    const discount = promoCodes[promoCode.toUpperCase()];
    if (discount) {
      setAppliedPromoCode(promoCode.toUpperCase());
      setPromoDiscount(discount);
      setPromoCode("");
      alert(`Promo code applied! ${Math.round(discount * 100)}% discount`);
    } else {
      alert("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode("");
    setPromoDiscount(0);
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

  // Mock file upload function (replace with actual S3 upload)
  const handleFileUpload = useCallback(
    async (file) => {
      if (!file) return;

      setUploading(true);
      setUploadProgress(0);

      try {
        // Mock upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // In real implementation, upload to S3 here
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          orderId: orderId,
          uploadedAt: new Date().toISOString(),
          // In real app, this would be the S3 URL
          url: `https://your-bucket.s3.amazonaws.com/${orderId}/${file.name}`,
        };

        setUploadedFile(fileData);

        // Store order data (in real app, send to backend/database)
        const orderData = {
          orderId,
          clientInfo,
          configuration: {
            renders,
            resolution,
            deliveryDate: deliveryDate?.toISOString(),
            notes,
            price: calculatePrice(),
            promoCode: appliedPromoCode,
          },
          file: fileData,
          createdAt: new Date().toISOString(),
        };

        console.log("Order Data (save this to database):", orderData);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [
      orderId,
      clientInfo,
      renders,
      resolution,
      deliveryDate,
      notes,
      appliedPromoCode,
    ]
  );

  const handleFileLink = async () => {
    if (!fileLink.trim()) {
      alert("Please enter a valid file link");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Mock download progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Mock file data from link
      const fileData = {
        name: `file-from-link-${Date.now()}.skp`,
        size: 2048000, // Mock size
        type: "application/sketchup",
        orderId: orderId,
        uploadedAt: new Date().toISOString(),
        sourceLink: fileLink,
        url: `https://your-bucket.s3.amazonaws.com/${orderId}/file-from-link-${Date.now()}.skp`,
      };

      setUploadedFile(fileData);
      setFileLink("");
    } catch (error) {
      console.error("Link processing failed:", error);
      alert("Failed to process file link. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".skp")) {
        handleFileUpload(file);
      } else {
        alert("Please upload a .skp file");
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return true; // Configuration always valid with defaults
      case 2:
        return (
          clientInfo.name.trim() !== "" &&
          clientInfo.email.trim() !== "" &&
          clientInfo.phone.trim() !== ""
        );
      case 3:
        return uploadedFile !== null;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="backdrop-blur-sm shadow-2xl bg-[#1C1C44]">
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      currentStep > step ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

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
                    deliveryDate ? deliveryDate.toISOString().split("T")[0] : ""
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
                <span className="text-white font-bold text-lg">Promo Code</span>
              </div>

              {!appliedPromoCode ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 transition-all duration-200 placeholder:text-white/70"
                  />
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
                    setClientInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 transition-all duration-200 placeholder:text-white/70"
                />
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
                  className="w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 transition-all duration-200 placeholder:text-white/70"
                />
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
                  className="w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 transition-all duration-200 placeholder:text-white/70"
                />
              </div>
            </div>

            <div className="text-center text-white/70 text-sm">
              Order ID: <span className="font-mono">{orderId}</span>
            </div>
          </div>
        )}

        {/* Step 3: File Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold text-center mb-6">
              Upload Your .skp File
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
                  <Upload className="inline w-4 h-4 mr-2" />
                  Upload File
                </button>
                <button
                  onClick={() => setUploadMethod("link")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    uploadMethod === "link"
                      ? "bg-blue-500 text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {/* <input className="inline mr-2 " /> */}
                  File Link
                </button>
              </div>
            </div>

            {!uploadedFile ? (
              <>
                {uploadMethod === "file" ? (
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

                    {uploading ? (
                      <div className="space-y-2">
                        <div className="text-white">
                          Uploading... {uploadProgress}%
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-white text-lg mb-2">
                          Click to upload or drag and drop
                        </div>
                        <div className="text-white/70">
                          SketchUp files (.skp) up to 3GB
                        </div>
                      </>
                    )}

                    <input
                      id="file-input"
                      type="file"
                      accept=".skp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="bg-[#1c1c44] border-2 border-white rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-white text-lg font-bold flex-1 text-center">
                        Provide File Link
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="url"
                        value={fileLink}
                        onChange={(e) => setFileLink(e.target.value)}
                        placeholder="https://drive.google.com/file/... or https://dropbox.com/..."
                        className="w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 transition-all duration-200 placeholder:text-white/70"
                      />

                      {uploading ? (
                        <div className="space-y-2">
                          <div className="text-white text-center">
                            Processing file from link... {uploadProgress}%
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
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
                      )}

                      <div className="text-white/60 text-sm">
                        Supported: Google Drive, Dropbox, OneDrive, WeTransfer,
                        or direct .skp file links
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#1c1c44] border-2 border-green-500 rounded-xl p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <div className="text-white text-lg font-bold mb-2">
                  File Ready!
                </div>
                <div className="text-white/70">{uploadedFile.name}</div>
                <div className="text-white/70">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
                {uploadedFile.sourceLink && (
                  <div className="text-blue-400 text-sm mt-2">
                    From: {uploadedFile.sourceLink.substring(0, 50)}...
                  </div>
                )}
                <button
                  onClick={() => setUploadedFile(null)}
                  className="mt-4 text-blue-400 hover:text-blue-300 underline"
                >
                  Change File
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center">
            <h2 className="text-white text-2xl font-bold mb-6">Ready to Pay</h2>

            <div className="bg-[#1c1c44] border-2 border-white rounded-xl p-6 max-w-md mx-auto">
              <div className="space-y-4 text-white">
                <div className="flex justify-between">
                  <span>Client:</span>
                  <span>{clientInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-sm">{orderId}</span>
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
                  <span>File:</span>
                  <span className="text-sm">{uploadedFile?.name}</span>
                </div>
                {appliedPromoCode && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo Code:</span>
                    <span>{appliedPromoCode} (-{Math.round(promoDiscount * 100)}%)</span>
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

            <button
              type="button"
              className="bg-[#1c1c44] text-white font-bold text-lg px-8 py-3 rounded-full shadow-md shadow-white/40 border-2 border-white hover:shadow-lg hover:shadow-white/50 hover:bg-[#2a2a5e] transition-all duration-200"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}

          {currentStep < 4 && (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-2 rounded-full transition-colors ml-auto ${
                isStepValid(currentStep)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentStep === 3 && !uploadedFile
                ? "Upload File to Continue"
                : "Next"}
            </button>
          )}
        </div>
      </div>

      <ResolutionInfoDialog
        show={showResolutionInfo}
        onClose={() => setShowResolutionInfo(false)}
      />
    </div>
  );
};

export default RenderConfigurationForm;
