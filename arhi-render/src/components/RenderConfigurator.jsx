import { useState, useRef, useCallback, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { Upload, Info } from "@mui/icons-material";
import available from "../assets/available.png";
import { X, ChevronDown, ChevronUp } from "lucide-react";

// Reusable ImageSlider Component
const ImageSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const imageContainerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const styles = {
    container: {
      position: "relative",
      width: "100%",
      aspectRatio: "25/8",
      overflow: "hidden",
      cursor: "ew-resize",
      userSelect: "none",
      backgroundColor: "#1C1C44",
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      pointerEvents: "none",
    },
    afterImage: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    slider: {
      position: "absolute",
      top: 0,
      height: "100%",
      width: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "ew-resize",
      zIndex: 10,
    },
    sliderLine: {
      height: "100%",
      width: "3px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
    },
    sliderIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "#333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      margin: "0 -1px",
    },
  };

  return (
    <div
      ref={imageContainerRef}
      style={styles.container}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <img src={beforeImage} alt="Before" style={styles.image} />
      <div
        style={{
          ...styles.image,
          ...styles.afterImage,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <img src={afterImage} alt="After" style={styles.image} />
      </div>
      <div
        style={{
          ...styles.slider,
          left: `calc(${sliderPosition}% - 22.5px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div style={styles.sliderLine}></div>
        <div style={styles.sliderIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M7.21 1.07a.5.5 0 0 1 .58 0l3 2.5a.5.5 0 0 1 0 .86l-3 2.5a.5.5 0 0 1-.58 0V1.07zM8.79 14.93a.5.5 0 0 1-.58 0l-3-2.5a.5.5 0 0 1 0-.86l3-2.5a.5.5 0 0 1 .58 0v5.86z" />
          </svg>
        </div>
        <div style={styles.sliderLine}></div>
      </div>
    </div>
  );
};

export default function RenderConfigurator() {
  const [renders, setRenders] = useState("3");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef(null);

  const [resolution, setResolution] = useState("2K"); // Your existing state for resolution
  const [isResolutionSelectOpen, setIsResolutionSelectOpen] = useState(false); // NEW state for resolution dropdown
  const resolutionSelectRef = useRef(null); // NEW ref for resolution dropdown container

  const [deliveryDate, setDeliveryDate] = useState(null);
  const [notes, setNotes] = useState("2 horizontal\n1 vertical");
  const [acceptPromotion, setAcceptPromotion] = useState(false);
  const [showResolutionInfo, setShowResolutionInfo] = useState(false);
  // ADD THESE LINES HERE:
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const autoScrollInterval = useRef(null);
  const scrollContainerRef = useRef(null);

  // Close custom resolution select dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideResolutionSelect = (event) => {
      if (
        resolutionSelectRef.current &&
        !resolutionSelectRef.current.contains(event.target)
      ) {
        setIsResolutionSelectOpen(false);
      }
    };
    if (isResolutionSelectOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutsideResolutionSelect
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideResolutionSelect
      );
    }
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideResolutionSelect
      );
    };
  }, [isResolutionSelectOpen]);

  // Close custom select dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideSelect = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsSelectOpen(false); // Close select dropdown
      }
    };
    if (isSelectOpen) {
      document.addEventListener("mousedown", handleClickOutsideSelect);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideSelect);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSelect);
    };
  }, [isSelectOpen]);

  // Auto-scroll function
  const startAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) return;

    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current && isAutoScrolling && !isDragging) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll) {
          // Reset to beginning when reaching the end
          container.scrollLeft = 0;
        } else {
          // Scroll to the right
          container.scrollLeft += 1;
        }
      }
    }, 20); // Adjust speed by changing this value (lower = faster)
  }, [isAutoScrolling, isDragging]);

  // Stop auto-scroll function
  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  // Mouse enter handler - pause auto-scroll
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
    stopAutoScroll();
  };

  // Mouse leave handler - resume auto-scroll
  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsAutoScrolling(true);
    }
  };

  // Mouse down handler - start manual scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoScrolling(false);
    stopAutoScroll();
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  // Mouse move handler - manual scroll
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse up handler - end manual scroll
  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    // Resume auto-scroll after a short delay
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 1000);
  };

  // Effect to start auto-scroll on component mount
  useEffect(() => {
    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [startAutoScroll]);

  // Effect to handle auto-scroll state changes
  useEffect(() => {
    if (isAutoScrolling && !isDragging) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  }, [isAutoScrolling, isDragging, startAutoScroll]);

  const resolutionOptions = [
    { value: "HD", label: "HD (1920x1080)", price: 50 },
    { value: "2K", label: "2K (2048x1080)", price: 70 },
    { value: "4K", label: "4K (3840x2160)", price: 120 },
    { value: "8K", label: "8K (7680x4320)", price: 200 },
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
    <section
      id="configurator"
      className="w-full bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{ backgroundColor: "#1C1C44" }}
    >
      <div className="w-full">
        <div className="w-full mx-auto">
          {/* Before/After Slider Section - Full Width */}
          <div className="w-full">
            <ImageSlider
              beforeImage="https://picsum.photos/id/10/1200/675"
              afterImage="https://picsum.photos/id/10/1200/675?grayscale"
            />
          </div>

          <div
            className="backdrop-blur-sm shadow-2xl bg-[#1C1C44]" /* Added bg-[#1C1C44] and rounded-xl */
          >
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              {/* Configuration Grid */}
              {/* <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"> */}
              <div className="flex flex-wrap gap-4 md:gap-6 justify-evenly">
                {/* Renders Dropdown */}
                <div className="space-y-2">
                  <label
                    htmlFor="renders-custom-select" // Changed ID for custom select
                    className="block text-white font-bold text-lg mb-3"
                  >
                    Renders
                  </label>
                  <div className="relative w-full" ref={selectRef}>
                    {" "}
                    {/* Added ref here */}
                    {/* The custom "select button" */}
                    <button
                      type="button"
                      id="renders-custom-select"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className="w-full p-3 bg-[#1c1c44] text-white text-center rounded-3xl
                        border-2 border-white shadow-md shadow-white/20
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/40
                        transition-all duration-200 flex items-center justify-center relative pr-10"
                    >
                      <span className="text-lg">{renders}</span>{" "}
                      {/* Display selected value with larger font */}
                      {/* Custom arrow icon */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                        {isSelectOpen ? (
                          <ChevronUp className="h-4 w-4 fill-current" /> // You need to import ChevronUp from 'lucide-react'
                        ) : (
                          <ChevronDown className="h-4 w-4 fill-current" /> // You need to import ChevronDown from 'lucide-react'
                        )}
                      </div>
                    </button>
                    {/* The custom dropdown options list */}
                    {isSelectOpen && (
                      <ul className="absolute z-20 w-full mt-2 bg-[#1c1c44] rounded-xl shadow-lg border-2 border-white max-h-60 overflow-y-auto custom-scrollbar">
                        {[1, 2, 3, 4, 5, 6, 10, 11].map((num) => (
                          <li
                            key={num}
                            onClick={() => {
                              setRenders(num.toString()); // Update the state
                              setIsSelectOpen(false); // Close the dropdown
                            }}
                            className={`
                              p-0 text-white cursor-pointer transition-colors duration-150
                              mx-1.5 my-1 rounded-2xl text-center text-lg
                              ${
                                num.toString() === renders
                                  ? "bg-gray-400 font-bold"
                                  : "bg-gray-700"
                              } hover:bg-gray-600`}
                          >
                            {num}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Resolution Dropdown */}
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="resolution-custom-select"
                      className="block text-white font-bold text-lg"
                    >
                      Resolution
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowResolutionInfo(true)} // Retains existing functionality
                      className="text-white hover:text-blue-400 p-1 rounded-full"
                      aria-label="Resolution Information"
                    >
                      <Info fontSize="small" />{" "}
                      {/* Ensure Info is imported (e.g., from '@mui/icons-material' or 'lucide-react') */}
                    </button>
                  </div>
                  <div className="relative w-full" ref={resolutionSelectRef}>
                    {/* The custom "select button" for Resolution */}
                    <button
                      type="button"
                      id="resolution-custom-select"
                      onClick={() =>
                        setIsResolutionSelectOpen(!isResolutionSelectOpen)
                      }
                      className="w-full p-3 bg-[#1c1c44] text-white text-center rounded-3xl
                 border-2 border-white shadow-md shadow-white/20
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/40
                 transition-all duration-200 flex items-center justify-center relative pr-10"
                    >
                      <span className="text-lg">
                        {
                          resolutionOptions.find(
                            (opt) => opt.value === resolution
                          )?.label
                        }{" "}
                        {/* Display selected label */}
                      </span>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                        {isResolutionSelectOpen ? (
                          <ChevronUp className="h-4 w-4 fill-current" />
                        ) : (
                          <ChevronDown className="h-4 w-4 fill-current" />
                        )}
                      </div>
                    </button>

                    {/* The custom dropdown options list for Resolution */}
                    {isResolutionSelectOpen && (
                      <ul className="absolute z-20 w-full mt-2 bg-[#1c1c44] rounded-xl shadow-lg border-2 border-white max-h-60 overflow-y-auto custom-scrollbar">
                        {resolutionOptions.map((option) => (
                          <li
                            key={option.value}
                            onClick={() => {
                              setResolution(option.value); // Update the state
                              setIsResolutionSelectOpen(false); // Close the dropdown
                            }}
                            className={`
              p-3 text-white cursor-pointer transition-colors duration-150
              mx-2 my-1 rounded-2xl text-center text-lg
              ${
                option.value === resolution
                  ? "bg-gray-400 font-bold"
                  : "bg-gray-700"
              }
              hover:bg-gray-500
            `}
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Delivery Date Input (Basic HTML Date Input) */}
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
                    } // Format Date object for input type="date"
                    onChange={(e) =>
                      setDeliveryDate(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                    min={new Date().toISOString().split("T")[0]} // Set min date to today
                    className="w-full p-3 bg-[#1c1c44] text-white text-center rounded-3xl appearance-none pr-10
                      border-  border-2 border-white shadow-md shadow-white/20
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      hover:ring-2 hover:ring-white/50 hover:shadow-lg  hover:shadow-white/40 
                      transition-all duration-200"
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
                    <span className="text-[oklch(0.74_0.16_87.89)]  font-bold text-2xl">
                      {/* Added '$' here for consistent display */}$
                      {calculatePrice()}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="bg-[#1c1c44] text-white font-bold text-lg px-4 rounded-full w-24 h-10
                    shadow-md shadow-white/40 {/* Light white shadow */} border-  border-2 border-white
                    hover:shadow-lg hover:shadow-white/50 {/* Bigger light white shadow on hover */}
                    hover:bg-[#2a2a5e] {/* Slightly lighter background on hover for a subtle change */}
                    transition-all duration-200 border border-white"
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
                    {" "}
                    {/* Changed from Typography */}
                    Upload .skp
                  </span>
                  <div
                    className="border-2 border-solid border-slate-300 rounded-xl p-6 md:p-8 text-center shadow-md shadow-white/40 hover:ring-2 hover:ring-white/50 
                    border-  border-2 border-white
                    hover:shadow-lg hover:shadow-white/30 transition-colors cursor-pointer"
                    style={{ backgroundColor: "#1c1c44" }}
                  >
                    {/* Upload icon is from @mui/icons-material, keep it as is */}
                    <Upload className="h-8 w-8 md:h-12 md:w-12 text-blue-400 mx-auto mb-4" />
                    <span className="block text-white text-sm md:text-base">
                      {" "}
                      {/* Changed from Typography */}
                      Click to upload or drag and drop
                    </span>
                    <span className="block text-white text-sm mt-2">
                      {" "}
                      {/* Changed from Typography, text-sm is equivalent to variant="caption" */}
                      SketchUp files (.skp) up to 100MB
                    </span>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-2">
                  <span className="block text-white font-medium text-2xl mb-3">
                    {" "}
                    {/* Changed from Typography */}
                    Notes
                  </span>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any specific requirements or notes..."
                    className="w-full p-3 bg-[#1c1c44] text-white rounded-xl border-2 border-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/20
                      transition-all duration-200
                      resize-y overflow-auto min-h-[6rem] placeholder:text-white/70" /* <-- Ensure resize-y and overflow-auto are here */
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rolling Images Gallery - Full Width with Manual Scroll */}
      <div className="w-full overflow-hidden">
        <div
          className="overflow-x-auto flex no-scrollbar"
          id="image-gallery-scroll-container"
          style={{ scrollBehavior: "smooth", cursor: "grab" }}
          ref={scrollContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 md:w-80 h-40 md:h-48 relative overflow-hidden shadow-lg"
            >
              <img
                src={`https://picsum.photos/320/192?random=${i}`}
                alt={`Project ${i}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Resolution Info Dialog */}
      {showResolutionInfo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4" // Changed here
          onClick={() => setShowResolutionInfo(false)} // Close when clicking on the overlay
        >
          <div
            className="relative bg-[#1C1C44] text-white rounded-xl shadow-2xl // Base styling
                 w-full max-w-4xl sm:max-w-md md:max-w-[800px] md:max-h-[700px] md:h-[600px] sm:max-h-[80vh] // Responsive width (adjust max-w-X as needed)
                 transform transition-all duration-300 scale-100 opacity-100 // Basic transition
                 overflow-hidden" // Prevents content overflow outside rounded corners
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing dialog
          >
            {/* DialogTitle equivalent */}
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Resolution Comparison</h2>
              <button
                onClick={() => setShowResolutionInfo(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                aria-label="Close dialog"
              >
                {/* Ensure 'X' is imported from your icon library */}
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DialogContent equivalent */}
            <div className="p-5">
              {" "}
              {/* Equivalent to DialogContent with padding */}
              <div className="rounded-lg">
                {" "}
                {/* Equivalent to Box, removed redundant background if main dialog is dark */}
                <div className="w-full mb-6 flex flex-col items-center">
                  {/* 8K Container (Largest) */}
                  <div className="relative w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center shadow-xl">
                    <div className="absolute top-2 left-1.5 text-white font-bold text-xl sm:top-1 sm:left-1 ">
                      8K
                    </div>{" "}
                    {/* Top-left text */}
                    {/* 4K Container */}
                    <div className="absolute w-[75%] h-[80%] bg-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                      <div className="absolute top-2 left-2 text-white font-bold text-xl sm:top-1 sm:left-1 sm:text-base">
                        4K
                      </div>{" "}
                      {/* Top-left text */}
                      {/* 2K Container */}
                      <div className="absolute w-[70%] h-[73%] bg-gray-600 rounded-lg flex items-center justify-center shadow-md">
                        <div className="absolute top-2 left-2 text-white font-bold text-xl sm:text-base">
                          2K
                        </div>{" "}
                        {/* Top-left text */}
                        {/* HD Container (Smallest) */}
                        <div className="absolute w-[57%] h-[60%] bg-gray-500 rounded-lg flex items-center justify-center text-gray-900 font-bold text-lg shadow-sm">
                          <div className="absolute top-4 left-4 text-gray-900 font-bold text-lg sm:top-1 sm:left-1 sm:text-base">
                            HD
                          </div>{" "}
                          {/* Top-left text */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  {" "}
                  {/* Adjusted text color for dark background */}
                  <p>
                    <strong>HD (1920x1080):</strong> Standard quality for web
                    use
                  </p>
                  <p>
                    <strong>2K (2048x1080):</strong> Enhanced detail for
                    presentations
                  </p>
                  <p>
                    <strong>4K (3840x2160):</strong> High quality for large
                    prints
                  </p>
                  <p>
                    <strong>8K (7680x4320):</strong> Ultra-high quality for
                    professional use
                  </p>
                </div>
              </div>
            </div>

            {/* DialogActions equivalent */}
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowResolutionInfo(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
