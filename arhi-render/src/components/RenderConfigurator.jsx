import React, { useState, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Upload, Info } from "@mui/icons-material";

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
      aspectRatio: "15/8",
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
  const [resolution, setResolution] = useState("2K");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [notes, setNotes] = useState("2 horizontal\n1 vertical");
  const [acceptPromotion, setAcceptPromotion] = useState(false);
  const [showResolutionInfo, setShowResolutionInfo] = useState(false);

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
      // className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
      className="w-full bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{ backgroundColor: "#1C1C44" }}
    >
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8"> */}
      <div className="container mx-auto">
        {/* <div className="text-center mb-8 md:mb-16">
          <Typography
            variant="h3"
            component="h2"
            className="text-slate-900 mb-4 font-bold text-2xl sm:text-3xl md:text-4xl"
          >
            Configure Your Render Order
          </Typography>
          <Typography
            variant="h6"
            className="text-slate-600 max-w-2xl mx-auto text-base md:text-xl"
          >
            Customize your architectural rendering project with our easy-to-use
            configurator
          </Typography>
        </div> */}

        <div className="w-full mx-auto">
          {/* Before/After Slider Section - Full Width */}
          <div className="w-full">
            <ImageSlider
              beforeImage="https://picsum.photos/id/10/1200/675"
              afterImage="https://picsum.photos/id/10/1200/675?grayscale"
            />
          </div>

          <Card
            className="backdrop-blur-sm shadow-2xl"
            style={{ backgroundColor: "#1C1C44" }}
          >
            <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
              {/* Configuration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <FormControl fullWidth>
                  <InputLabel>Renders</InputLabel>
                  <Select
                    value={renders}
                    label="Renders"
                    onChange={(e) => setRenders(e.target.value)}
                    className="bg-white rounded-xl"
                  >
                    {[1, 2, 3, 4, 5, 6, 10, 11].map((num) => (
                      <MenuItem key={num} value={num.toString()}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Resolution</InputLabel>
                  <Select
                    value={resolution}
                    label="Resolution"
                    onChange={(e) => setResolution(e.target.value)}
                    className="bg-white rounded-xl"
                    endAdornment={
                      <IconButton
                        size="small"
                        onClick={() => setShowResolutionInfo(true)}
                        className="mr-8"
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    }
                  >
                    {resolutionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Delivery Date"
                    value={deliveryDate}
                    onChange={(newValue) => setDeliveryDate(newValue)}
                    minDate={new Date()}
                    className="bg-white rounded-xl"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        className: "bg-white rounded-xl",
                      },
                    }}
                  />
                </LocalizationProvider>

                <Paper className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <Typography variant="body2" className="text-slate-600">
                      Price
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-blue-600 font-bold"
                    >
                      ${calculatePrice()}
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Pay
                  </Button>
                </Paper>
              </div>

              {/* Upload and Notes Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Typography
                    variant="subtitle1"
                    className="text-slate-700 font-medium"
                  >
                    Upload .skp
                  </Typography>
                  <Paper className="border-2 border-dashed border-slate-300 rounded-xl p-6 md:p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white/50">
                    <Upload className="h-8 w-8 md:h-12 md:w-12 text-slate-400 mx-auto mb-4" />
                    <Typography className="text-slate-600 text-sm md:text-base">
                      Click to upload or drag and drop
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-slate-500 mt-2 block"
                    >
                      SketchUp files (.skp) up to 100MB
                    </Typography>
                  </Paper>
                </div>

                <div className="space-y-2">
                  <Typography
                    variant="subtitle1"
                    className="text-slate-700 font-medium"
                  >
                    Notes
                  </Typography>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any specific requirements or notes..."
                    className="bg-white rounded-xl"
                  />
                </div>
              </div>

              {/* Promotion Checkbox */}
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptPromotion}
                    onChange={(e) => setAcceptPromotion(e.target.checked)}
                  />
                }
                label="Accept - renders will be promoted on media (10% discount)"
                className="text-slate-600"
              /> */}

              {/* Place Order Button */}
              <div className="pt-6 border-t border-slate-200">
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700 text-lg py-3 rounded-xl"
                >
                  Place Order - ${calculatePrice()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rolling Images Gallery - Full Width with Manual Scroll */}
      <div className="w-full overflow-hidden py-8">
        {/* <Typography
          variant="h6"
          className="text-slate-900 font-semibold text-center mb-4"
        >
          Recent Projects
        </Typography> */}
        <div className="overflow-x-auto flex space-x-4 p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 md:w-80 h-40 md:h-48 relative rounded-lg overflow-hidden shadow-lg"
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
      <Dialog
        open={showResolutionInfo}
        onClose={() => setShowResolutionInfo(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Resolution Comparison</DialogTitle>
        <DialogContent>
          <Box className="p-4">
            <img
              src="https://picsum.photos/600/400"
              alt="Resolution comparison chart"
              className="w-full rounded-lg mb-4"
            />
            <div className="space-y-2 text-sm text-slate-600">
              <Typography variant="body2">
                <strong>HD (1920x1080):</strong> Standard quality for web use
              </Typography>
              <Typography variant="body2">
                <strong>2K (2048x1080):</strong> Enhanced detail for
                presentations
              </Typography>
              <Typography variant="body2">
                <strong>4K (3840x2160):</strong> High quality for large prints
              </Typography>
              <Typography variant="body2">
                <strong>8K (7680x4320):</strong> Ultra-high quality for
                professional use
              </Typography>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResolutionInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
//   Box,
//   Typography,
//   Paper,
//   IconButton,
//   Chip,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Upload, Info, CalendarMonth } from "@mui/icons-material";
// import { format } from "date-fns";

// export default function RenderConfigurator() {
//   const [renders, setRenders] = useState("3");
//   const [resolution, setResolution] = useState("2K");
//   const [deliveryDate, setDeliveryDate] = useState(null);
//   const [notes, setNotes] = useState("2 horizontal\n1 vertical");
//   const [acceptPromotion, setAcceptPromotion] = useState(false);
//   const [sliderPosition, setSliderPosition] = useState(50);
//   const [showResolutionInfo, setShowResolutionInfo] = useState(false);

//   const resolutionOptions = [
//     { value: "HD", label: "HD (1920x1080)", price: 50 },
//     { value: "2K", label: "2K (2048x1080)", price: 70 },
//     { value: "4K", label: "4K (3840x2160)", price: 120 },
//     { value: "8K", label: "8K (7680x4320)", price: 200 },
//   ];

//   const calculatePrice = () => {
//     const basePrice =
//       resolutionOptions.find((r) => r.value === resolution)?.price || 70;
//     const renderCount = Number.parseInt(renders);
//     const rushMultiplier =
//       deliveryDate &&
//       deliveryDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//         ? 1.5
//         : 1;
//     const promotionDiscount = acceptPromotion ? 0.9 : 1;

//     return Math.round(
//       basePrice * renderCount * rushMultiplier * promotionDiscount
//     );
//   };

//   const handleSliderMouseDown = (e) => {
//     const rect = e.currentTarget.parentElement?.getBoundingClientRect();
//     if (!rect) return;

//     const handleMouseMove = (e) => {
//       const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
//       setSliderPosition(Math.max(0, Math.min(100, newPosition)));
//     };

//     const handleMouseUp = () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <section
//       id="configurator"
//       className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-8 md:mb-16">
//           <Typography
//             variant="h3"
//             component="h2"
//             className="text-slate-900 mb-4 font-bold text-2xl sm:text-3xl md:text-4xl"
//           >
//             Configure Your Render Order
//           </Typography>
//           <Typography
//             variant="h6"
//             className="text-slate-600 max-w-2xl mx-auto text-base md:text-xl"
//           >
//             Customize your architectural rendering project with our easy-to-use
//             configurator
//           </Typography>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           <Card className="bg-white/80 backdrop-blur-sm shadow-2xl">
//             <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
//               {/* Before/After Slider Section */}
//               <div className="relative w-full h-48 md:h-80 rounded-xl overflow-hidden shadow-lg">
//                 <div className="absolute inset-0">
//                   <img
//                     src="https://picsum.photos/800/400"
//                     alt="Before render"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div
//                   className="absolute inset-0 overflow-hidden"
//                   style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
//                 >
//                   <img
//                     src="https://picsum.photos/800/401"
//                     alt="After render"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div
//                   className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
//                   style={{ left: `${sliderPosition}%` }}
//                   onMouseDown={handleSliderMouseDown}
//                 >
//                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
//                     <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full"></div>
//                   </div>
//                 </div>
//                 <Chip
//                   label="Original"
//                   className="!absolute bottom-4 left-4 !bg-black/50 !text-white"
//                   size="small"
//                 />
//                 <Chip
//                   label="AI Rendering"
//                   className="!absolute bottom-4 right-4 !bg-black/50 !text-white"
//                   size="small"
//                 />
//               </div>

//               {/* Configuration Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//                 <FormControl fullWidth>
//                   <InputLabel>Renders</InputLabel>
//                   <Select
//                     value={renders}
//                     label="Renders"
//                     onChange={(e) => setRenders(e.target.value)}
//                     className="bg-white rounded-xl"
//                   >
//                     {[1, 2, 3, 4, 5, 6, 10, 11].map((num) => (
//                       <MenuItem key={num} value={num.toString()}>
//                         {num}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <FormControl fullWidth>
//                   <InputLabel>Resolution</InputLabel>
//                   <Select
//                     value={resolution}
//                     label="Resolution"
//                     onChange={(e) => setResolution(e.target.value)}
//                     className="bg-white rounded-xl"
//                     endAdornment={
//                       <IconButton
//                         size="small"
//                         onClick={() => setShowResolutionInfo(true)}
//                         className="mr-8"
//                       >
//                         <Info fontSize="small" />
//                       </IconButton>
//                     }
//                   >
//                     {resolutionOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label="Delivery Date"
//                     value={deliveryDate}
//                     onChange={(newValue) => setDeliveryDate(newValue)}
//                     minDate={new Date()}
//                     className="bg-white rounded-xl"
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         className: "bg-white rounded-xl",
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>

//                 <Paper className="flex items-center justify-between p-3 bg-white rounded-xl">
//                   <div>
//                     <Typography variant="body2" className="text-slate-600">
//                       Price
//                     </Typography>
//                     <Typography
//                       variant="h6"
//                       className="text-blue-600 font-bold"
//                     >
//                       ${calculatePrice()}
//                     </Typography>
//                   </div>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     className="bg-blue-600 hover:bg-blue-700"
//                   >
//                     Pay
//                   </Button>
//                 </Paper>
//               </div>

//               {/* Rolling Images Gallery */}
//               <div className="space-y-4">
//                 <Typography
//                   variant="h6"
//                   className="text-slate-900 font-semibold"
//                 >
//                   Recent Projects
//                 </Typography>
//                 <div className="relative overflow-hidden rounded-xl">
//                   <div className="flex space-x-4 animate-scroll">
//                     {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//                       <div
//                         key={i}
//                         className="flex-shrink-0 w-48 md:w-64 h-32 md:h-40 relative rounded-lg overflow-hidden"
//                       >
//                         <img
//                           src={`https://picsum.photos/256/160?random=${i}`}
//                           alt={`Project ${i}`}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Upload and Notes Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                 <div className="space-y-2">
//                   <Typography
//                     variant="subtitle1"
//                     className="text-slate-700 font-medium"
//                   >
//                     Upload .skp
//                   </Typography>
//                   <Paper className="border-2 border-dashed border-slate-300 rounded-xl p-6 md:p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white/50">
//                     <Upload className="h-8 w-8 md:h-12 md:w-12 text-slate-400 mx-auto mb-4" />
//                     <Typography className="text-slate-600 text-sm md:text-base">
//                       Click to upload or drag and drop
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       className="text-slate-500 mt-2 block"
//                     >
//                       SketchUp files (.skp) up to 100MB
//                     </Typography>
//                   </Paper>
//                 </div>

//                 <div className="space-y-2">
//                   <Typography
//                     variant="subtitle1"
//                     className="text-slate-700 font-medium"
//                   >
//                     Notes
//                   </Typography>
//                   <TextField
//                     multiline
//                     rows={6}
//                     fullWidth
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     placeholder="Add any specific requirements or notes..."
//                     className="bg-white rounded-xl"
//                   />
//                 </div>
//               </div>

//               {/* Promotion Checkbox */}
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={acceptPromotion}
//                     onChange={(e) => setAcceptPromotion(e.target.checked)}
//                   />
//                 }
//                 label="Accept - renders will be promoted on media (10% discount)"
//                 className="text-slate-600"
//               />

//               {/* Place Order Button */}
//               <div className="pt-6 border-t border-slate-200">
//                 <Button
//                   variant="contained"
//                   size="large"
//                   fullWidth
//                   className="bg-blue-600 hover:bg-blue-700 text-lg py-3 rounded-xl"
//                 >
//                   Place Order - ${calculatePrice()}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Resolution Info Dialog */}
//       <Dialog
//         open={showResolutionInfo}
//         onClose={() => setShowResolutionInfo(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Resolution Comparison</DialogTitle>
//         <DialogContent>
//           <Box className="p-4">
//             <img
//               src="https://picsum.photos/600/400"
//               alt="Resolution comparison chart"
//               className="w-full rounded-lg mb-4"
//             />
//             <div className="space-y-2 text-sm text-slate-600">
//               <Typography variant="body2">
//                 <strong>HD (1920x1080):</strong> Standard quality for web use
//               </Typography>
//               <Typography variant="body2">
//                 <strong>2K (2048x1080):</strong> Enhanced detail for
//                 presentations
//               </Typography>
//               <Typography variant="body2">
//                 <strong>4K (3840x2160):</strong> High quality for large prints
//               </Typography>
//               <Typography variant="body2">
//                 <strong>8K (7680x4320):</strong> Ultra-high quality for
//                 professional use
//               </Typography>
//             </div>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowResolutionInfo(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       <style jsx>{`
//         @keyframes scroll {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//         .animate-scroll {
//           animation: scroll 20s linear infinite;
//         }
//       `}</style>
//     </section>
//   );
// }
