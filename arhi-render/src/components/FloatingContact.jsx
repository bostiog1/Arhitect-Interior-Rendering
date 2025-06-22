import { useState, useEffect, useRef } from "react";
// Import Lucide icons instead of MUI icons for consistency with Tailwind
import { Phone, Mail, MessageSquare, Instagram, X } from "lucide-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  // New state to control the visibility of just the tooltip message
  const [showHelpTooltip, setShowHelpTooltip] = useState(true);
  const containerRef = useRef(null);

  // Show widget after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWidget(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close main contact options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
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

  const contactOptions = [
    {
      icon: Phone,
      label: "WhatsApp",
      action: () => window.open("https://wa.me/1234567890", "_blank"),
      color: "#25D366", // WhatsApp Green
      hoverColor: "#128C7E", // Darker WhatsApp Green
    },
    {
      icon: Mail, // Lucide Mail icon
      label: "Email",
      action: () => window.open("mailto:hello@archrender.com", "_blank"),
      color: "#3B82F6", // Blue-500
      hoverColor: "#2563EB", // Blue-600
    },
    {
      icon: MessageSquare, // Lucide MessageSquare icon for chat
      label: "Messenger",
      action: () => window.open("https://m.me/yourpage", "_blank"),
      color: "#0084FF", // Facebook Messenger Blue
      hoverColor: "#006CE7", // Darker Messenger Blue
    },
    {
      icon: Instagram,
      label: "Instagram",
      action: () => window.open("https://instagram.com/yourpage", "_blank"),
      color: "#E1306C", // Instagram Red/Pink
      hoverColor: "#C13584", // Darker Instagram
    },
  ];

  if (!showWidget) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
    >
      {/* Contact Options */}
      <div className="mb-4 space-y-3 flex flex-col items-end">
        {contactOptions.map((option, index) => {
          const IconComponent = option.icon; // Use Lucide IconComponent
          return (
            <div
              key={index}
              className={`
                w-12 h-12 md:w-14 md:h-14 rounded-full
                flex items-center justify-center text-white
                shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out
                hover:scale-110 active:scale-95
                ${
                  isOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-75 pointer-events-none"
                }
              `}
              style={{
                backgroundColor: option.color,
                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = option.hoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = option.color)
              }
              onClick={option.action}
            >
              <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          );
        })}
      </div>

      {/* Main Contact Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-500 hover:bg-blue-600
            flex items-center justify-center text-white shadow-lg
            transform transition-all duration-300 ease-in-out hover:scale-110 active:scale-95
            focus:outline-none focus:ring-4 focus:ring-blue-300
          "
          style={{
            boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          {isOpen ? (
            <X className="w-7 h-7 md:w-8 md:h-8" />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
              <img
                src="https://picsum.photos/48/48?random=avatar"
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </button>

        {/* Help Tooltip */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 right-16 md:right-20
            bg-white rounded-xl shadow-lg p-3 md:p-4
            transition-all duration-300 ease-in-out transform
            ${
              // Tooltip is shown if: not open, widget is active, AND showHelpTooltip is true
              !isOpen && showWidget && showHelpTooltip
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-4 scale-95 pointer-events-none"
            }
          `}
        >
          <div className="relative flex items-center">
            <p className="text-gray-700 text-xs md:text-sm font-medium whitespace-nowrap mr-2">
              {" "}
              {/* Added mr-2 */}
              Need help? Click to contact us!
            </p>
            {/* Close Button for Tooltip */}
            <button
              type="button"
              onClick={() => setShowHelpTooltip(false)} // Sets the tooltip state to false
              className="p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer text-gray-500"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3 md:w-4 md:h-4" /> {/* Smaller X icon */}
            </button>

            {/* Tooltip Arrow */}
            <div
              className="absolute right-0 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "8px solid white",
                transform: "translateY(50%) translateX(100%)",
                right: "-20px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
