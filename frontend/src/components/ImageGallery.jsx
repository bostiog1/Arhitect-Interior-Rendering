import React, { useState, useRef, useCallback, useEffect } from "react";

const ImageGallery = () => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const autoScrollInterval = useRef(null);
  const scrollContainerRef = useRef(null);

  const startAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) return;

    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current && isAutoScrolling && !isDragging) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1;
        }
      }
    }, 20);
  }, [isAutoScrolling, isDragging]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsAutoScrolling(true);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setIsAutoScrolling(false);
    stopAutoScroll();

    const container = scrollContainerRef.current;
    setStartX(e.pageX);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = "grabbing";
    container.style.scrollBehavior = "auto"; // Disable smooth scrolling during drag
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !scrollContainerRef.current) return;

      e.preventDefault();
      const container = scrollContainerRef.current;
      const x = e.pageX;
      const walk = (x - startX) * 1.5; // Reduced multiplier for smoother drag
      container.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
      container.style.scrollBehavior = "smooth"; // Re-enable smooth scrolling
    }

    // Resume auto-scroll after a delay
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 1500);
  }, [isDragging]);

  const handleMouseLeaveWindow = useCallback(() => {
    if (isDragging) {
      handleMouseUp();
    }
  }, [isDragging, handleMouseUp]);

  // Add global event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseLeaveWindow);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleMouseLeaveWindow]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
    };
  }, [startAutoScroll]);

  useEffect(() => {
    if (isAutoScrolling && !isDragging) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  }, [isAutoScrolling, isDragging, startAutoScroll]);

  // Prevent context menu on right click during drag
  const handleContextMenu = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div
          className="overflow-x-auto flex px-4 scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
          ref={scrollContainerRef}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onContextMenu={handleContextMenu}
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

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
