"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { CART_UPSELL } from "../lib/cartCatalog";
import { formatCurrency } from "../lib/format";

type CartUpsellCardProps = {
  onAdd: () => void;
  onNavigate?: () => void;
};

export function CartUpsellCard({ onAdd, onNavigate }: CartUpsellCardProps) {
  return (
    <section
      aria-label="اقتراح إضافة للسلة"
      className="rounded-xl border border-[#F0E9DE] bg-[#FBF9F5] p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-[11px] font-bold text-[#2A251D]">
          يكمل إطلالتك الفاخرة
          <span aria-hidden="true" className="text-[#B88B4A]">
            ✦
          </span>
        </p>
        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-[#8C672B]">
          سعر خاص بالسلة
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-white p-2.5">
        <Link
          href={CART_UPSELL.href}
          onClick={onNavigate}
          aria-label={CART_UPSELL.name}
          className="flex size-11 shrink-0 items-center justify-center rounded border border-[#EDE6DA] bg-[#F9F7F3] p-1"
        >
          <img
            src={CART_UPSELL.image}
            alt={CART_UPSELL.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={CART_UPSELL.href}
            onClick={onNavigate}
            className="block truncate text-[11px] font-bold text-[#1C1917] transition-colors hover:text-[#B88A44]"
          >
            {CART_UPSELL.name}
          </Link>
          <p className="mt-0.5 truncate text-[10px] text-[#78716C]">
            {CART_UPSELL.description}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5">
            {CART_UPSELL.compareAtPrice && (
              <span className="text-[9px] text-[#A8A19B] line-through">
                {formatCurrency(CART_UPSELL.compareAtPrice)}
              </span>
            )}
            <span className="text-[11px] font-bold text-[#1C1917]">
              {formatCurrency(CART_UPSELL.price)}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex shrink-0 items-center gap-1 rounded-md bg-[#FAF5ED] px-3 py-2 text-[10px] font-bold text-[#785923] ring-1 ring-[#EEE1CC] transition-colors hover:bg-[#B88A44] hover:text-white hover:ring-[#B88A44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
        >
          <Plus className="size-3" />
          إضافة للسلة
        </button>
      </div>
    </section>
  );
}
