"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
  variant?: "home" | "catalog";
};

const brandNames: Record<string, string> = {
  "brand-1": "دار شِيورا (Dior)",
  "brand-2": "دار شِيورا (Chanel)",
  "brand-3": "توم فورد (Tom Ford)",
  "brand-4": "جورجيو أرماني (Armani)",
  "brand-5": "إيف سان لوران (YSL)",
  "brand-6": "كارولينا هيريرا",
  "brand-7": "باكو رابان",
  "brand-8": "جان بول غوتييه",
  "brand-9": "فرزاتشي",
  "brand-10": "ميزون فرانسيس كوركدجيان",
};

export function ProductCard({
  product,
  className,
  variant = "catalog",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const name = product.name ?? product.title ?? "منتج فاخر";
  const oldPrice = product.oldPrice ?? product.price;
  const hasDiscount = oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - product.price) / oldPrice) * 100)
    : product.discount ?? 0;
  const brandName = brandNames[product.brandId] ?? "دار شِيورا";
  const rating = product.rating ?? 4.9;
  const reviewsCount = product.reviewsCount ?? 120;
  const size = product.size ?? "100ml";
  const displayImage =
    product.images?.[0] && !product.images[0].includes("placehold.co")
      ? product.images[0]
      : "/images/figma/prod_serum.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      {/* Top Bar: Badges and Wishlist */}
      <div className="flex items-center justify-between z-10">
        {/* Wishlist Button */}
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

        {/* Category or Discount Badge */}
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
          {!hasDiscount && !product.bestSeller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C6426] border border-[#B88A44]/20 text-[10px] font-medium">
              إصدار حصري
            </span>
          )}
        </div>
      </div>

      {/* Product Image Stage */}
      <Link
        href={`/products/${product.id}`}
        className="relative my-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#FAF9F7] p-4 group-hover:bg-[#F7F4EE] transition-colors"
      >
        <img
          src={displayImage}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Details Content */}
      <div className="flex flex-col flex-1">
        {/* Brand, Size, and Rating */}
        <div className="flex items-center justify-between text-[11px] text-[#8C827A] mb-1.5">
          <div className="flex items-center gap-1 font-medium text-[#B88A44]">
            <Star className="size-3 fill-[#B88A44] text-[#B88A44]" />
            <span>{rating}</span>
            <span className="text-[#A8A19B]">({reviewsCount})</span>
          </div>
          <span className="truncate max-w-[140px]">
            {brandName} • {size}
          </span>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.id}`}
          className="font-alexandria text-[15px] font-bold text-[#151211] leading-snug hover:text-[#B88A44] transition-colors line-clamp-1 mb-1"
        >
          {name}
        </Link>

        {/* Short Description */}
        <p className="text-[12px] text-[#78716C] line-clamp-2 leading-relaxed mb-3 flex-1">
          {product.shortDescription ?? product.description ?? "تركيبة فاخرة مستخلصة من أرقى المكونات الطبيعية النادرة."}
        </p>

        {/* Price and Actions */}
        <div className="pt-2 border-t border-[#F0EBE5] flex items-center justify-between gap-2">
          {/* Price Container */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-[#151211]">
                {product.price}
              </span>
              <span className="text-[11px] font-medium text-[#8C6426]">
                ج.م
              </span>
            </div>
            {hasDiscount ? (
              <span className="text-[11px] text-[#A8A19B] line-through">
                {oldPrice} ج.م
              </span>
            ) : (
              <span className="text-[10px] text-[#8C827A]">سعر موحد</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Quick View Eye Button */}
            <Link
              href={`/products/${product.id}`}
              aria-label="معاينة سريعة"
              className="flex size-9 items-center justify-center rounded-xl border border-[#EDE8E3] bg-[#FAF9F7] text-[#554F49] hover:bg-[#B88A44] hover:text-white hover:border-[#B88A44] transition-all cursor-pointer"
            >
              <Eye className="size-4" />
            </Link>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                "flex items-center gap-1.5 h-9 px-3.5 rounded-xl font-medium text-[12px] transition-all cursor-pointer",
                isAdded
                  ? "bg-[#2A7A4D] text-white"
                  : "bg-[#151211] text-white hover:bg-[#B88A44]"
              )}
            >
              <ShoppingBag className="size-3.5" />
              <span>{isAdded ? "تمت الإضافة!" : "أضف للسلة"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
