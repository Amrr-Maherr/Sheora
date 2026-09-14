"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  Gift,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
} from "lucide-react";
import type { Product } from "@/types";
import { ProductGallery } from "./ProductGallery";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";

type ProductDetailPresenterProps = {
  product?: Product;
  relatedProducts: Product[];
  frequentlyBoughtTogether: Product[];
  isLoading: boolean;
  isError: boolean;
};

const shadeOptions = [
  { name: "أحمر مخملي كلاسيك (Rouge Classic)", color: "#9E1B32", code: "#9E1B32" },
  { name: "وردي باريسي (Velvet Rose)", color: "#B33951", code: "#B33951" },
  { name: "نبيذي غامق (Berry Noir)", color: "#5C1322", code: "#5C1322" },
  { name: "نيود دافئ (Nude Cashmere)", color: "#BA7766", code: "#BA7766" },
];

const finishOptions = [
  { id: "matte", label: "مات مخملي (Matte)" },
  { id: "satin", label: "ساتان مشرق (Satin)" },
  { id: "dewy", label: "لمعان ندي (Dewy)" },
];

export function ProductDetailPresenter({
  product,
  relatedProducts,
  frequentlyBoughtTogether,
  isLoading,
  isError,
}: ProductDetailPresenterProps) {
  const [selectedShade, setSelectedShade] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState("matte");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Accordion open/close state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    ingredients: true,
    routine: false,
    shipping: false,
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

  const oldPrice = product.oldPrice ?? Math.round(product.price * 1.25);
  const discountAmount = oldPrice - product.price;
  const discountPercent = Math.round((discountAmount / oldPrice) * 100);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Bundle pricing for Frequently Bought Together
  const bundleProduct1 = product;
  const bundleProduct2 = frequentlyBoughtTogether[0] ?? relatedProducts[0] ?? {
    id: "bundle-2",
    name: "عطر لور دامبر (50 مل)",
    price: 520,
    images: ["/images/figma/prod_perfume.png"],
  };
  const bundleProduct3 = frequentlyBoughtTogether[1] ?? relatedProducts[1] ?? {
    id: "bundle-3",
    name: "إكسير الشباب المركز (30 مل)",
    price: 480,
    images: ["/images/figma/prod_serum.png"],
  };

  const bundleRawTotal = bundleProduct1.price + bundleProduct2.price + bundleProduct3.price;
  const bundleDiscountedTotal = Math.round(bundleRawTotal * 0.85);
  const bundleSavings = bundleRawTotal - bundleDiscountedTotal;

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
            مستحضرات التجميل والشفاه
          </Link>
          <span>/</span>
          <span className="min-w-0 truncate font-semibold text-[#151211]">{product.name}</span>
        </nav>

        {/* 2. Interactive Category Mode Switcher / Banner */}
        <section className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#B88A44]/25 bg-[#FAF7F2] p-3.5 text-[12px] text-[#8C6426]">
          <div className="flex min-w-0 items-center gap-2 font-medium">
            <Sparkles className="size-4 shrink-0 text-[#B88A44]" />
            <span className="leading-snug">توصيل مجاني فاخر مع عينات استكشافية حصرية مع كل أوردر فوق 300 ج.م</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[#78716C] text-[11px]">
            <span>شحن سريع خلال 24-48 ساعة</span>
            <span>•</span>
            <span>منتجات أصلية 100% مضمونة</span>
            <span>•</span>
            <span>تغليف كوتور مذهب مجاناً</span>
          </div>
        </section>

        {/* 3. Main Single Product Section (1216x1086) */}
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Left Column in RTL: Hero Gallery (Span 6) */}
          <div className="min-w-0 w-full lg:col-span-6 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              images={product.images ?? []}
              productName={product.name}
            />
          </div>

          {/* Right Column in RTL: Specifications & Variant Engine (Span 6) */}
          <div className="min-w-0 space-y-6 text-right lg:col-span-6">
            {/* Brand, Rating, and Title */}
            <div className="space-y-2 border-b border-[#EDE8E3] pb-4">
              <span className="font-playfair block text-[11px] font-bold tracking-[0.2em] text-[#B88A44] uppercase sm:text-[12px]">
                MAISON SHEORA • PARIS HAUTE BEAUTÉ
              </span>

              <h1 className="font-alexandria text-2xl font-extrabold leading-snug text-[#151211] sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[12px]">
                {/* Rating */}
                <div className="flex min-w-0 flex-wrap items-center gap-1.5 font-bold text-[#151211]">
                  <div className="flex items-center gap-0.5 text-[#B88A44]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-3.5 fill-[#B88A44]" />
                    ))}
                  </div>
                  <span>5.0</span>
                  <span className="font-normal text-[#8C827A]">
                    (420 تقييم موثق ومعتمد)
                  </span>
                </div>

                {/* SKU */}
                <span className="shrink-0 font-mono text-[11px] text-[#8C827A]">
                  رمز المنتج: {product.sku ?? "SH-RV-901"}
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2 rounded-2xl border border-[#EDE8E3] bg-[#FAF7F2] p-4">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="font-alexandria text-2xl font-extrabold text-[#151211] sm:text-3xl">
                  {product.price} ج.م
                </span>
                <span className="text-base text-[#A8A19B] line-through">
                  {oldPrice} ج.م
                </span>
                <span className="rounded-full bg-[#B94727]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#B94727]">
                  وفر {discountAmount} ج.م (خصم {discountPercent}%)
                </span>
              </div>

              <p className="flex items-start gap-1.5 text-[11px] text-[#8C6426] sm:items-center">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
                <span>السعر شامل ضريبة القيمة المضافة، التغليف المخملي الفاخر وعينة هدية</span>
              </p>
            </div>

            {/* Description narrative */}
            <p className="text-[13px] leading-relaxed text-[#6E6761] sm:text-[14px]">
              {product.description ??
                "تحفة كوتور باريسية مستوحاة من الأناقة الراقية، تركيبة غنية بزيت الكاميليا النادر ومستخلصات الورد الجوري لترطيب عميق يدوم طوال اليوم مع لمسة لونية مخملية مشبعة تأسر الأنظار من أول تمريرة."}
            </p>

            {/* Dynamic Variant Controls */}
            <div className="space-y-4 pt-2">
              {/* Shade Selector */}
              <div className="space-y-2">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-[13px]">
                  <span className="shrink-0 font-bold text-[#151211]">
                    اختاري الدرجة الملكية:
                  </span>
                  <span className="min-w-0 truncate text-[12px] font-medium text-[#B88A44]">
                    {shadeOptions[selectedShade].name}
                  </span>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 py-1">
                  {shadeOptions.map((shade, idx) => (
                    <button
                      key={shade.name}
                      type="button"
                      onClick={() => setSelectedShade(idx)}
                      className={`relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${
                        selectedShade === idx
                          ? "scale-110 ring-2 ring-[#B88A44] ring-offset-2"
                          : "opacity-85 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: shade.color }}
                      aria-label={shade.name}
                      aria-pressed={selectedShade === idx}
                    >
                      {selectedShade === idx && (
                        <div className="size-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  ))}
                  <span className="shrink-0 font-mono text-[11px] text-[#8C827A]">
                    كود: {shadeOptions[selectedShade].code}
                  </span>
                </div>
              </div>

              {/* Finish Selector */}
              <div className="space-y-2">
                <span className="block text-[13px] font-bold text-[#151211]">
                  نوع اللمسة النهائية (Finish):
                </span>
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
                  {finishOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFinish(f.id)}
                      className={`cursor-pointer rounded-xl px-3 py-2.5 text-[11px] font-medium leading-snug transition-all sm:text-[12px] ${
                        selectedFinish === f.id
                          ? "bg-[#151211] text-white shadow-xs"
                          : "border border-[#EDE8E3] bg-white text-[#554F49] hover:border-[#B88A44]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex min-w-0 flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              {/* Quantity Selector */}
              <div className="flex h-12 w-full shrink-0 items-center justify-between rounded-xl border border-[#EDE8E3] bg-white px-3 sm:w-auto sm:justify-start">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="cursor-pointer p-1 hover:text-[#B88A44]"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-[14px] font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="cursor-pointer p-1 hover:text-[#B88A44]"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#B88A44] text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#A57835] hover:shadow-lg sm:text-[14px]"
              >
                <ShoppingBag className="size-4 shrink-0" />
                <span className="truncate">
                  {addedToCart
                    ? "تمت الإضافة للسلة!"
                    : `أضف إلى السلة | ${product.price * quantity} ج.م`}
                </span>
              </button>
            </div>

            {/* Value / Guarantee Perks */}
            <div className="grid grid-cols-1 gap-2 border-y border-[#EDE8E3] py-3 text-center text-[11px] text-[#6E6761] min-[480px]:grid-cols-3">
              <div className="flex items-center justify-center gap-1.5">
                <Truck className="size-3.5 shrink-0 text-[#B88A44]" />
                <span>شحن سريع لحد باب بيتك</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Gift className="size-3.5 shrink-0 text-[#B88A44]" />
                <span>تغليف هدايا راقي ومجاني</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Shield className="size-3.5 shrink-0 text-[#B88A44]" />
                <span>عينات مجانية مع كل أوردر</span>
              </div>
            </div>

            {/* Product Accordions */}
            <div className="space-y-2 pt-2">
              {/* Accordion 1 */}
              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("ingredients")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#B88A44]" />
                    <span>المكونات والمقدمة العطرية / تركيبة العناية</span>
                  </span>
                  {openAccordions.ingredients ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.ingredients && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3 space-y-1">
                    <p>• المكونات الأساسية: مستخلص زيت الكاميليا اليابانية، زبدة الشيا العضوية، صبغات معدنية نقية، فيتامين E الطبيعي لمكافحة الأكسدة.</p>
                    <p>• الفعالية: يمنح الشفاه تغطية كاملة مريحة بدون أي جفاف أو تشقق حتى 12 ساعة متواصلة مع حماية الحاجز الجلدي الرقيق.</p>
                  </div>
                )}
              </div>

              {/* Accordion 2 */}
              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("routine")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#B88A44]" />
                    <span>طريقة الاستخدام وروتين العناية المتكامل</span>
                  </span>
                  {openAccordions.routine ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.routine && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3">
                    قومي بتمرير قلم الروج برفق بدءاً من منتصف الشفاه العليا باتجاه الحواف الخارجية. كرري الخطوة على الشفاه السفلى للحصول على لون عميق ومتجانس يدوم لساعات طويلة.
                  </div>
                )}
              </div>

              {/* Accordion 3 */}
              <div className="rounded-xl border border-[#EDE8E3] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-[#151211] text-right cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="size-4 text-[#B88A44]" />
                    <span>الشحن، الاسترجاع والتغليف الفاخر</span>
                  </span>
                  {openAccordions.shipping ? (
                    <ChevronUp className="size-4 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="size-4 text-[#8C827A]" />
                  )}
                </button>
                {openAccordions.shipping && (
                  <div className="px-4 pb-4 text-[12px] text-[#78716C] leading-relaxed border-t border-[#F0EBE5] pt-3">
                    يتم تسليم الطلبات داخل القاهرة والجيزة خلال 24-48 ساعة، وباقي المحافظات خلال 3 أيام عمل. استرجاع واستبدال مجاني خلال 14 يوماً من الاستلام.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Section - Interactive Before & After Clinical Comparison Slider */}
        <section className="py-14 border-t border-[#EDE8E3]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="font-playfair text-[12px] font-bold tracking-[0.2em] text-[#B88A44] uppercase block">
              CLINICAL TRANSFORMATION
            </span>
            <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
              النتائج السريرية المثبتة: تحوّل فوري في النضارة والملمس
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#78716C]">
              شاهدي الفرق المباشر بالنتائج السريرية بعد تطبيق طقوس دار شيورا. اسحبي المؤشر الذهبي لاكتشاف النضارة الحريرية والنعومة الفائقة
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[#EDE8E3] bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-12 lg:p-8">
            {/* Draggable Slider on Left in RTL (Span 7) */}
            <div className="min-w-0 lg:col-span-7">
              <BeforeAfterSlider
                hint="حرك المؤشر يميناً ويساراً لمقارنة تأثير الترطيب وإشراقة البشرة الحية"
                frameClassName="rounded-3xl shadow-lg"
              />
            </div>

            {/* Clinical stats card on Right in RTL (Span 5) */}
            <div className="min-w-0 space-y-6 lg:col-span-5">
              <div className="space-y-4 rounded-2xl border border-[#EDE8E3] bg-[#FAF7F2] p-5">
                <h3 className="font-alexandria text-[15px] font-bold text-[#151211]">
                  نتائج الدراسات المخبرية المعتمدة (14 يوماً)
                </h3>

                {/* Stat 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between gap-3 text-[12px]">
                    <span className="min-w-0 text-[#4A4541]">ترطيب عميق فوري وحماية الحاجز الخلوي</span>
                    <strong className="shrink-0 font-bold text-[#B88A44]">+94%</strong>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDE8E3]">
                    <div className="h-full rounded-full bg-[#B88A44]" style={{ width: "94%" }} />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between gap-3 text-[12px]">
                    <span className="min-w-0 text-[#4A4541]">إشراقة وتوحيد لون البشرة ونضارة الذهب</span>
                    <strong className="shrink-0 font-bold text-[#B88A44]">+88%</strong>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDE8E3]">
                    <div className="h-full rounded-full bg-[#B88A44]" style={{ width: "88%" }} />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#4A4541]">نعومة ملمس مخملي وتقليل مظهر الخطوط</span>
                    <strong className="text-[#B88A44] font-bold">96%</strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EDE8E3] overflow-hidden">
                    <div className="h-full bg-[#B88A44] rounded-full" style={{ width: "96%" }} />
                  </div>
                </div>

                <p className="text-[11px] text-[#8C827A] pt-1 leading-snug">
                  * أُجريت الاختبارات على 140 سيدة بإشراف أطباء الجلدية في مختبرات باريس للأبحاث التجميلية المتطورة.
                </p>
              </div>

              <blockquote className="p-4 rounded-xl bg-white border border-[#EDE8E3] text-[12px] text-[#6E6761] italic leading-relaxed">
                &ldquo;إن تركيز مستخلصات الورد والكاميليا مع حمض الهيالورونيك يمنح البشرة والشفاه امتلاءً حريرياً مبهراً وتجدداً ملحوظاً من الاستخدام الأول.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        {/* 5. Section - Recommended Ritual / Frequently Bought Together */}
        <section className="py-14 border-t border-[#EDE8E3]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="font-playfair text-[12px] font-bold tracking-[0.2em] text-[#B88A44] uppercase block">
              PERFECT MATCHING RITUAL
            </span>
            <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
              طقوس متكاملة تنال إعجابك
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#78716C]">
              اختاري المجموعة المتكاملة مع بعض واستفيدي بخصم إضافي فوري 15% مع بوكس هدايا فاخر
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E3] shadow-sm space-y-6">
            {/* 3 Bundled Cards */}
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row lg:gap-8">
              {/* Product 1 */}
              <div className="w-full min-w-0 max-w-[260px] flex-1 space-y-2 rounded-2xl border border-[#EDE8E3] bg-[#FAF9F7] p-4 text-center">
                <span className="mb-1 inline-block rounded-full bg-[#151211] px-2 py-0.5 text-[10px] font-semibold text-white">
                  المنتج الحالي
                </span>
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                  <img
                    src={bundleProduct1.images?.[0] ?? "/images/figma/prod_lipstick.png"}
                    alt={bundleProduct1.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h4 className="font-alexandria line-clamp-1 text-[13px] font-bold text-[#151211]">
                  {bundleProduct1.name}
                </h4>
                <span className="block text-[13px] font-bold text-[#B88A44]">
                  {bundleProduct1.price} ج.م
                </span>
              </div>

              <span className="text-2xl font-bold text-[#B88A44]">+</span>

              {/* Product 2 */}
              <div className="w-full min-w-0 max-w-[260px] flex-1 space-y-2 rounded-2xl border border-[#EDE8E3] bg-[#FAF9F7] p-4 text-center">
                <span className="mb-1 inline-block rounded-full border border-[#B88A44]/25 bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-semibold text-[#8C6426]">
                  عطر مكمل
                </span>
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                  <img
                    src={bundleProduct2.images?.[0] ?? "/images/figma/prod_perfume.png"}
                    alt={bundleProduct2.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h4 className="font-alexandria line-clamp-1 text-[13px] font-bold text-[#151211]">
                  {bundleProduct2.name}
                </h4>
                <span className="block text-[13px] font-bold text-[#B88A44]">
                  {bundleProduct2.price} ج.م
                </span>
              </div>

              <span className="text-2xl font-bold text-[#B88A44]">+</span>

              {/* Product 3 */}
              <div className="w-full min-w-0 max-w-[260px] flex-1 space-y-2 rounded-2xl border border-[#EDE8E3] bg-[#FAF9F7] p-4 text-center">
                <span className="mb-1 inline-block rounded-full border border-[#B88A44]/25 bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-semibold text-[#8C6426]">
                  سيروم النضارة
                </span>
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                  <img
                    src={bundleProduct3.images?.[0] ?? "/images/figma/prod_serum.png"}
                    alt={bundleProduct3.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h4 className="font-alexandria line-clamp-1 text-[13px] font-bold text-[#151211]">
                  {bundleProduct3.name}
                </h4>
                <span className="block text-[13px] font-bold text-[#B88A44]">
                  {bundleProduct3.price} ج.م
                </span>
              </div>
            </div>

            {/* Bundle Total & CTA */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#EDE8E3] pt-4 sm:flex-row">
              <div className="min-w-0 w-full sm:w-auto">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span className="text-[12px] text-[#8C827A]">السعر الإجمالي للمجموعة:</span>
                  <span className="font-alexandria text-2xl font-extrabold text-[#151211]">
                    {bundleDiscountedTotal} ج.م
                  </span>
                  <span className="text-sm text-[#A8A19B] line-through">
                    {bundleRawTotal} ج.م
                  </span>
                  <span className="rounded-full bg-[#2A7A4D]/10 px-2 py-0.5 text-[11px] font-bold text-[#2A7A4D]">
                    وفرت {bundleSavings} ج.م (15%)
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#78716C]">
                  تصل المجموعة كاملة في حقيبة مخملية مطرزة مع 3 عينات مجانية إضافية
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBundleAdded(true);
                  setTimeout(() => setBundleAdded(false), 2500);
                }}
                className="flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#B88A44] px-6 text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#A57835] hover:shadow-lg sm:w-auto sm:px-8"
              >
                <ShoppingBag className="size-4 shrink-0" />
                <span className="truncate">
                  {bundleAdded ? "تمت إضافة المجموعة بنجاح!" : "إضافة المجموعة الكاملة بخصم 15%"}
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
