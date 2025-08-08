import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const
CustomSelect = ({
  label,
  value,
  options,
  onChange,
  infoIcon,
  onInfoClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const displayLabel =
    options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <label className="block text-white font-bold text-lg">{label}</label>
        {infoIcon && onInfoClick && (
          <button
            type="button"
            onClick={onInfoClick}
            className="text-white hover:text-blue-400 p-1 rounded-full"
            aria-label={`${label} Information`}
          >
            {infoIcon}
          </button>
        )}
      </div>
      <div className="relative w-full" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-[#1c1c44] text-white text-center rounded-3xl border-2 border-white shadow-md shadow-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/40 transition-all duration-200 flex items-center justify-center relative pr-10"
        >
          <span className="text-lg">{displayLabel}</span>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            {isOpen ? (
              <ChevronUp className="h-4 w-4 fill-current" />
            ) : (
              <ChevronDown className="h-4 w-4 fill-current" />
            )}
          </div>
        </button>
        {isOpen && (
          <ul className="absolute z-20 w-full mt-2 bg-[#1c1c44] rounded-xl shadow-lg border-2 border-white max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`p-1 text-white cursor-pointer transition-colors duration-150 mx-2 my-1 rounded-2xl text-center text-lg ${
                  option.value === value
                    ? "bg-gray-400 font-bold"
                    : "bg-gray-700"
                } hover:bg-gray-500`}
              >
                {option.label || option.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;

// CustomSelect.jsx
// import React, { useState } from "react";
// import { ChevronDown } from "lucide-react";

// const CustomSelect = ({
//   label,
//   value,
//   options,
//   onChange,
//   infoIcon,
//   onInfoClick,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const selectedOption = options.find((option) => option.value === value);

//   return (
//     <div className="relative">
//       <label className="block text-white font-bold text-lg mb-4">
//         {label}
//         {infoIcon && (
//           <button
//             type="button"
//             onClick={onInfoClick}
//             className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
//           >
//             {infoIcon}
//           </button>
//         )}
//       </label>

//       <div className="relative">
//         <button
//           type="button"
//           onClick={() => setIsOpen(!isOpen)}
//           className="w-full p-3 bg-[#1c1c44] text-white text-center rounded-3xl border-2 border-white shadow-md shadow-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-white/50 hover:shadow-lg hover:shadow-white/40 transition-all duration-200 flex items-center justify-between"
//         >
//           <span className="flex-1">
//             {selectedOption?.label || selectedOption?.value}
//             {selectedOption?.price && (
//               <span className="text-[oklch(0.74_0.16_87.89)] ml-2">
//                 ${selectedOption.price}
//               </span>
//             )}
//           </span>
//           <ChevronDown
//             className={`w-5 h-5 transition-transform duration-200 ${
//               isOpen ? "transform rotate-180" : ""
//             }`}
//           />
//         </button>

//         {isOpen && (
//           <div className="absolute top-full left-0 right-0 mt-1 bg-[#1c1c44] border-2 border-white rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
//             {options.map((option) => (
//               <button
//                 key={option.value}
//                 type="button"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full p-3 text-left hover:bg-blue-500/20 transition-colors first:rounded-t-xl last:rounded-b-xl ${
//                   value === option.value
//                     ? "bg-blue-500/30 text-blue-300"
//                     : "text-white"
//                 }`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span>{option.label}</span>
//                   {option.price && (
//                     <span className="text-[oklch(0.74_0.16_87.89)] font-bold">
//                       ${option.price}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomSelect;
