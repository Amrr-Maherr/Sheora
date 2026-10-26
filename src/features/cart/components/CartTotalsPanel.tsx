"use client";

import Link from "next/link";
import { Lock, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../lib/format";
import type { AppliedCoupon, CartTotals } from "../types";

type CartTotalsPanelProps = {
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  onNavigate?: () => void;
  showViewCartLink?: boolean;
};

function SummaryRow({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "gold" | "success" | "default";
}) {
  const valueStyles: Record<typeof tone, string> = {
    muted: "text-[#78716C]",
    gold: "text-[#8C672B]",
    success: "text-[#047857]",
    default: "text-[#1C1917]",
  };

  return (
    <div className="flex items-center justify-between gap-3 text-[11px] leading-5">
      <span className="text-[#78716C]">{label}</span>
      <span className={`shrink-0 font-medium ${valueStyles[tone]}`}>{value}</span>
    </div>
  );
}

export function CartTotalsPanel({
  totals,
  coupon,
  onNavigate,
  showViewCartLink = true,
}: CartTotalsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <SummaryRow
          label="مجموع المنتجات:"
          value={formatCurrency(totals.subtotal)}
        />
        {coupon && totals.discount > 0 && (
          <SummaryRow
            label={`خصم كود (${coupon.code}):`}
            value={`- ${formatCurrency(totals.discount)}`}
            tone="success"
          />
        )}
        <SummaryRow
          label="مصاريف الشحن السريع:"
          value={
            totals.shipping === 0 ? "مجاني" : formatCurrency(totals.shipping)
          }
          tone="gold"
        />
        <SummaryRow
          label="تغليف الهدايا الملكي مع كارت:"
          value="مجاناً مع الطلب"
          tone="gold"
        />
      </div>

      <div className="border-t border-[#ECE5DA] pt-2.5">
        <div className="flex items-end justify-between gap-3">
          <div className="text-right">
            <p className="font-alexandria text-[13px] font-bold text-[#141414]">
              الإجمالي النهائي:
            </p>
            <p className="mt-0.5 text-[9px] leading-4 text-[#A8A29E]">
              شامل ضريبة القيمة المضافة والشحن
            </p>
          </div>
          <p className="font-alexandria text-[18px] font-bold leading-none text-[#141414]">
            {formatCurrency(totals.total)}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <Link
          href="/checkout"
          onClick={onNavigate}
          className="group flex h-12 w-full items-center justify-between gap-3 rounded-xl bg-[#141414] px-4 text-white shadow-[0_8px_24px_rgba(20,20,20,0.18)] transition-colors hover:bg-[#B88A44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44] focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-2 text-[13px] font-bold">
            <Lock className="size-4" />
            إتمام الطلب بأمان
          </span>
          <span className="text-[13px] font-bold text-[#E8B577] transition-colors group-hover:text-white">
            {formatCurrency(totals.total)}
          </span>
        </Link>

        {showViewCartLink && (
          <Link
            href="/cart"
            onClick={onNavigate}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#CFBC9F] bg-[#FAF9F6] text-[12px] font-medium text-[#2C2419] transition-colors hover:border-[#B88A44] hover:bg-[#FBF5EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="size-4 text-[#8C672B]" />
            عرض سلة المشتريات بالكامل
          </Link>
        )}
      </div>
    </div>
  );
}
