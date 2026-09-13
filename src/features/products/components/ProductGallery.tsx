"use client";

import { useState } from "react";
import { ZoomIn, ShieldCheck, Sparkles } from "lucide-react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  // Ensure we have at least 4 thumbnails
  const fallbackImages = [
    "/images/figma/prod_lipstick.png",
    "/images/figma/prod_bottle.png",
    "/images/figma/prod_ingredients.png",
    "/images/figma/prod_extra.png",
  ];

  const galleryImages =
    images && images.length > 0
      ? [...images, ...fallbackImages.slice(images.length)].slice(0, 4)
      : fallbackImages;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Main Product Stage */}
      <div
        className="group relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#EDE8E3] shadow-md flex items-center justify-center p-8 cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Floating Badges */}
        <div className="absolute top-5 right-5 flex flex-col gap-2 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151211] text-[#E8B577] text-[11px] font-bold shadow-md">
            <Sparkles className="size-3 text-[#B88A44]" />
            <span>الإصدار الذهبي الفاخر</span>
          </span>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B94727] text-white text-[11px] font-bold shadow-md w-fit">
            خصم خاص 20%
          </span>
        </div>

        {/* Zoom trigger badge */}
        <div className="absolute top-5 left-5 z-10 pointer-events-none">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/85 text-[#8C6426] border border-[#EDE8E3] text-[11px] font-medium shadow-xs backdrop-blur-xs">
            <ZoomIn className="size-3.5" />
            <span>تكبير فائق الدقة</span>
          </span>
        </div>

        {/* Main Image with Zoom Effect */}
        <img
          src={galleryImages[activeIndex]}
          alt={productName}
          className={`max-h-[85%] max-w-[85%] object-contain transition-transform duration-200 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        {/* Subtle bottom gradient & availability */}
        <div className="absolute bottom-4 right-5 left-5 flex items-center justify-between text-[11px] text-[#78716C] pointer-events-none">
          <span className="flex items-center gap-1.5 text-[#2A7A4D] font-medium">
            <span className="size-1.5 rounded-full bg-[#2A7A4D] animate-ping" />
            <span>متوفر بالمخزون للتجهيز الفوري</span>
          </span>
          <span className="text-[#A8A19B] font-mono text-[10px]">
            {activeIndex + 1} / {galleryImages.length}
          </span>
        </div>
      </div>

      {/* 2. Thumbnails Gallery Row */}
      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-white p-2 border transition-all cursor-pointer ${
              activeIndex === idx
                ? "border-[#B88A44] shadow-md ring-2 ring-[#B88A44]/20 scale-102"
                : "border-[#EDE8E3] hover:border-[#B88A44]/50 opacity-80 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`${productName} - thumbnail ${idx + 1}`}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* 3. Luxury Guarantees Banner */}
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAF7F2] border border-[#B88A44]/25">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/15 text-[#8C6426]">
          <ShieldCheck className="size-5" />
        </div>
        <div className="text-right text-[12px] leading-snug">
          <strong className="font-bold text-[#151211] block mb-0.5">
            ميثاق التميز والأصالة من دار شِيورا
          </strong>
          <span className="text-[#78716C]">
            مستحضرات فرنسية نقية 100% مختبرة سريرياً وخالية من البارابين • ضمان أصلي 100%
          </span>
        </div>
      </div>
    </div>
  );
}
