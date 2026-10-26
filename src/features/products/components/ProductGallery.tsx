"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  inStock?: boolean;
};

export function ProductGallery({
  images,
  productName,
  inStock = false,
}: ProductGalleryProps) {
  const galleryImages = (images ?? [])
    .filter((image) => !image.includes("placehold.co"))
    .slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      {/* 1. Main Product Stage */}
      <div
        className="group relative aspect-square w-full min-w-0 overflow-hidden rounded-2xl border border-[#EDE8E3] bg-white shadow-md sm:rounded-3xl"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Zoom trigger badge */}
        <div className="pointer-events-none absolute top-3 left-3 z-10 hidden sm:block sm:top-5 sm:left-5">
          <span className="flex items-center gap-1 rounded-full border border-[#EDE8E3] bg-white/85 px-3 py-1 text-[11px] font-medium text-[#8C6426] shadow-xs backdrop-blur-xs">
            <ZoomIn className="size-3.5 shrink-0" />
            <span>تكبير فائق الدقة</span>
          </span>
        </div>

        {/* Main Image with Zoom Effect */}
        <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-7 md:p-8">
          {galleryImages[activeIndex] ? (
            <img
              src={galleryImages[activeIndex]}
              alt={productName}
              draggable={false}
              className={cn(
                "h-full w-full max-h-full max-w-full object-contain transition-transform duration-200 will-change-transform",
                "max-sm:cursor-default sm:cursor-crosshair",
                isZoomed ? "sm:scale-150" : "scale-100",
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }
                  : undefined
              }
            />
          ) : (
            <span className="text-[13px] text-[#8C827A]">
              لا توجد صورة متاحة
            </span>
          )}
        </div>

        {/* Subtle bottom gradient & availability */}
        <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2 text-[10px] text-[#78716C] sm:right-5 sm:bottom-4 sm:left-5 sm:text-[11px]">
          <span
            className={`flex min-w-0 items-center gap-1.5 font-medium ${
              inStock ? "text-[#2A7A4D]" : "text-[#8C827A]"
            }`}
          >
            <span
              className={`size-1.5 shrink-0 rounded-full ${
                inStock ? "bg-[#2A7A4D]" : "bg-[#A8A19B]"
              }`}
            />
            <span className="truncate">
              {inStock ? "متوفر للشراء" : "غير متوفر حالياً"}
            </span>
          </span>
          {galleryImages.length > 0 ? (
            <span className="shrink-0 font-mono text-[10px] text-[#A8A19B]">
              {activeIndex + 1} / {galleryImages.length}
            </span>
          ) : null}
        </div>
      </div>

      {/* 2. Thumbnails Gallery Row */}
      {galleryImages.length > 1 && (
      <div className="grid w-full min-w-0 grid-cols-4 gap-2 sm:gap-3">
        {galleryImages.map((img, idx) => (
          <button
            key={img}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl border bg-white p-1.5 transition-all sm:rounded-2xl sm:p-2",
              activeIndex === idx
                ? "border-[#B88A44] shadow-md ring-2 ring-[#B88A44]/20"
                : "border-[#EDE8E3] opacity-80 hover:border-[#B88A44]/50 hover:opacity-100",
            )}
          >
            <img
              src={img}
              alt={`${productName} - thumbnail ${idx + 1}`}
              draggable={false}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>
      )}
    </div>
  );
}
