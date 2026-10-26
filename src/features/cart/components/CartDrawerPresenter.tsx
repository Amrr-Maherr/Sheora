"use client";

import Link from "next/link";
import { Lock, ShoppingBag, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
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

type CartDrawerPresenterProps = {
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveLine: (id: string) => void;
  onAddUpsell: () => void;
  onApplyCoupon: (code: string) => CouponResult;
  onRemoveCoupon: () => void;
};

export function CartDrawerPresenter({
  lines,
  totals,
  coupon,
  isOpen,
  onOpenChange,
  onClose,
  onUpdateQuantity,
  onRemoveLine,
  onAddUpsell,
  onApplyCoupon,
  onRemoveCoupon,
}: CartDrawerPresenterProps) {
  const isEmpty = lines.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="h-[100dvh] w-full gap-0 overflow-y-auto overscroll-contain border-l border-[#E8E2DA] bg-white p-0 shadow-2xl [scrollbar-width:thin] sm:max-w-[470px]"
      >
        <SheetDescription className="sr-only">
          مراجعة المنتجات في سلة المشتريات وتعديل الكميات وإتمام الطلب.
        </SheetDescription>

        <div className="shrink-0 border-b border-[#F0EBE5] px-5 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FAF5EE] text-[#8C672B]"
            >
              <Lock className="size-3.5" />
            </div>

            <div className="flex min-w-0 items-center gap-2.5">
              <SheetTitle asChild>
                <h2 className="font-alexandria truncate text-[17px] font-bold text-[#141414]">
                  سلة المشتريات
                </h2>
              </SheetTitle>
              <span className="shrink-0 rounded-full border border-[#E3D1B7] bg-[#FAF4EB] px-2.5 py-0.5 text-[10px] font-semibold text-[#8C672B]">
                {totals.itemCount} منتجات
              </span>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                aria-label="إغلاق سلة المشتريات"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#A8A29E] transition-colors hover:bg-[#F5F1EB] hover:text-[#57534E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
              >
                <X className="size-[18px]" />
              </button>
            </SheetClose>
          </div>

          <div className="mt-3">
            <FreeShippingBanner subtotal={totals.subtotal} />
          </div>
        </div>

        <div className="flex-1 px-5 py-4">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-[#FBF5EC] text-[#B88A44]">
                <ShoppingBag className="size-7" />
              </span>
              <div>
                <p className="font-alexandria text-[15px] font-bold text-[#141414]">
                  سلة المشتريات فارغة
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#78716C]">
                  اكتشفي تشكيلة شيورا الفاخرة وابدئي التسوق الآن.
                </p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-1 rounded-xl bg-[#141414] px-5 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#B88A44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44] focus-visible:ring-offset-2"
              >
                تسوقي الآن
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3.5">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    onQuantityChange={onUpdateQuantity}
                    onRemove={onRemoveLine}
                  />
                ))}
              </ul>

              <div className="mt-4">
                <CartUpsellCard onAdd={onAddUpsell} onNavigate={onClose} />
              </div>

              <div className="mt-4">
                <CouponField
                  coupon={coupon}
                  onApply={onApplyCoupon}
                  onRemove={onRemoveCoupon}
                />
              </div>
            </>
          )}
        </div>

        {!isEmpty && (
          <div className="border-t border-[#ECE5DA] bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <CartTotalsPanel
              totals={totals}
              coupon={coupon}
              onNavigate={onClose}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
