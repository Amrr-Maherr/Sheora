"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCartDrawer } from "@/features/cart/context";
import {
  categoryBadgeTone,
  categoryLabel,
} from "@/features/cart/lib/cartCatalog";
import { cn } from "@/lib/utils";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

type ProductCardProps = {
  product: Product;
  className?: string;
  variant?: "home" | "catalog";
  detailHref?: string | null;
};

type DetailLinkProps = {
  href: string | null;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
};

function DetailLink({ href, className, children, ariaLabel }: DetailLinkProps) {
  if (href === null) {
    return (
      <div className={className} aria-label={ariaLabel}>
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function ProductCard({
  product,
  className,
  variant = "catalog",
  detailHref,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [variantIndex, setVariantIndex] = useState(() => {
    const firstAvailable = product.variants?.findIndex((item) => item.stock > 0);

    return firstAvailable !== undefined && firstAvailable >= 0 ? firstAvailable : 0;
  });
  const { addLine } = useCartDrawer();

  const name = product.name ?? product.title ?? "U.U+O�O�";
  const selectedVariant =
    product.variants?.[variantIndex] ?? product.variants?.[0] ?? null;
  const hasPrice =
    product.priceFrom === undefined ? product.price > 0 : product.priceFrom !== null;
  const displayPrice =
    selectedVariant?.price ?? product.priceFrom ?? product.price;
  const compareAtPrice = selectedVariant
    ? selectedVariant.oldPrice > selectedVariant.price
      ? selectedVariant.oldPrice
      : null
    : product.compareAtPriceFrom === undefined
      ? product.oldPrice
      : product.compareAtPriceFrom;
  const hasDiscount =
    hasPrice && compareAtPrice != null && compareAtPrice > displayPrice;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - displayPrice) / compareAtPrice) * 100)
    : 0;
  const canAddToCart = Boolean(
    selectedVariant && selectedVariant.stock > 0 && selectedVariant.price > 0,
  );
  const brandName = product.brandName ?? "O'U?USU^O�O";
  const hasRating =
    typeof product.rating === "number" && product.rating > 0 && product.reviewsCount > 0;
  const size = selectedVariant?.size ?? product.size ?? "";
  const href =
    detailHref === undefined ? `/products/${product.id}` : detailHref;
  const displayImage =
    selectedVariant?.imageUrl ??
    (product.images?.[0] && !product.images[0].includes("placehold.co")
      ? product.images[0]
      : null);
  const colorVariants = (product.variants ?? [])
    .map((variant, index) => ({ variant, index }))
    .filter(({ variant }) => Boolean(variant.colorHex));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canAddToCart || !selectedVariant) {
      return;
    }

    const variantId = Number(selectedVariant.id);

    addLine({
      variantId,
      id: String(variantId),
      productId: product.id,
      name,
      variantName:
        [selectedVariant.colorName, selectedVariant.size]
          .filter(Boolean)
          .join(" - ") || selectedVariant.sku,
      note:
        [size, product.shortDescription].filter(Boolean).join(" - ") ||
        product.description.slice(0, 80),
      image: displayImage ?? "/images/figma/prod_bottle.png",
      href: typeof href === "string" ? href : "/products",
      badge: categoryLabel(product.categorySlug),
      badgeTone: categoryBadgeTone(product.categorySlug),
      unitPrice: selectedVariant.price,
      compareAtPrice:
        selectedVariant.oldPrice > selectedVariant.price
          ? selectedVariant.oldPrice
          : undefined,
      swatch: selectedVariant.colorHex ?? undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EDE8E3] bg-white transition-all duration-300 hover:shadow-xl hover:border-[#B88A44]/40 hover:-translate-y-1",
        variant === "home" ? "p-4" : "p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between z-10">
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="إضافة للمفضلة"
          className={cn(
            "flex size-8 items-center justify-center rounded-full transition-colors cursor-pointer",
            isWishlisted
              ? "bg-[#B88A44] text-white"
              : "bg-white/90 text-[#8C827A] hover:text-[#B88A44] hover:bg-white shadow-xs border border-[#EDE8E3]"
          )}
        >
          <Heart
            className={cn("size-4", isWishlisted ? "fill-white" : "")}
          />
        </button>

        <div className="flex items-center gap-1.5">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full bg-[#B94727]/10 text-[#B94727] text-[10px] font-semibold tracking-wide">
              خصم {discountPercent}%
            </span>
          )}
          {product.bestSeller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#151211] text-[#E8B577] text-[10px] font-medium tracking-wide">
              الأكثر مبيعاً
            </span>
          )}
          {!hasDiscount && !product.bestSeller && product.newArrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C6426] border border-[#B88A44]/20 text-[10px] font-medium">
              جديد
            </span>
          )}
        </div>
      </div>

      <DetailLink
        href={href}
        className="relative my-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#FAF9F7] p-4 group-hover:bg-[#F7F4EE] transition-colors"
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="text-[12px] text-[#A8A19B]">لا توجد صورة</span>
        )}
      </DetailLink>

      {colorVariants.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5">
          {colorVariants.map(({ variant, index }) => (
            <button
              key={variant.id}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setVariantIndex(index);
              }}
              disabled={variant.stock <= 0}
              aria-label={variant.colorName ?? variant.sku}
              aria-pressed={variantIndex === index}
              title={
                variant.stock <= 0
                  ? `${variant.colorName ?? variant.sku} - غير متوفر`
                  : variant.colorName ?? variant.sku
              }
              className={cn(
                "size-4 rounded-full border transition-all",
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

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] text-[#8C827A] mb-1.5">
          {hasRating ? (
            <div className="flex items-center gap-1 font-medium text-[#B88A44]">
              <Star className="size-3 fill-[#B88A44] text-[#B88A44]" />
              <span>{product.rating}</span>
              <span className="text-[#A8A19B]">({product.reviewsCount})</span>
            </div>
          ) : (
            <span className="text-[#A8A19B]">لا توجد تقييمات بعد</span>
          )}
          <span className="truncate max-w-[140px]">
            {brandName}
            {size ? ` • ${size}` : ""}
          </span>
        </div>

        <DetailLink
          href={href}
          className="font-alexandria text-[15px] font-bold text-[#151211] leading-snug hover:text-[#B88A44] transition-colors line-clamp-1 mb-1"
        >
          {name}
        </DetailLink>

        <p className="text-[12px] text-[#78716C] line-clamp-2 leading-relaxed mb-3 flex-1">
          {product.shortDescription ?? product.description ?? ""}
        </p>

        <div className="pt-2 border-t border-[#F0EBE5] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasPrice ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[17px] font-bold text-[#151211]">
                    {formatPrice(displayPrice)}
                  </span>
                  <span className="text-[11px] font-medium text-[#8C6426]">
                    ج.م
                  </span>
                </div>
                {hasDiscount ? (
                  <span className="text-[11px] text-[#A8A19B] line-through">
                    {formatPrice(compareAtPrice)} ج.م
                  </span>
                ) : (
                  <span className="text-[10px] text-[#8C827A]">سعر موحد</span>
                )}
              </>
            ) : (
              <span className="text-[12px] font-medium text-[#8C827A]">
                السعر غير متوفر
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <DetailLink
              href={href}
              ariaLabel="معاينة سريعة"
              className="flex size-9 items-center justify-center rounded-xl border border-[#EDE8E3] bg-[#FAF9F7] text-[#554F49] hover:bg-[#B88A44] hover:text-white hover:border-[#B88A44] transition-all cursor-pointer"
            >
              <Eye className="size-4" />
            </DetailLink>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={cn(
                "flex items-center gap-1.5 h-9 px-3.5 rounded-xl font-medium text-[12px] transition-all",
                !canAddToCart
                  ? "cursor-not-allowed bg-[#EDE8E3] text-[#8C827A]"
                  : isAdded
                    ? "cursor-pointer bg-[#2A7A4D] text-white"
                    : "cursor-pointer bg-[#151211] text-white hover:bg-[#B88A44]"
              )}
            >
              <ShoppingBag className="size-3.5" />
              <span>
                {!canAddToCart
                  ? "السعر غير متوفر"
                  : isAdded
                    ? "تمت الإضافة!"
                    : "أضف للسلة"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
