"use client";

import { useState } from "react";
import { ZoomIn, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
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
        {/* Floating Badges */}
        <div className="pointer-events-none absolute top-3 right-3 z-10 flex max-w-[min(100%-5.5rem,16rem)] flex-col gap-2 sm:top-5 sm:right-5">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#151211] px-2.5 py-1 text-[10px] font-bold text-[#E8B577] shadow-md sm:px-3 sm:text-[11px]">
            <Sparkles className="size-3 shrink-0 text-[#B88A44]" />
            <span className="truncate">الإصدار الذهبي الفاخر</span>
          </span>
          <span className="inline-block w-fit rounded-full bg-[#B94727] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md sm:text-[11px]">
            خصم خاص 20%
          </span>
        </div>

        {/* Zoom trigger badge */}
        <div className="pointer-events-none absolute top-3 left-3 z-10 hidden sm:block sm:top-5 sm:left-5">
          <span className="flex items-center gap-1 rounded-full border border-[#EDE8E3] bg-white/85 px-3 py-1 text-[11px] font-medium text-[#8C6426] shadow-xs backdrop-blur-xs">
            <ZoomIn className="size-3.5 shrink-0" />
            <span>تكبير فائق الدقة</span>
          </span>
        </div>

        {/* Main Image with Zoom Effect */}
        <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-7 md:p-8">
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
        </div>

        {/* Subtle bottom gradient & availability */}
        <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2 text-[10px] text-[#78716C] sm:right-5 sm:bottom-4 sm:left-5 sm:text-[11px]">
          <span className="flex min-w-0 items-center gap-1.5 font-medium text-[#2A7A4D]">
            <span className="size-1.5 shrink-0 rounded-full bg-[#2A7A4D] animate-ping" />
            <span className="truncate">متوفر بالمخزون للتجهيز الفوري</span>
          </span>
          <span className="shrink-0 font-mono text-[10px] text-[#A8A19B]">
            {activeIndex + 1} / {galleryImages.length}
          </span>
        </div>
      </div>

      {/* 2. Thumbnails Gallery Row */}
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

      {/* 3. Luxury Guarantees Banner */}
      <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#B88A44]/25 bg-[#FAF7F2] p-3.5 sm:items-center sm:gap-3.5 sm:p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/15 text-[#8C6426] sm:size-10">
          <ShieldCheck className="size-5" />
        </div>
        <div className="min-w-0 flex-1 text-right text-[11px] leading-snug sm:text-[12px]">
          <strong className="mb-0.5 block font-bold text-[#151211]">
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
