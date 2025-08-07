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

// ResolutionInfoDialog.jsx
import React from "react";
import { X, Monitor } from "lucide-react";

const ResolutionInfoDialog = ({ show, onClose }) => {
  if (!show) return null;

  const resolutions = [
    {
      name: "HD (1920x1080)",
      description: "Standard high definition, perfect for web and social media",
      useCase: "Social media, web presentations, basic marketing materials",
      price: "$50",
    },
    {
      name: "2K (2048x1080)",
      description: "Cinema standard with wider aspect ratio",
      useCase: "Professional presentations, detailed architectural views",
      price: "$70",
    },
    {
      name: "4K (3840x2160)",
      description: "Ultra high definition with exceptional detail",
      useCase: "Large format printing, high-end marketing, detailed analysis",
      price: "$120",
    },
    {
      name: "8K (7680x4320)",
      description: "Maximum resolution for the highest quality output",
      useCase: "Premium presentations, large scale printing, future-proofing",
      price: "$200",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1c1c44] border-2 border-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Monitor className="text-blue-400 mr-3" size={24} />
              <h2 className="text-white text-2xl font-bold">
                Resolution Guide
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {resolutions.map((res, index) => (
              <div
                key={index}
                className="bg-[#2a2a5a] rounded-lg p-4 border border-white/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-bold text-lg">{res.name}</h3>
                  <span className="text-[oklch(0.74_0.16_87.89)] font-bold text-lg">
                    {res.price}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{res.description}</p>
                <p className="text-blue-300 text-sm">
                  <strong>Best for:</strong> {res.useCase}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
            <h4 className="text-blue-300 font-bold mb-2">💡 Pro Tip</h4>
            <p className="text-white text-sm">
              Higher resolutions provide more detail and flexibility for
              different output sizes. Consider your final use case when
              selecting resolution.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionInfoDialog;
