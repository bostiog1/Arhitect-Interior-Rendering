import ReactDOM from "react-dom";
import { X } from "lucide-react";

const ResolutionInfoDialog = ({ show, onClose }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1C1C44] text-white rounded-xl shadow-2xl w-full max-w-4xl sm:max-w-md md:max-w-[800px] md:max-h-[700px] md:h-[600px] sm:max-h-[80vh] transform transition-all duration-300 scale-100 opacity-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-2 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Resolution Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-lg">
            <div className="w-full mb-6 flex flex-col items-center">
              <div className="relative w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center shadow-xl">
                <div className="absolute top-2 left-1.5 text-white font-bold text-xl sm:top-1 sm:left-1 ">
                  8K
                </div>
                <div className="absolute w-[75%] h-[80%] bg-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="absolute top-2 left-2 text-white font-bold text-xl sm:top-1 sm:left-1 sm:text-base">
                    4K
                  </div>
                  <div className="absolute w-[70%] h-[73%] bg-gray-600 rounded-lg flex items-center justify-center shadow-md">
                    <div className="absolute top-2 left-2 text-white font-bold text-xl sm:text-base">
                      2K
                    </div>
                    <div className="absolute w-[57%] h-[60%] bg-gray-500 rounded-lg flex items-center justify-center text-gray-900 font-bold text-lg shadow-sm">
                      <div className="absolute top-4 left-4 text-gray-900 font-bold text-lg sm:top-1 sm:left-1 sm:text-base">
                        HD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <strong>HD (1920x1080):</strong> Standard quality for web use
              </p>
              <p>
                <strong>2K (2048x1080):</strong> Enhanced detail for
                presentations
              </p>
              <p>
                <strong>4K (3840x2160):</strong> High quality for large prints
              </p>
              <p>
                <strong>8K (7680x4320):</strong> Ultra-high quality for
                professional use
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
};

export default ResolutionInfoDialog;
