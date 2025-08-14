// import ReactDOM from "react-dom";
// import { X } from "lucide-react";

// const ResolutionInfoDialog = ({ show, onClose }) => {
//   if (!show) return null;

//   return ReactDOM.createPortal(
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative bg-[#1C1C44] text-white rounded-xl shadow-2xl w-full max-w-4xl sm:max-w-md md:max-w-[800px] md:max-h-[700px] md:h-[600px] sm:max-h-[80vh] transform transition-all duration-300 scale-100 opacity-100 overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="px-6 py-2 border-b border-gray-700 flex justify-between items-center">
//           <h2 className="text-xl font-bold">Resolution Comparison</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
//             aria-label="Close dialog"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-5">
//           <div className="rounded-lg">
//             <div className="w-full mb-6 flex flex-col items-center">
//               <div className="relative w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center shadow-xl">
//                 <div className="absolute top-2 left-1.5 text-white font-bold text-xl sm:top-1 sm:left-1 ">
//                   8K
//                 </div>
//                 <div className="absolute w-[75%] h-[80%] bg-gray-700 rounded-lg flex items-center justify-center shadow-lg">
//                   <div className="absolute top-2 left-2 text-white font-bold text-xl sm:top-1 sm:left-1 sm:text-base">
//                     4K
//                   </div>
//                   <div className="absolute w-[70%] h-[73%] bg-gray-600 rounded-lg flex items-center justify-center shadow-md">
//                     <div className="absolute top-2 left-2 text-white font-bold text-xl sm:text-base">
//                       2K
//                     </div>
//                     <div className="absolute w-[57%] h-[60%] bg-gray-500 rounded-lg flex items-center justify-center text-gray-900 font-bold text-lg shadow-sm">
//                       <div className="absolute top-4 left-4 text-gray-900 font-bold text-lg sm:top-1 sm:left-1 sm:text-base">
//                         HD
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm text-gray-300">
//               <p>
//                 <strong>HD (1920x1080):</strong> Standard quality for web use
//               </p>
//               <p>
//                 <strong>2K (2048x1080):</strong> Enhanced detail for
//                 presentations
//               </p>
//               <p>
//                 <strong>4K (3840x2160):</strong> High quality for large prints
//               </p>
//               <p>
//                 <strong>8K (7680x4320):</strong> Ultra-high quality for
//                 professional use
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>,

//     document.getElementById("modal-root")
//   );
// };

// export default ResolutionInfoDialog;

// // // ResolutionInfoDialog.jsx
// // import React from "react";
// // import { X, Monitor } from "lucide-react";

// // const ResolutionInfoDialog = ({ show, onClose }) => {
// //   if (!show) return null;

// //   const resolutions = [
// //     {
// //       name: "HD (1920x1080)",
// //       description: "Standard high definition, perfect for web and social media",
// //       useCase: "Social media, web presentations, basic marketing materials",
// //       price: "$50",
// //     },
// //     {
// //       name: "2K (2048x1080)",
// //       description: "Cinema standard with wider aspect ratio",
// //       useCase: "Professional presentations, detailed architectural views",
// //       price: "$70",
// //     },
// //     {
// //       name: "4K (3840x2160)",
// //       description: "Ultra high definition with exceptional detail",
// //       useCase: "Large format printing, high-end marketing, detailed analysis",
// //       price: "$120",
// //     },
// //     {
// //       name: "8K (7680x4320)",
// //       description: "Maximum resolution for the highest quality output",
// //       useCase: "Premium presentations, large scale printing, future-proofing",
// //       price: "$200",
// //     },
// //   ];

// //   return (
// //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //       <div className="bg-[#1c1c44] border-2 border-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
// //         <div className="p-6">
// //           <div className="flex items-center justify-between mb-6">
// //             <div className="flex items-center">
// //               <Monitor className="text-blue-400 mr-3" size={24} />
// //               <h2 className="text-white text-2xl font-bold">
// //                 Resolution Guide
// //               </h2>
// //             </div>
// //             <button
// //               onClick={onClose}
// //               className="text-gray-400 hover:text-white transition-colors"
// //             >
// //               <X size={24} />
// //             </button>
// //           </div>

// //           <div className="space-y-4">
// //             {resolutions.map((res, index) => (
// //               <div
// //                 key={index}
// //                 className="bg-[#2a2a5a] rounded-lg p-4 border border-white/20"
// //               >
// //                 <div className="flex justify-between items-start mb-2">
// //                   <h3 className="text-white font-bold text-lg">{res.name}</h3>
// //                   <span className="text-[oklch(0.74_0.16_87.89)] font-bold text-lg">
// //                     {res.price}
// //                   </span>
// //                 </div>
// //                 <p className="text-gray-300 mb-2">{res.description}</p>
// //                 <p className="text-blue-300 text-sm">
// //                   <strong>Best for:</strong> {res.useCase}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
// //             <h4 className="text-blue-300 font-bold mb-2">💡 Pro Tip</h4>
// //             <p className="text-white text-sm">
// //               Higher resolutions provide more detail and flexibility for
// //               different output sizes. Consider your final use case when
// //               selecting resolution.
// //             </p>
// //           </div>

// //           <div className="mt-6 text-center">
// //             <button
// //               onClick={onClose}
// //               className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
// //             >
// //               Got it!
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResolutionInfoDialog;

import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const ResolutionInfoDialog = ({ show, onClose }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-[#1C1C44] to-[#2A2A6B] text-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto my-4 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with improved styling */}
        <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center bg-white/5 backdrop-blur-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Resolution Comparison
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-full group"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Content area with enhanced styling */}
        <div className="p-6">
          <div className="rounded-xl">
            {/* Visual comparison with improved design */}
            <div className="w-full mb-8 flex flex-col items-center">
              <div className="relative w-full h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center shadow-2xl border border-white/10">
                <div className="absolute top-3 left-3 text-white font-bold text-xl px-3 py-1 bg-black/30 rounded-lg backdrop-blur-sm">
                  8K
                </div>
                <div className="absolute w-[75%] h-[80%] bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center shadow-xl border border-white/5">
                  <div className="absolute top-3 left-3 text-white font-bold text-lg px-2 py-1 bg-black/30 rounded-lg backdrop-blur-sm">
                    4K
                  </div>
                  <div className="absolute w-[70%] h-[73%] bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center shadow-lg border border-white/5">
                    <div className="absolute top-2 left-2 text-white font-bold text-lg px-2 py-1 bg-black/30 rounded-md backdrop-blur-sm">
                      2K
                    </div>
                    <div className="absolute w-[57%] h-[60%] bg-gradient-to-br from-gray-600 to-gray-500 rounded-lg flex items-center justify-center shadow-md border border-white/5">
                      <div className="absolute top-2 left-2 text-gray-900 font-bold text-base px-2 py-1 bg-white/20 rounded-md backdrop-blur-sm">
                        HD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information cards with enhanced design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                <h3 className="font-bold text-blue-300 text-lg mb-2">
                  HD (1920x1080)
                </h3>
                <p className="text-gray-300">
                  Standard quality perfect for web use and basic presentations
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                <h3 className="font-bold text-green-300 text-lg mb-2">
                  2K (2048x1080)
                </h3>
                <p className="text-gray-300">
                  Enhanced detail ideal for professional presentations and small
                  prints
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                <h3 className="font-bold text-yellow-300 text-lg mb-2">
                  4K (3840x2160)
                </h3>
                <p className="text-gray-300">
                  High quality suitable for large prints and detailed viewing
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                <h3 className="font-bold text-purple-300 text-lg mb-2">
                  8K (7680x4320)
                </h3>
                <p className="text-gray-300">
                  Ultra-high quality for professional use and premium
                  applications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with improved styling */}
        <div className="px-6 py-4 border-t border-white/20 flex justify-end bg-white/5 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ResolutionInfoDialog;
