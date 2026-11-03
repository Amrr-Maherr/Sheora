"use client";

import Link from "next/link";
import { Gift, Pencil, ShieldCheck, Truck } from "lucide-react";
import { CouponField } from "@/features/cart/components/CouponField";
import { formatCurrency } from "@/features/cart/lib/format";
import type {
  AppliedCoupon,
  CartLine,
  CartTotals,
  CouponResult,
} from "@/features/cart";

type CheckoutOrderSummaryProps = {
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  isUpdating?: boolean;
  onApplyCoupon: (code: string) => Promise<CouponResult> | CouponResult;
  onRemoveCoupon: () => void;
};

export function CheckoutOrderSummary({
  lines,
  totals,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
}: CheckoutOrderSummaryProps) {
  const shippingDisplay =
    totals.shippingStatus === "pending"
      ? "يُحدد حسب المحافظة"
      : totals.isFreeShipping || totals.shipping === 0
        ? "مجاني"
        : formatCurrency(totals.shipping);

  return (
    <aside className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3 border-b border-[#F0EBE5] pb-3">
        <h2 className="font-alexandria text-[15px] font-bold text-[#151211]">
          ملخص الطلب ({totals.itemCount} منتجات)
        </h2>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6426] transition-colors hover:text-[#B88A44]"
        >
          <Pencil className="size-3" />
          <span>تعديل السلة</span>
        </Link>
      </div>

      <ul className="divide-y divide-[#F4EFE9]">
        {lines.map((line) => (
          <li key={line.id} className="flex gap-3 py-3">
            <div className="flex h-[62px] w-[52px] shrink-0 items-center justify-center rounded-lg bg-[#FAF9F7] p-1.5">
              <img
                src={line.image}
                alt={line.name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[11.5px] font-bold leading-snug text-[#151211]">
                {line.name}
              </p>
              {line.note && (
                <p className="mt-0.5 line-clamp-1 text-[9.5px] text-[#8C827A]">
                  {line.note}
                </p>
              )}
              <p className="mt-1 text-[9.5px] text-[#A8A19B]">
                الكمية: {line.quantity}
              </p>
            </div>
            <span className="shrink-0 text-[11.5px] font-bold text-[#151211]">
              {formatCurrency(line.unitPrice * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-[#F0EBE5] pt-3">
        <CouponField
          coupon={coupon}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      <div className="mt-3 space-y-2 border-t border-[#F0EBE5] pt-3 text-[11px]">
        <SummaryRow label="مجموع المنتجات" value={formatCurrency(totals.subtotal)} />
        {coupon && totals.discount > 0 && (
          <SummaryRow
            label={`خصم كوبون (${coupon.code})`}
            value={`- ${formatCurrency(totals.discount)}`}
            tone="success"
          />
        )}
        <SummaryRow
          label="مصاريف الشحن"
          value={
            totals.isFreeShipping && totals.freeShippingThreshold
              ? `مجاني للطلبات فوق ${formatCurrency(totals.freeShippingThreshold)}`
              : shippingDisplay
          }
          tone={totals.isFreeShipping ? "gold" : "muted"}
        />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#ECE5DA] pt-3">
        <div>
          <p className="font-alexandria text-[13px] font-bold text-[#141414]">
            الإجمالي النهائي
          </p>
          <p className="mt-0.5 text-[9px] text-[#A8A29E]">
            شامل ضريبة القيمة المضافة والشحن
          </p>
        </div>
        <p className="font-alexandria text-[24px] font-bold leading-none text-[#8C6426]">
          {formatCurrency(totals.total)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#F0EBE5] pt-4 text-center">
        <TrustItem icon={<Truck className="size-4" />} label="شحن سريع" />
        <TrustItem icon={<Gift className="size-4" />} label="تغليف هدايا" />
        <TrustItem icon={<ShieldCheck className="size-4" />} label="أصالة 100%" />
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "gold" | "success";
}) {
  const toneClass =
    tone === "gold"
      ? "text-[#8C672B]"
      : tone === "success"
        ? "text-[#047857]"
        : "text-[#57534E]";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#78716C]">{label}</span>
      <span className={`shrink-0 font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

function TrustItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-[#B88A44]">
      {icon}
      <span className="text-[9.5px] font-medium text-[#78716C]">{label}</span>
    </div>
  );
}
