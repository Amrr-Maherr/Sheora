"use client";

import Link from "next/link";
import { Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../lib/format";
import type { CartLine } from "../types";

type CartLineItemProps = {
  line: CartLine;
  maxItemQuantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

const badgeToneStyles: Record<NonNullable<CartLine["badgeTone"]>, string> = {
  perfume: "bg-[#141414] text-[#E8E2D8]",
  makeup: "bg-[#7D1B28] text-white",
  default: "bg-[#141414] text-[#E8E2D8]",
};

export function CartLineItem({
  line,
  maxItemQuantity,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const hasComparePrice =
    line.compareAtPrice !== undefined && line.compareAtPrice > line.unitPrice;
  const stockLimit =
    line.stockAvailable && line.stockAvailable > 0
      ? line.stockAvailable
      : maxItemQuantity;
  const lineMaximum = Math.max(1, Math.min(maxItemQuantity, stockLimit));

  return (
    <li className="flex gap-3 rounded-xl bg-[#FCFAF7] p-3">
      <div className="relative shrink-0">
        <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-white p-1.5">
          <img
            src={line.image}
            alt={line.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
        {line.badge && (
          <span
            className={cn(
              "absolute start-1 top-1 rounded px-1.5 py-0.5 text-[9px] font-medium leading-3.5",
              badgeToneStyles[line.badgeTone ?? "default"],
            )}
          >
            {line.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={line.href}
              className="font-alexandria line-clamp-2 text-[12px] font-bold leading-snug text-[#1C1917] transition-colors hover:text-[#B88A44]"
            >
              {line.name}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(line.id)}
              aria-label={`حذف ${line.name} من السلة`}
              className="relative mt-0.5 shrink-0 rounded p-0.5 text-[#C4BDB6] transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-[#B94727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-[#78716C]">
            {line.note}
          </p>

          {line.customization && (
            <span className="mt-1.5 inline-flex max-w-full items-center gap-1 rounded border border-[#EADFD0] bg-[#F6F0E6] px-2 py-0.5 text-[10px] font-medium text-[#7A5A24]">
              <Pencil className="size-2.5 shrink-0 text-[#B88B4A]" />
              <span className="line-clamp-1">{line.customization}</span>
            </span>
          )}

          {line.swatch && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full ring-1 ring-black/5"
                style={{ backgroundColor: line.swatch }}
              />
              {line.swatchLabel && (
                <span className="text-[10px] leading-4 text-[#78716C]">
                  {line.swatchLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1.5 leading-tight">
            <span className="text-[12px] font-bold text-[#1C1917]">
              {formatCurrency(line.unitPrice)}
            </span>
            {hasComparePrice && (
              <span className="text-[10px] text-[#A8A19B] line-through">
                {formatCurrency(line.compareAtPrice as number)}
              </span>
            )}
          </div>

          <div className="flex h-8 items-center overflow-hidden rounded-md border border-[#E4E0D8] bg-white">
            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  line.id,
                  Math.max(1, Math.min(line.quantity, lineMaximum) - 1),
                )
              }
              disabled={line.quantity <= 1}
              aria-label={`تقليل كمية ${line.name}`}
              className="flex h-full w-7 items-center justify-center text-[#57534E] transition-colors hover:bg-[#F5F1EB] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B88A44]"
            >
              <Minus className="size-3" />
            </button>
            <span
              aria-live="polite"
              className="flex h-full min-w-7 items-center justify-center bg-[#F8F9FB] px-1 text-[11px] font-bold text-[#292524]"
            >
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  line.id,
                  Math.min(lineMaximum, line.quantity + 1),
                )
              }
              disabled={line.quantity >= lineMaximum}
              aria-label={`زيادة كمية ${line.name}`}
              className="flex h-full w-7 items-center justify-center text-[#57534E] transition-colors hover:bg-[#F5F1EB] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B88A44]"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
