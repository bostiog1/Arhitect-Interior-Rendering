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
    setIsDragging(true);
    setIsAutoScrolling(false);
    stopAutoScroll();
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 1000);
  };

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

  return (
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
  );
};

export default ImageGallery;
