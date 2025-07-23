import React from "react";
import ImageSlider from "./ImageSlider";
import ImageGallery from "./ImageGallery";
import RenderConfigurationForm from "./RenderConfigurationForm"; // Import the new component

export default function RenderConfigurator() {
  return (
    <section
      id="configurator"
      className="w-full bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{ backgroundColor: "#1C1C44" }}
    >
      <div className="w-full">
        <div className="w-full mx-auto">
          {/* Before/After Slider Section - Full Width */}
          <div className="w-full">
            <ImageSlider
              beforeImage="https://picsum.photos/id/10/1200/675"
              afterImage="https://picsum.photos/id/10/1200/675?grayscale"
            />
          </div>

          {/* Render Configuration Form Section */}
          <RenderConfigurationForm />
        </div>
      </div>

      {/* Rolling Images Gallery - Full Width with Manual Scroll */}
      <ImageGallery />
    </section>
  );
}
