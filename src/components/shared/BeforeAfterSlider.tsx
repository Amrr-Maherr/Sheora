"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  hint?: string;
  ariaLabel?: string;
  className?: string;
  frameClassName?: string;
};

export function BeforeAfterSlider({
  beforeImage = "/images/figma/before_skin.png",
  afterImage = "/images/figma/after_skin.png",
  beforeLabel = "قبل الاستخدام",
  afterLabel = "بعد 14 يوماً فقط",
  hint = "حرّك المؤشر يميناً ويساراً للمقارنة المباشرة بين حالة البشرة",
  ariaLabel = "مقارنة قبل وبعد استخدام المنتج",
  className,
  frameClassName,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;

    const { left, width } = el.getBoundingClientRect();
    if (width <= 0) return;

    const next = ((clientX - left) / width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setPosition((prev) => Math.max(0, prev - step));
      return;
    }

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setPosition((prev) => Math.min(100, prev + step));
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}٪ ${beforeLabel}`}
        className={cn(
          "relative aspect-[4/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-[#EDE8E3] shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44] focus-visible:ring-offset-2",
          frameClassName,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div
          className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition-opacity sm:px-3.5 sm:text-[12px] sm:font-semibold"
          style={{ opacity: position > 8 ? 1 : 0 }}
        >
          {beforeLabel}
        </div>

        <div
          className="pointer-events-none absolute top-4 right-4 rounded-full bg-[#B88A44] px-3 py-1 text-[11px] font-medium text-white shadow-md transition-opacity sm:px-3.5 sm:text-[12px] sm:font-semibold"
          style={{ opacity: position < 92 ? 1 : 0 }}
        >
          {afterLabel}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${position}%` }}
        >
          <div className="relative h-full w-0.5 -translate-x-1/2 bg-white shadow-lg">
            <div className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#B88A44] text-white shadow-xl sm:size-10">
              <span className="text-[12px] font-bold sm:text-[13px]" aria-hidden>
                ⟷
              </span>
            </div>
          </div>
        </div>
      </div>

      {hint ? (
        <span className="mt-3 text-[12px] text-[#8C827A]">{hint}</span>
      ) : null}
    </div>
  );
}
