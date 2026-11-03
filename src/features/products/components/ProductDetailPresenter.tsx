"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  Gift,
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
} from "lucide-react";
import type { Product } from "@/types";
import { useCartDrawer } from "@/features/cart/context";
import { ProductGallery } from "./ProductGallery";
import {
  findMatchingVariant,
  getDefaultVariantSelection,
  getVariantDimensions,
  getVariantLabel,
  getVariantOptionLabel,
  isVariantOptionAvailable,
  selectVariantOption,
  type VariantSelection,
} from "../lib/variantSelection";

type ProductDetailPresenterProps = {
  product?: Product;
  relatedProducts: Product[];
  frequentlyBoughtTogether: Product[];
  isLoading: boolean;
  isError: boolean;
};

const EMPTY_VARIANTS: Product["variants"] = [];

export function ProductDetailPresenter({
  product,
  relatedProducts,
  frequentlyBoughtTogether,
  isLoading,
  isError,
}: ProductDetailPresenterProps) {
  const [quantity, setQuantity] = useState(1);
  const { addLine, maxItemQuantity } = useCartDrawer();
  const [addedToCart, setAddedToCart] = useState(false);
  const variants = product?.variants ?? EMPTY_VARIANTS;
  const dimensions = useMemo(() => getVariantDimensions(variants), [variants]);
  const [selectionState, setSelectionState] = useState<{
    productId: string | undefined;
    values: VariantSelection;
  }>(() => ({
    productId: product?.id,
    values: getDefaultVariantSelection(variants, dimensions),
  }));
  const selection =
    selectionState.productId === product?.id
      ? selectionState.values
      : getDefaultVariantSelection(variants, dimensions);
  const selectedVariant = useMemo(
    () =>
      findMatchingVariant(variants, dimensions, selection) ??
      variants[0] ??
      null,
    [dimensions, selection, variants],
  );

  // Accordion open/close state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    usage: false,
    delivery: false,
    packaging: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 aspect-square rounded-3xl bg-white animate-pulse border border-[#EDE8E3]" />
          <div className="lg:col-span-6 space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-20 text-center space-y-4">
        <div className="size-16 rounded-full bg-[#FAF7F2] text-[#B88A44] flex items-center justify-center mx-auto">
          <HelpCircle className="size-8" />
        </div>
        <h2 className="font-alexandria text-2xl font-bold text-[#151211]">
          عذراً، المنتج غير متوفر
        </h2>
        <p className="text-[14px] text-[#78716C]">
          لم نتمكن من العثور على المنتج المطلوب أو قد تم نقله.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 rounded-full bg-[#151211] text-white font-bold text-[13px] hover:bg-[#B88A44] transition-colors"
        >
          العودة إلى كافة المنتجات
        </Link>
      </div>
    );
  }

  const stockLimit = selectedVariant
    ? selectedVariant.maxQuantity > 0
      ? selectedVariant.maxQuantity
      : Math.max(selectedVariant.stock, 0)
    : maxItemQuantity;
  const maxSelectableQuantity = Math.max(
    1,
    Math.min(maxItemQuantity, stockLimit > 0 ? stockLimit : maxItemQuantity),
  );
  const effectiveQuantity = Math.min(quantity, maxSelectableQuantity);
  const priceFrom = selectedVariant
    ? selectedVariant.price
    : product.priceFrom ?? product.price;
  const hasPrice = selectedVariant
    ? selectedVariant.price > 0
    : product.priceFrom !== undefined && product.priceFrom !== null
      ? product.priceFrom > 0
      : product.price > 0;
  const compareAtPrice =
    selectedVariant && selectedVariant.oldPrice > selectedVariant.price
      ? selectedVariant.oldPrice
      : selectedVariant
        ? null
        : product.compareAtPriceFrom ?? product.compareAtPrice ?? null;
  const hasDiscount =
    hasPrice &&
    compareAtPrice !== null &&
    compareAtPrice > priceFrom;
  const discountAmount = hasDiscount ? compareAtPrice - priceFrom : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / compareAtPrice) * 100)
    : 0;
  const selectedSku = selectedVariant?.sku ?? product.sku;
  const suggestedProducts = [...frequentlyBoughtTogether, ...relatedProducts]
    .filter(
      (item, index, items) =>
        item.id !== product.id &&
        items.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 4);
  const selectedImage = selectedVariant?.imageUrl ?? null;
  const galleryImages = selectedImage
    ? [selectedImage, ...(product.images ?? []).filter((image) => image !== selectedImage)]
    : product.images ?? [];
  const selectedVariantLabel = selectedVariant
    ? getVariantLabel(selectedVariant, dimensions)
    : null;
  const canAddToCart = Boolean(
    selectedVariant && selectedVariant.stock > 0 && hasPrice,
  );

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedVariant) {
      return;
    }

    const variantId = Number(selectedVariant.id);

    addLine({
      variantId,
      id: String(variantId),
      productId: product.id,
      name: product.name,
      variantName: selectedVariantLabel ?? selectedVariant.sku,
      note: [selectedVariantLabel, product.shortDescription]
        .filter(Boolean)
        .join(" - ") || product.description.slice(0, 80),
      image: selectedVariant.imageUrl || product.images?.[0] || '/images/figma/prod_bottle.png',
      href: `/products/${product.id}`,
      unitPrice: selectedVariant.price,
      compareAtPrice: selectedVariant.oldPrice > selectedVariant.price ? selectedVariant.oldPrice : undefined,
      quantity: effectiveQuantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-clip bg-[#FAF9F7] py-6 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-[1280px] space-y-8 px-4 sm:px-6">
        {/* 1. Breadcrumbs */}
        <nav aria-label="مسار التنقل" className="flex min-w-0 flex-wrap items-center gap-2 text-[12px] text-[#78716C]">
          <Link href="/" className="hover:text-[#B88A44] transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#B88A44] transition-colors">
            المنتجات
          </Link>
          <span>/</span>
          <span className="min-w-0 truncate font-semibold text-[#151211]">{product.name}</span>
        </nav>

        {/* 2. Interactive Category Mode Switcher / Banner */}
        <section className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#B88A44]/25 bg-[#FAF7F2] p-3.5 text-[12px] text-[#8C6426]">
          <div className="flex min-w-0 items-center gap-2 font-medium">
            <Sparkles className="size-4 shrink-0 text-[#B88A44]" />
            <span className="leading-snug">توصيل سريع لجميع المحافظات</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[#78716C] text-[11px]">
            <span>شحن سريع خلال 24-48 ساعة</span>
            <span>•</span>
            <span>منتجات أصلية</span>
            <span>•</span>
            <span>تغليف كوتور مذهب مجاناً</span>
          </div>
        </section>

        {/* 3. Main Single Product Section (1216x1086) */}
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Left Column in RTL: Hero Gallery (Span 6) */}
          <div className="min-w-0 w-full lg:col-span-6 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              key={selectedImage ?? "product-gallery"}
              images={galleryImages}
              productName={product.name}
              inStock={hasPrice}
            />
          </div>

          {/* Right Column in RTL: Specifications & Variant Engine (Span 6) */}
          <div className="min-w-0 space-y-6 text-right lg:col-span-6">
            {/* Brand, Rating, and Title */}
            <div className="space-y-2 border-b border-[#EDE8E3] pb-4">
              <span className="font-playfair block text-[11px] font-bold tracking-[0.2em] text-[#B88A44] uppercase sm:text-[12px]">
                {product.brandName ?? "SHEORA"}
              </span>

              <h1 className="font-alexandria text-2xl font-extrabold leading-snug text-[#151211] sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[12px]">
                {product.rating !== null ? (
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5 font-bold text-[#151211]">
                    <Star className="size-3.5 fill-[#B88A44] text-[#B88A44]" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="font-normal text-[#8C827A]">
                      ({product.reviewsCount} تقييم)
                    </span>
                  </div>
                ) : (
                  <span className="text-[12px] text-[#8C827A]">
                    لا توجد تقييمات بعد
                  </span>
                )}

                {selectedSku ? (
                  <span className="shrink-0 font-mono text-[11px] text-[#8C827A]">
                    رمز المنتج: {selectedSku}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2 rounded-2xl border border-[#EDE8E3] bg-[#FAF7F2] p-4">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span
                  aria-live="polite"
                  className="font-alexandria text-2xl font-extrabold text-[#151211] sm:text-3xl"
                >
                  {hasPrice ? `${priceFrom} ج.م` : "السعر غير متاح"}
                </span>
                {hasDiscount ? (
                  <>
                    <span className="text-base text-[#A8A19B] line-through">
                      {compareAtPrice} ج.م
                    </span>
                    <span className="rounded-full bg-[#B94727]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#B94727]">
                      وفر {discountAmount} ج.م (خصم {discountPercent}%)
                    </span>
                  </>
                ) : null}
              </div>

              {selectedVariant ? (
                <p className="text-[11px] font-medium text-[#8C827A]">
                  السعر المحدد: {selectedVariantLabel}
                </p>
              ) : null}

              <p className="flex items-start gap-1.5 text-[11px] text-[#8C6426] sm:items-center">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
                <span>قد تختلف تكلفة الشحن عند إتمام الطلب</span>
              </p>
            </div>

            {/* Description narrative */}
            <p className="text-[13px] leading-relaxed text-[#6E6761] sm:text-[14px]">
              {product.description ||
                product.shortDescription ||
                "لا يوجد وصف متاح لهذا المنتج."}
            </p>

            {dimensions.length > 0 && (
              <div className="space-y-3 pt-2">
                {dimensions.map((dimension) => {
                  const selectedOption = selection[dimension.key];
                  const selectedLabel = getVariantOptionLabel(
                    dimension,
                    selectedOption,
                  );

                  return (
                    <div key={dimension.key} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-[#151211]">
                          {dimension.label}
                        </span>
                        {selectedLabel ? (
                          <span className="text-[11px] text-[#8C827A]">
                            {selectedLabel}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {dimension.options.map((option) => {
                          const isSelected = selectedOption === option.key;
                          const isAvailable = isVariantOptionAvailable(
                            variants,
                            dimensions,
                            selection,
                            dimension.key,
                            option.key,
                          );
                          const swatch = option.swatchHex;

                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() =>
                                setSelectionState({
                                  productId: product.id,
                                  values: selectVariantOption(
                                    variants,
                                    dimensions,
                                    selection,
                                    dimension.key,
                                    option.key,
                                  ),
                                })
                              }
                              disabled={!isAvailable && !isSelected}
                              aria-pressed={isSelected}
                              aria-label={option.label}
                              title={
                                isAvailable
                                  ? option.label
                                  : `${option.label} - غير متوفر`
                              }
                              className={
                                swatch
                                  ? `size-8 rounded-full border-2 transition-all ${
                                      isSelected
                                        ? "border-[#151211] ring-2 ring-[#B88A44]/30 ring-offset-2"
                                        : "border-[#E5DED6] shadow-sm hover:border-[#B88A44]"
                                    } disabled:cursor-not-allowed disabled:opacity-40`
                                  : `rounded-xl px-4 py-2.5 text-[12px] font-medium transition-all ${
                                      isSelected
                                        ? "bg-[#151211] text-white shadow-xs"
                                        : "border border-[#EDE8E3] bg-white text-[#554F49] hover:border-[#B88A44]"
                                    } disabled:cursor-not-allowed disabled:opacity-50`
                              }
                              style={
                                swatch
                                  ? { backgroundColor: swatch }
                                  : undefined
                              }
                            >
                              {swatch ? (
                                <span className="sr-only">{option.label}</span>
                              ) : (
                                option.label
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex min-w-0 flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              {/* Quantity Selector */}
              <div className="flex h-12 w-full shrink-0 items-center justify-between rounded-xl border border-[#EDE8E3] bg-white px-3 sm:w-auto sm:justify-start">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.max(1, effectiveQuantity - 1),
                    )
                  }
                  className="cursor-pointer p-1 hover:text-[#B88A44]"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-[14px] font-bold">
                  {effectiveQuantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(maxSelectableQuantity, quantity + 1))
                  }
                  disabled={effectiveQuantity >= maxSelectableQuantity}
                  className="cursor-pointer p-1 hover:text-[#B88A44] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#B88A44] text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#A57835] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-[#A8A19B] disabled:shadow-none sm:text-[14px]"
              >
                <ShoppingBag className="size-4 shrink-0" />
                <span className="truncate">
                  {!canAddToCart
                    ? "غير متوفر للشراء حالياً"
                    : addedToCart
                      ? "تمت الإضافة للسلة!"
                      : `أضف إلى السلة | ${priceFrom * effectiveQuantity} ج.م`}
                </span>
              </button>
            </div>

            {/* Value / Guarantee Perks */}
            <div className="grid grid-cols-1 gap-2 border-y border-[#EDE8E3] py-3 text-center text-[11px] text-[#6E6761] min-[480px]:grid-cols-3">
              <div className="flex items-center justify-center gap-1.5">
                <Truck className="size-3.5 shrink-0 text-[#B88A44]" />
                <span>شحن سريع</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Gift className="size-3.5 shrink-0 text-[#B88A44]" />
                <span>تغليف هدايا متاح</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Shield className="size-3.5 shrink-0 text-[#B88A44]" />
                <span>دفع آمن</span>
              </div>
            </div>

            {/* Product Accordions */}
            <div className="space-y-2 pt-2">
              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#B88A44]" />
                    <span>تفاصيل المنتج</span>
                  </span>
                  {openAccordions.details ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.details && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3 whitespace-pre-line">
                    {product.details || product.description || "لا توجد تفاصيل إضافية متاحة لهذا المنتج."}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("usage")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#B88A44]" />
                    <span>طريقة الاستخدام</span>
                  </span>
                  {openAccordions.usage ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.usage && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3 whitespace-pre-line">
                    {product.usageInstructions || "استخدمي المنتج حسب التعليمات المدونة على العبوة أو النشرة المرفقة."}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("delivery")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="size-4 text-[#B88A44]" />
                    <span>الشحن والاسترجاع</span>
                  </span>
                  {openAccordions.delivery ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.delivery && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3 whitespace-pre-line">
                    {product.deliveryReturns || "يتم تسليم الطلبات داخل القاهرة والجيزة خلال 24-48 ساعة، وباقي المحافظات خلال 3 أيام عمل. استرجاع واستبدال مجاني خلال 14 يوماً من الاستلام."}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("packaging")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Package className="size-4 text-[#B88A44]" />
                    <span>التغليف</span>
                  </span>
                  {openAccordions.packaging ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.packaging && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3 whitespace-pre-line">
                    {product.packagingDetails || "يصل منتجك في تغليف فاخر مناسب للإهداء، مع إمكانية إضافة بطاقة إهداء."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {suggestedProducts.length > 0 ? (
          <section className="py-14 border-t border-[#EDE8E3]">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="font-playfair text-[12px] font-bold tracking-[0.2em] text-[#B88A44] uppercase block">
                YOU MAY ALSO LIKE
              </span>
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                منتجات قد تنال إعجابك
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {suggestedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${encodeURIComponent(item.slug)}`}
                  className="group space-y-3 rounded-2xl border border-[#EDE8E3] bg-white p-4 text-center transition-colors hover:border-[#B88A44]/40"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-[#FAF9F7] p-3">
                    <img
                      src={item.images?.[0] ?? "/images/figma/prod_perfume.png"}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-alexandria line-clamp-1 text-[13px] font-bold text-[#151211]">
                    {item.name}
                  </h3>
                  <span className="block text-[13px] font-bold text-[#B88A44]">
                    {item.price > 0 ? `${item.price} ج.م` : "السعر غير متاح"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
