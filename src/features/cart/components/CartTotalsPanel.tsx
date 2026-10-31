"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, MapPin, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../lib/format";
import { cartApi } from "../api/cartApi";
import type { AppliedCoupon, BackendGovernorate, CartTotals } from "../types";

type CartTotalsPanelProps = {
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  governorateSlug?: string | null;
  onSelectGovernorate?: (slug: string | null) => void;
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
  governorateSlug,
  onSelectGovernorate,
  onNavigate,
  showViewCartLink = true,
}: CartTotalsPanelProps) {
  const [governorates, setGovernorates] = useState<BackendGovernorate[]>([]);

  useEffect(() => {
    let mounted = true;
    cartApi
      .getGovernorates()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setGovernorates(data);
        }
      })
      .catch(() => {
        // ignore error
      });

    return () => {
      mounted = false;
    };
  }, []);

  const shippingDisplay = (() => {
    if (totals.shippingStatus === "pending") {
      return { text: "يُحدد حسب المحافظة", tone: "muted" as const };
    }
    if (totals.shippingStatus === "unsupported") {
      return { text: "غير متوفر للتوصيل", tone: "muted" as const };
    }
    if (totals.isFreeShipping || totals.shipping === 0) {
      return { text: "مجاني", tone: "gold" as const };
    }
    return { text: formatCurrency(totals.shipping), tone: "gold" as const };
  })();

  const activeSlug = governorateSlug ?? totals.governorate?.slug ?? "";

  return (
    <div className="space-y-3">
      {/* Governorate Selector */}
      {onSelectGovernorate && governorates.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EAE4DB] bg-[#FAF9F6] p-2 text-[11px]">
          <MapPin className="size-3.5 shrink-0 text-[#8C672B]" />
          <span className="shrink-0 text-[#78716C]">التوصيل إلى:</span>
          <select
            value={activeSlug}
            onChange={(e) => onSelectGovernorate(e.target.value || null)}
            aria-label="اختر المحافظة لحساب الشحن"
            className="w-full bg-transparent font-medium text-[#1C1917] outline-none cursor-pointer"
          >
            <option value="">-- اختاري المحافظة --</option>
            {governorates.map((gov) => (
              <option key={gov.slug} value={gov.slug}>
                {gov.name_ar} ({gov.name_en})
              </option>
            ))}
          </select>
        </div>
      )}

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
          label="مصاريف الشحن:"
          value={shippingDisplay.text}
          tone={shippingDisplay.tone}
        />

      </div>

      <div className="border-t border-[#ECE5DA] pt-2.5">
        <div className="flex items-end justify-between gap-3">
          <div className="text-right">
            <p className="font-alexandria text-[13px] font-bold text-[#141414]">
              الإجمالي النهائي:
            </p>
            <p className="mt-0.5 text-[9px] leading-4 text-[#A8A29E]">
              {totals.shippingStatus === "pending"
                ? "شامل الضريبة (بدون مصاريف الشحن حتى الآن)"
                : "شامل ضريبة القيمة المضافة والشحن"}
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
