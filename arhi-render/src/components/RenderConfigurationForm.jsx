import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import ResolutionInfoDialog from "./ResolutionInfoDialog";
import { Info, Upload } from "@mui/icons-material"; // Info and Upload icons needed here
import available from "../assets/available.png"; // Asset needed here

const RenderConfigurationForm = () => {
  const [renders, setRenders] = useState("3");
  const [resolution, setResolution] = useState("2K");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [notes, setNotes] = useState("2 horizontal\n1 vertical");
  const [acceptPromotion, setAcceptPromotion] = useState(false); // Still here for price calculation
  const [showResolutionInfo, setShowResolutionInfo] = useState(false);

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
    return Math.round(
      basePrice * renderCount * rushMultiplier * promotionDiscount
    );
  };

  return (
    <div className="backdrop-blur-sm shadow-2xl bg-[#1C1C44]">
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
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
            infoIcon={<Info fontSize="small" />} // Pass the MUI Info icon directly
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
            </div>
            <button
              type="button"
              className="bg-[#1c1c44] text-white font-bold text-lg px-4 rounded-full w-24 h-10 shadow-md shadow-white/40 border-2 border-white hover:shadow-lg hover:shadow-white/50 hover:bg-[#2a2a5e] transition-all duration-200"
            >
              Pay
            </button>
          </div>
        </div>

        <div className="text-center">
          <img
            src={available}
            alt="Photographic Vision"
            className="w-full h-auto"
          />
        </div>

        {/* Upload and Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Upload .skp Section */}
          <div className="space-y-2">
            <span className="block text-white font-medium text-2xl mb-3">
              Upload .skp
            </span>
            <div
              className="border-2 border-solid border-slate-300 rounded-xl p-6 md:p-8 text-center shadow-md shadow-white/40 hover:ring-2 hover:ring-white/50 border-2 border-white hover:shadow-lg hover:shadow-white/30 transition-colors cursor-pointer"
              style={{ backgroundColor: "#1c1c44" }}
            >
              <Upload className="h-8 w-8 md:h-12 md:w-12 text-blue-400 mx-auto mb-4" />
              <span className="block text-white text-sm md:text-base">
                Click to upload or drag and drop
              </span>
              <span className="block text-white text-sm mt-2">
                SketchUp files (.skp) up to 100MB
              </span>
            </div>
          </div>

          {/* Notes Section */}
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
            ></textarea>
          </div>
        </div>
      </div>

      {/* Resolution Info Dialog */}
      <ResolutionInfoDialog
        show={showResolutionInfo}
        onClose={() => setShowResolutionInfo(false)}
      />
    </div>
  );
};

export default RenderConfigurationForm;
