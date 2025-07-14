import { useState, useRef, useCallback } from "react";
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

export default ImageSlider;
