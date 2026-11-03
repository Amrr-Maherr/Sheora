"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gift,
  Heart,
  RefreshCw,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import {
  WISHLIST_CATEGORIES,
  WISHLIST_SORT_OPTIONS,
  type WishlistCategory,
  type WishlistSort,
} from "../lib/wishlistFilters";
import { WishlistCard } from "./WishlistCard";

type WishlistPresenterProps = {
  products: Product[];
  visibleProducts: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  category: WishlistCategory;
  onCategoryChange: (category: WishlistCategory) => void;
  sort: WishlistSort;
  onSortChange: (sort: WishlistSort) => void;
  onRemove: (productId: string) => void;
  removingProductId: string | null;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  isAdding: boolean;
  onAddAll: () => void;
  onShare: () => Promise<void>;
};

function LoadingView() {
  return (
    <div className="space-y-5">
      <div className="h-40 animate-pulse rounded-2xl border border-[#EDE8E3] bg-white" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-96 animate-pulse rounded-2xl border border-[#EDE8E3] bg-white"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-[#EDE8E3] bg-white px-5 py-12 text-center">
      <RefreshCw className="mx-auto size-8 text-[#B88A44]" />
      <h2 className="mt-3 font-alexandria text-[16px] font-bold text-[#151211]">
        تعذّر تحميل قائمة الرغبات
      </h2>
      <p className="mt-1 text-[11px] text-[#8C827A]">
        حدث خطأ أثناء جلب منتجاتك المفضلة. حاولي مرة أخرى.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#151211] px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#B88A44]"
      >
        <RefreshCw className="size-3.5" />
        إعادة المحاولة
      </button>
    </div>
  );
}

function GiftBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#151211] px-5 py-6 text-white">
      <span className="absolute -left-8 -top-10 size-32 rounded-full bg-[#B88A44]/20" />
      <span className="absolute -bottom-14 right-16 size-40 rounded-full bg-[#B88A44]/10" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/20 text-[#E8B577]">
            <Gift className="size-5" />
          </span>
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-[#E8B577]">
              <Sparkles className="size-3" />
              هدية من SHEORA
            </p>
            <h2 className="mt-1 font-alexandria text-[16px] font-bold">
              تغليف هدايا فاخر مجاناً
            </h2>
            <p className="mt-1 max-w-md text-[11px] leading-relaxed text-white/65">
              مع كل طلب من قائمة رغباتك، نغلّف مشترياتك بعناية ونضيف بطاقة
              إهداء مجانية.
            </p>
          </div>
        </div>
        <Link
          href="/products"
          className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-[#E8B577]/40 bg-white/5 px-4 py-2 text-[11px] font-semibold text-[#E8B577] transition-colors hover:bg-[#B88A44] hover:text-white"
        >
          اكتشفي المزيد
          <ArrowLeft className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}

export function WishlistPresenter({
  products,
  visibleProducts,
  isLoading,
  isError,
  onRetry,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  onRemove,
  removingProductId,
  onAddToCart,
  isAdding,
  onAddAll,
  onShare,
}: WishlistPresenterProps) {
  const [isShared, setIsShared] = useState(false);
  const totalCount = products.length;

  const handleShare = async () => {
    await onShare();
    setIsShared(true);
    window.setTimeout(() => setIsShared(false), 1800);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return <ErrorView onRetry={onRetry} />;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E9D9BE] bg-[#FBF5EC] px-2.5 py-1 text-[10px] font-semibold text-[#8C6426]">
              <Heart className="size-3 fill-[#B88A44] text-[#B88A44]" />
              قائمة الرغبات
            </span>
            <h1 className="mt-2 font-alexandria text-[20px] font-bold text-[#151211] sm:text-[23px]">
              قائمة رغباتي
            </h1>
            <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-[#706E6B] sm:text-[12px]">
              {totalCount > 0
                ? `لديكِ ${totalCount} ${totalCount === 1 ? "منتج" : "منتجات"} محفوظة. أضيفيها إلى سلتك قبل نفاد الكمية.`
                : "احفظي منتجاتك المفضلة هنا لتجديها بسهولة في أي وقت."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={totalCount === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4DDD3] bg-white px-3 py-2 text-[11px] font-semibold text-[#554F49] transition-colors hover:border-[#B88A44] hover:text-[#8C6426] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Share2 className="size-3.5" />
              {isShared ? "تم النسخ!" : "مشاركة القائمة"}
            </button>
            <button
              type="button"
              onClick={onAddAll}
              disabled={totalCount === 0 || isAdding}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#151211] px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#B88A44] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="size-3.5" />
              إضافة الكل للسلة
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#F0EBE5] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {WISHLIST_CATEGORIES.map((item) => {
              const isActive = category === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onCategoryChange(item.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    isActive
                      ? "border-[#B88A44] bg-[#B88A44] text-white"
                      : "border-[#E4DDD3] bg-white text-[#706E6B] hover:border-[#D8C29A] hover:text-[#8C6426]",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-[#E4DDD3] bg-white px-2.5 py-1.5 text-[11px] text-[#706E6B]">
            <SlidersHorizontal className="size-3.5 text-[#B88A44]" />
            <span className="sr-only">ترتيب المنتجات</span>
            <select
              value={sort}
              onChange={(event) =>
                onSortChange(event.target.value as WishlistSort)
              }
              className="bg-transparent text-[11px] font-semibold text-[#554F49] outline-none"
            >
              {WISHLIST_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {totalCount === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#E4DDD3] bg-white px-5 py-14 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#FBF5EC]">
            <Heart className="size-6 text-[#B88A44]" />
          </span>
          <h2 className="mt-4 font-alexandria text-[17px] font-bold text-[#151211]">
            قائمة رغباتك فارغة
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-[#8C827A]">
            تصفحي مجموعاتنا واحفظي المنتجات التي تحبينها بالضغط على أيقونة القلب.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#151211] px-4 py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#B88A44]"
          >
            تصفح المنتجات
            <ArrowLeft className="size-3.5" />
          </Link>
        </section>
      ) : visibleProducts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#E4DDD3] bg-white px-5 py-12 text-center">
          <h2 className="font-alexandria text-[15px] font-bold text-[#151211]">
            لا توجد منتجات في هذا التصنيف
          </h2>
          <p className="mt-1 text-[11px] text-[#8C827A]">
            جرّبي تصنيفاً آخر أو اعرضي جميع منتجات القائمة.
          </p>
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className="mt-4 rounded-xl border border-[#E4DDD3] bg-white px-4 py-2 text-[11px] font-semibold text-[#8C6426] transition-colors hover:border-[#B88A44]"
          >
            عرض الكل
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={onRemove}
              onAddToCart={onAddToCart}
              isRemoving={removingProductId === product.id}
              isAdding={isAdding}
            />
          ))}
        </div>
      )}

      <GiftBanner />
    </div>
  );
}
