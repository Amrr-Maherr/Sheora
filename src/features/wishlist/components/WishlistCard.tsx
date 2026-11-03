"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag, Star, X } from "lucide-react";
import { formatPrice } from "@/features/cart/lib/format";
import { categoryLabel } from "@/features/cart/lib/cartCatalog";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { getProductImage } from "../lib/wishlistProduct";

type WishlistCardProps = {
  product: Product;
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  isRemoving?: boolean;
  isAdding?: boolean;
};

export function WishlistCard({
  product,
  onRemove,
  onAddToCart,
  isRemoving = false,
  isAdding = false,
}: WishlistCardProps) {
  const [variantIndex, setVariantIndex] = useState(() => {
    const firstAvailable = product.variants?.findIndex(
      (variant) => variant.stock > 0,
    );

    return firstAvailable !== undefined && firstAvailable >= 0
      ? firstAvailable
      : 0;
  });

  const name = product.name ?? product.title ?? "منتج SHEORA";
  const selectedVariant =
    product.variants?.[variantIndex] ?? product.variants?.[0] ?? null;
  const price = selectedVariant?.price ?? product.priceFrom ?? product.price;
  const oldPrice = selectedVariant
    ? selectedVariant.oldPrice
    : product.compareAtPriceFrom ?? product.oldPrice;
  const hasDiscount = Boolean(oldPrice && oldPrice > price);
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;
  const totalStock = product.variants?.length
    ? product.variants.reduce((total, variant) => total + variant.stock, 0)
    : product.stock;
  const inStock = totalStock > 0;
  const canAdd =
    Boolean(selectedVariant) && selectedVariant!.stock > 0 && !isAdding;
  const image = getProductImage(product, selectedVariant);
  const href = `/products/${product.slug || product.id}`;
  const category = categoryLabel(product.categorySlug) ?? "عطور";
  const rating = product.rating;
  const reviewsCount = product.reviewsCount ?? product.reviewCount ?? 0;
  const notes = product.notes?.top?.length
    ? `مقدمة العطر: ${product.notes.top.slice(0, 2).join("، ")}`
    : product.shortDescription || product.description;
  const colorVariants = (product.variants ?? [])
    .map((variant, index) => ({ variant, index }))
    .filter(({ variant }) => Boolean(variant.colorHex));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EDE8E3] bg-white p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D8C29A] hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          disabled={isRemoving}
          aria-label={`إزالة ${name} من قائمة الرغبات`}
          className="flex size-7 items-center justify-center rounded-full border border-[#EDE8E3] bg-white text-[#8C827A] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="size-3.5" />
        </button>

        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {hasDiscount && (
            <span className="rounded-full bg-[#B94727]/10 px-2 py-0.5 text-[9px] font-bold text-[#B94727]">
              خصم {discountPercent}%
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9px] font-semibold",
              inStock
                ? "bg-[#EEF6F0] text-[#047857]"
                : "bg-[#F5F1EB] text-[#8C827A]",
            )}
          >
            {inStock ? "متوفر" : "نفذت الكمية"}
          </span>
        </div>
      </div>

      <Link
        href={href}
        className="relative my-2.5 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#FAF9F7] p-3 transition-colors group-hover:bg-[#F7F4EE]"
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <span className="w-fit rounded-full bg-[#FBF5EC] px-2 py-0.5 text-[9px] font-semibold text-[#8C6426]">
        {category}
      </span>

      <Link
        href={href}
        className="mt-1.5 line-clamp-2 font-alexandria text-[12px] font-bold leading-snug text-[#151211] transition-colors hover:text-[#B88A44]"
      >
        {name}
      </Link>

      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
        {rating ? (
          <>
            <Star className="size-3 fill-[#B88A44] text-[#B88A44]" />
            <span className="font-semibold text-[#8C6426]">{rating}</span>
            {reviewsCount > 0 && (
              <span className="text-[#A8A19B]">({reviewsCount})</span>
            )}
          </>
        ) : (
          <span className="text-[#A8A19B]">جديد في SHEORA</span>
        )}
      </div>

      <p className="mt-1.5 line-clamp-2 flex-1 text-[10px] leading-relaxed text-[#8C827A]">
        {notes}
      </p>

      {colorVariants.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {colorVariants.slice(0, 5).map(({ variant, index }) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setVariantIndex(index)}
              disabled={variant.stock <= 0}
              aria-label={variant.colorName ?? variant.sku}
              aria-pressed={variantIndex === index}
              title={
                variant.stock <= 0
                  ? `${variant.colorName ?? variant.sku} - نفذت الكمية`
                  : variant.colorName ?? variant.sku
              }
              className={cn(
                "size-3.5 rounded-full border transition-all",
                variantIndex === index
                  ? "border-[#151211] ring-2 ring-[#B88A44]/25 ring-offset-1"
                  : "border-white shadow-sm hover:border-[#B88A44]",
                variant.stock <= 0 && "cursor-not-allowed opacity-40",
              )}
              style={{ backgroundColor: variant.colorHex ?? undefined }}
            />
          ))}
        </div>
      )}

      <div className="mt-2.5 border-t border-[#F0EBE5] pt-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-alexandria text-[15px] font-bold text-[#151211]">
            {formatPrice(price)}
          </span>
          <span className="text-[10px] font-medium text-[#8C6426]">ج.م</span>
          {hasDiscount && (
            <span className="text-[10px] text-[#A8A19B] line-through">
              {formatPrice(oldPrice)} ج.م
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (selectedVariant) {
                onAddToCart(product, selectedVariant);
              }
            }}
            disabled={!canAdd}
            className={cn(
              "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[10px] font-semibold transition-colors",
              canAdd
                ? "bg-[#151211] text-white hover:bg-[#B88A44]"
                : "cursor-not-allowed bg-[#EDE8E3] text-[#8C827A]",
            )}
          >
            <ShoppingBag className="size-3" />
            {inStock ? "أضف للسلة" : "نفذت الكمية"}
          </button>
          <Link
            href={href}
            aria-label={`عرض تفاصيل ${name}`}
            className="flex size-8 items-center justify-center rounded-lg border border-[#EDE8E3] bg-[#FAF9F7] text-[#554F49] transition-colors hover:border-[#B88A44] hover:bg-[#B88A44] hover:text-white"
          >
            <Eye className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
