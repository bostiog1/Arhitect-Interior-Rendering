import { useState, useEffect } from "react";
import { Fab, Paper, Typography, Zoom, Fade } from "@mui/material";
import { Close, Phone, Email, Chat, Instagram } from "@mui/icons-material";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  // Show widget after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWidget(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const contactOptions = [
    {
      icon: Phone,
      label: "WhatsApp",
      action: () => window.open("https://wa.me/1234567890", "_blank"),
      color: "#25D366",
      hoverColor: "#128C7E",
    },
    {
      icon: Email,
      label: "Email",
      action: () => window.open("mailto:hello@archrender.com", "_blank"),
      color: "#3B82F6",
      hoverColor: "#2563EB",
    },
    {
      icon: Chat,
      label: "Messenger",
      action: () => window.open("https://m.me/yourpage", "_blank"),
      color: "#0084FF",
      hoverColor: "#006CE7",
    },
    {
      icon: Instagram,
      label: "Instagram",
      action: () => window.open("https://instagram.com/yourpage", "_blank"),
      color: "#E1306C",
      hoverColor: "#C13584",
    },
  ];

  if (!showWidget) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {/* Contact Options */}
      <div className="mb-4 space-y-2 flex flex-col items-end">
        {contactOptions.map((option, index) => (
          <Zoom
            key={index}
            in={isOpen}
            timeout={200 + index * 100}
            style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
          >
            <Fab
              size="medium"
              onClick={option.action}
              sx={{
                backgroundColor: option.color,
                "&:hover": {
                  backgroundColor: option.hoverColor,
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <option.icon sx={{ color: "white" }} />
            </Fab>
          </Zoom>
        ))}
      </div>

      {/* Main Contact Button */}
      <div className="relative">
        <Fab
          size="large"
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            backgroundColor: "#3B82F6",
            "&:hover": {
              backgroundColor: "#2563EB",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          {isOpen ? (
            <Close sx={{ color: "white" }} />
          ) : (
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
              <img
                src="https://picsum.photos/48/48?random=avatar"
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </Fab>

        {/* Help Tooltip */}
        <Fade in={!isOpen && showWidget} timeout={300}>
          <Paper
            className="absolute -top-2 -left-44 md:-left-48 p-2 md:p-3 shadow-lg"
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                top: "50%",
                right: "-8px",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "8px solid white",
              },
            }}
          >
            <Typography
              variant="body2"
              className="text-slate-700 text-xs md:text-sm whitespace-nowrap"
            >
              Need help? Click to contact us!
            </Typography>
          </Paper>
        </Fade>
      </div>
    </div>
  );
}
