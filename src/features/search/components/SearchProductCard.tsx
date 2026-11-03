"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCartDrawer } from "@/features/cart/context";
import { formatPrice } from "@/features/cart/lib/format";
import { cn } from "@/lib/utils";

type SearchProductCardProps = {
  product: Product;
  onNavigate?: () => void;
};

export function SearchProductCard({
  product,
  onNavigate,
}: SearchProductCardProps) {
  const { addLine } = useCartDrawer();
  const [isAdded, setIsAdded] = useState(false);
  const [variantIndex] = useState(() => {
    const available = product.variants?.findIndex((variant) => variant.stock > 0);

    return available !== undefined && available >= 0 ? available : 0;
  });

  const selectedVariant = product.variants?.[variantIndex] ?? null;
  const price = selectedVariant?.price ?? product.priceFrom ?? product.price;
  const compareAtPrice =
    selectedVariant && selectedVariant.oldPrice > selectedVariant.price
      ? selectedVariant.oldPrice
      : product.compareAtPriceFrom && product.compareAtPriceFrom > price
        ? product.compareAtPriceFrom
        : null;
  const canAddToCart = Boolean(
    selectedVariant && selectedVariant.stock > 0 && selectedVariant.price > 0,
  );
  const image =
    selectedVariant?.imageUrl ??
    product.images?.find((item) => !item.includes("placehold.co")) ??
    null;
  const href = `/products/${product.id}`;
  const hasRating =
    typeof product.rating === "number" &&
    product.rating > 0 &&
    product.reviewsCount > 0;
  const badge = product.bestSeller
    ? "الأكثر طلباً"
    : product.discount > 0
      ? `خصم ${product.discount}%`
      : product.newArrival
        ? "جديد"
        : product.featured
          ? "إصدار فاخر"
          : null;

  const handleAddToCart = () => {
    if (!selectedVariant || !canAddToCart) {
      return;
    }

    addLine({
      variantId: Number(selectedVariant.id),
      id: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      variantName: selectedVariant.size || selectedVariant.sku,
      note:
        [selectedVariant.size, product.shortDescription]
          .filter(Boolean)
          .join(" - ") || product.description.slice(0, 80),
      image: image ?? "/images/figma/prod_bottle.png",
      href,
      unitPrice: selectedVariant.price,
      compareAtPrice:
        selectedVariant.oldPrice > selectedVariant.price
          ? selectedVariant.oldPrice
          : undefined,
      swatch: selectedVariant.colorHex ?? undefined,
    });

    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#EDE8E3] bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:border-[#B88A44]/40 hover:shadow-lg">
      <div className="relative">
        {badge && (
          <span className="absolute right-1.5 top-1.5 z-10 rounded bg-[#151211] px-2 py-0.5 text-[9px] font-bold text-[#E8B577]">
            {badge}
          </span>
        )}
        <Link
          href={href}
          onClick={onNavigate}
          aria-label={product.name}
          className="flex aspect-[4/5] items-center justify-center rounded-lg bg-[#FAF9F7] p-3"
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="text-[11px] text-[#A8A19B]">لا توجد صورة</span>
          )}
        </Link>
      </div>

      <p className="mt-2.5 truncate text-center text-[9px] font-bold uppercase tracking-[0.14em] text-[#B88A44]">
        {product.brandName ?? "SHEORA"}
      </p>

      <Link
        href={href}
        onClick={onNavigate}
        className="mt-1 line-clamp-2 min-h-[34px] text-center font-alexandria text-[12px] font-bold leading-snug text-[#151211] transition-colors hover:text-[#B88A44]"
      >
        {product.name}
      </Link>

      <div className="mt-1.5 flex min-h-4 items-center justify-center gap-1 text-[10px]">
        {hasRating ? (
          <>
            <Star className="size-3 fill-[#B88A44] text-[#B88A44]" />
            <span className="font-semibold text-[#B88A44]">{product.rating}</span>
            <span className="text-[#A8A19B]">({product.reviewsCount})</span>
          </>
        ) : (
          <span className="text-[#B7AEA4]">جديد في شيورا</span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-center gap-1.5">
        <span className="text-[13px] font-bold text-[#151211]">
          {formatPrice(price)}
        </span>
        <span className="text-[10px] text-[#8C6426]">ج.م</span>
        {compareAtPrice && (
          <span className="text-[10px] text-[#A8A19B] line-through">
            {formatPrice(compareAtPrice)} ج.م
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className={cn(
          "mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[11px] font-bold transition-colors",
          !canAddToCart
            ? "cursor-not-allowed bg-[#EDE8E3] text-[#8C827A]"
            : isAdded
              ? "bg-[#2A7A4D] text-white"
              : "bg-[#B88A44] text-white hover:bg-[#8C6426]",
        )}
      >
        <ShoppingBag className="size-3.5" />
        <span>
          {!canAddToCart ? "غير متوفر" : isAdded ? "تمت الإضافة" : "أضف للسلة"}
        </span>
      </button>
    </article>
  );
}
