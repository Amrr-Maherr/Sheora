"use client";

import Link from "next/link";
import { AlertTriangle, Loader2, ShoppingBag } from "lucide-react";
import { CartLineItem } from "./CartLineItem";
import { CartTotalsPanel } from "./CartTotalsPanel";
import { CartUpsellCard } from "./CartUpsellCard";
import { CouponField } from "./CouponField";
import { FreeShippingBanner } from "./FreeShippingBanner";
import type {
  AppliedCoupon,
  CartLine,
  CartTotals,
  CouponResult,
} from "../types";

type CartPagePresenterProps = {
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  governorateSlug?: string | null;
  maxItemQuantity?: number;
  isLoading?: boolean;
  isUpdating?: boolean;
  error?: string | null;
  warnings?: string[];
  onSelectGovernorate?: (slug: string | null) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveLine: (id: string) => void;
  onAddUpsell: () => void;
  onApplyCoupon: (code: string) => Promise<CouponResult> | CouponResult;
  onRemoveCoupon: () => void;
};

export function CartPagePresenter({
  lines,
  totals,
  coupon,
  governorateSlug,
  maxItemQuantity = 10,
  isLoading = false,
  isUpdating = false,
  error = null,
  warnings = [],
  onSelectGovernorate,
  onUpdateQuantity,
  onRemoveLine,
  onAddUpsell,
  onApplyCoupon,
  onRemoveCoupon,
}: CartPagePresenterProps) {
  const isEmpty = lines.length === 0;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-7 flex flex-col gap-1.5 border-b border-[#EDE8E3] pb-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A44]">
          SHEORA
        </span>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-alexandria text-2xl font-bold text-[#151211] sm:text-3xl">
              سلة المشتريات
            </h1>
            {(isLoading || isUpdating) && (
              <Loader2 className="size-5 animate-spin text-[#B88A44]" />
            )}
          </div>
          <p className="text-[12px] text-[#78716C]">
            {totals.itemCount > 0
              ? `${totals.itemCount} منتجات في سلتك`
              : "لا توجد منتجات في سلتك"}
          </p>
        </div>
      </header>

      {warnings.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12px] text-amber-800">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-[13px]">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>تنبيهات السلة</span>
          </div>
          <ul className="list-inside list-disc space-y-1 text-amber-700">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-[12px] font-medium text-red-700">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#EDE8E3] bg-white py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[#FBF5EC] text-[#B88A44]">
            <ShoppingBag className="size-7" />
          </span>
          <div>
            <p className="font-alexandria text-[16px] font-bold text-[#141414]">
              سلة المشتريات فارغة
            </p>
            <p className="mt-1 text-[12px] text-[#78716C]">
              اكتشفي تشكيلة شيورا الفاخرة وابدئي التسوق الآن.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-1 rounded-xl bg-[#141414] px-5 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#B88A44]"
          >
            تسوقي الآن
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <ul className="space-y-3.5">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  maxItemQuantity={maxItemQuantity}
                  onQuantityChange={onUpdateQuantity}
                  onRemove={onRemoveLine}
                />
              ))}
            </ul>
            <CartUpsellCard onAdd={onAddUpsell} />
          </div>

          <aside className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] lg:sticky lg:top-28">
            <div className="mb-4">
              <FreeShippingBanner
                subtotal={totals.subtotal}
                threshold={totals.freeShippingThreshold}
                isFreeShipping={totals.isFreeShipping}
                shippingFee={totals.shipping}
                governorateName={totals.governorate?.nameAr}
              />
            </div>

            <h2 className="font-alexandria mb-3 text-[14px] font-bold text-[#151211]">
              ملخص الطلب
            </h2>
            <CouponField
              coupon={coupon}
              onApply={onApplyCoupon}
              onRemove={onRemoveCoupon}
            />
            <div className="mt-4">
              <CartTotalsPanel
                totals={totals}
                coupon={coupon}
                governorateSlug={governorateSlug}
                onSelectGovernorate={onSelectGovernorate}
                showViewCartLink={false}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
