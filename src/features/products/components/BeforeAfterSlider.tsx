"use client";

import { useState } from "react";

type BeforeAfterSliderProps = {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export function BeforeAfterSlider({
  beforeImage = "/images/figma/before_skin.png",
  afterImage = "/images/figma/after_skin.png",
  beforeLabel = "قبل الاستخدام",
  afterLabel = "بعد 14 يوماً فقط",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <div
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-[#EDE8E3] shadow-lg"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onMouseMove={(e) => {
          if (isDragging) {
            handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
        onTouchMove={(e) => {
          if (isDragging && e.touches[0]) {
            handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
      >
        {/* Background Image: After */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-[#B88A44] text-white text-[12px] font-semibold shadow-md">
          {afterLabel}
        </div>

        {/* Foreground Clipped Image: Before */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/75 text-white text-[12px] font-semibold backdrop-blur-sm shadow-md">
            {beforeLabel}
          </div>
        </div>

        {/* Draggable Divider Line & Golden Circular Handle */}
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="h-full w-0.5 bg-white shadow-2xl relative">
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full bg-[#B88A44] text-white border-2 border-white flex items-center justify-center shadow-2xl">
              <span className="text-[13px] font-bold">⟷</span>
            </div>
          </div>
        </div>
      </div>

      <span className="text-[12px] text-[#8C827A] mt-3">
        حرك المؤشر يميناً ويساراً لمقارنة تأثير الترطيب وإشراقة البشرة الحية
      </span>
    </div>
  );
}
