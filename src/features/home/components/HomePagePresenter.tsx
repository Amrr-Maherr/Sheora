"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  X,
  ShoppingBag,
  Star,
  Quote,
  BadgeCheck,
  Building2,
  Gift,
} from "lucide-react";
import type { Product, Category, Brand, Review } from "@/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";

type HomePagePresenterProps = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: boolean;
  brands: Brand[];
  brandsLoading: boolean;
  brandsError: boolean;
  reviews: Review[];
  reviewsLoading: boolean;
  reviewsError: boolean;
};

export function HomePagePresenter({
  products,
  isLoading,
  categories,
  categoriesLoading,
  brands,
  brandsLoading,
  reviews,
  reviewsLoading,
}: HomePagePresenterProps) {
  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // VIP Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  // Spot product added state
  const [spotAdded, setSpotAdded] = useState(false);

  const bestSellers = products.slice(0, 4);
  const faceBodyProducts = products.slice(4, 8);
  const featuredCategories = categories.filter((c) => c.featured).slice(0, 3);
  const displayCategories = featuredCategories.length >= 3 ? featuredCategories : categories.slice(0, 3);
  const featuredBrands = brands.filter((b) => b.featured).slice(0, 6);
  const displayBrands = featuredBrands.length > 0 ? featuredBrands : brands.slice(0, 6);
  const displayReviews = reviews.slice(0, 3);

  const categoryImageMap: Record<string, string> = {
    men: "/images/figma/cat_eyes.png",
    women: "/images/figma/cat_makeup.png",
    unisex: "/images/figma/cat_skincare.png",
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#FAF9F7] overflow-hidden">
      {/* 1. Promo Announcement Banner — marquee */}
      <section className="overflow-hidden border-b border-[#EDE7DF] bg-[#FAF7F2] py-2.5" aria-label="عروض شِيورا الحالية">
        <div className="flex w-full overflow-hidden" dir="ltr">
          <div className="animate-sheora-marquee flex items-center whitespace-nowrap px-4 text-[12px] font-medium text-[#8C6426] md:text-[13px]">
            {[0, 1].map((copy) => (
              <p key={copy} className="flex shrink-0 items-center gap-10 pe-10" dir="rtl" aria-hidden={copy === 1}>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-3.5 shrink-0 text-[#B88A44]" />
                  مجموعة العطور الملكية 2026 متاحة الآن — إصدارات محدودة بتغليف فاخر حصري
                </span>
                <span className="text-[#D4C4B0]" aria-hidden>
                  ✦
                </span>
                <span className="inline-flex items-center gap-2">
                  <Gift className="size-3.5 shrink-0 text-[#B88A44]" />
                  عينة فاخرة مجانية مع كل طلب فوق 800 ج.م داخل القاهرة والجيزة
                </span>
                <span className="text-[#D4C4B0]" aria-hidden>
                  ✦
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-3.5 shrink-0 text-[#B88A44]" />
                  توصيل سريع خلال 24 ساعة للطلبات المؤكدة قبل الساعة 2 مساءً
                </span>
                <span className="text-[#D4C4B0]" aria-hidden>
                  ✦
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Hero Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-[#FAF9F7] via-[#F6F2EC] to-[#FAF9F7]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Right column in RTL: Text Narrative */}
            <div className="lg:col-span-6 space-y-6 text-right z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A44]/10 border border-[#B88A44]/20 text-[#8C6426] text-[11px] font-semibold tracking-wider">
                <Sparkles className="size-3 text-[#B88A44]" />
                <span>مجموعة العطور الملكية 2026</span>
              </div>

              <h1 className="font-alexandria text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#151211] leading-[1.15] tracking-tight">
                اكتشف عطرك.
                <br />
                <span className="text-[#B88A44]">اصنع حضورك.</span>
              </h1>

              <p className="text-[14px] sm:text-[16px] text-[#6E6761] leading-relaxed max-w-[480px]">
                عطور فاخرة صُممت لتترك أثراً لا يُنسى، بتركيبات استثنائية تجمع بين الأصالة الشرقية والفخامة العصرية في كل رشة.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full bg-[#B88A44] hover:bg-[#A57835] text-white font-medium text-[14px] shadow-md hover:shadow-lg transition-all"
                >
                  <span>اكتشف الآن</span>
                  <ArrowLeft className="size-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 h-[48px] px-6 rounded-full border border-[#B88A44]/50 bg-white hover:bg-[#FAF7F2] text-[#151211] font-medium text-[14px] transition-all cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-[#B88A44] text-white">
                    <Play className="size-3 fill-white ml-0.5" />
                  </div>
                  <span>شاهد الفيلم</span>
                </button>
              </div>
            </div>

            {/* Left column in RTL: Hero Perfume Presentation */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-[#EDE8E3] bg-white group">
                <img
                  src="/images/figma/hero_box.png"
                  alt="صندوق عطر شِيورا الفاخر"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 right-6 left-6 flex items-center justify-between text-white pointer-events-none">
                  <div>
                    <span className="text-[11px] font-medium tracking-widest text-[#E8B577] uppercase block">
                      Édition Royale Limitée
                    </span>
                    <h3 className="font-alexandria text-lg font-bold">
                      عطر أوريليا إكسير رويال
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#B88A44] text-white font-bold text-[12px]">
                    100ml EDP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Categories Section — Dynamic via API */}
      <section className="py-16 md:py-20 bg-white border-y border-[#F0EBE5]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">المجموعات المختارة بعناية</h2>
            <p className="text-[14px] text-[#78716C]">طقوس جمال متكاملة من أرقى المكونات الطبيعية النادرة — {categories.length} مجموعة فاخرة</p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`${n === 1 ? "md:col-span-6" : "md:col-span-3"} h-[380px] sm:h-[440px] rounded-2xl bg-[#FAF9F7] animate-pulse border border-[#EDE8E3]`} />
              ))}
            </div>
          ) : displayCategories.length === 0 ? (
            <p className="text-center text-[14px] text-[#78716C] py-12">لا توجد مجموعات متاحة حالياً</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {displayCategories.map((category, idx) => {
                const spanClass = idx === 0 ? "md:col-span-6" : "md:col-span-3";
                const imgSrc = categoryImageMap[category.slug] ?? category.image;
                const isLarge = idx === 0;
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className={`${spanClass} group relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all`}
                  >
                    <img
                      src={imgSrc}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151211]/85 via-[#151211]/20 to-transparent" />
                    <div className={`absolute bottom-6 right-6 left-6 space-y-1 text-white ${isLarge ? "text-right" : "text-center"}`}>
                      <span className="text-[11px] font-semibold text-[#E8B577] tracking-wider uppercase flex items-center gap-1.5 justify-center data-[large=true]:justify-start [&[data-large=true]]:justify-start" data-large={isLarge}>
                        <Sparkles className="size-3 text-[#E8B577]" />
                        {category.productCount} منتج • {category.slug}
                      </span>
                      <h3 className={`font-alexandria font-bold group-hover:text-[#E8B577] transition-colors ${isLarge ? "text-xl sm:text-2xl" : "text-lg"}`}>{category.name}</h3>
                      <p className={`text-[12px] text-white/80 line-clamp-2 leading-relaxed ${isLarge ? "max-w-[420px]" : ""}`}>{category.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] transition-colors">
              <span>عرض كل التصنيفات</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EDE8E3]">
            <div>
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                الأكثر طلباً الآن
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">
                إبداعات شِيورا الأكثر تميزاً وإقبالاً هذا الموسم
              </p>
            </div>
            <Link
              href="/products"
              className="text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] flex items-center gap-1.5 transition-colors"
            >
              <span>عرض كافة المنتجات</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          {/* Dynamic 4-card Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-[420px] rounded-2xl bg-white animate-pulse border border-[#EDE8E3]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="home"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Cinematic Luxury Video Showcase Section */}
      <section className="relative w-full py-20 bg-[#0E0D0C] text-white overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-widest block">
              عالم شِيورا السينمائي
            </span>
            <h2 className="font-alexandria text-3xl sm:text-4xl font-extrabold text-white">
              The Essence of SHEORA — الفخامة الاستثنائية
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#9E9791]">
              رحلة حسية تتجاوز المألوف لتجسيد أرقى مستويات الجمال والعطور الساحرة
            </p>
          </div>

          {/* Video Container Stage */}
          <div className="relative max-w-[1040px] mx-auto aspect-video rounded-3xl overflow-hidden border border-[#2B2825] shadow-2xl group">
            <img
              src="/images/figma/video_poster.png"
              alt="SHEORA Cinematic Luxury Commercial"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

            {/* Play Button Trigger */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                aria-label="تشغيل الفيلم"
                className="flex size-20 sm:size-24 items-center justify-center rounded-full bg-[#B88A44] hover:bg-[#D8A86C] text-white shadow-2xl transition-transform hover:scale-110 cursor-pointer"
              >
                <Play className="size-8 sm:size-10 fill-white ml-1 text-white" />
              </button>
              <span className="text-[14px] font-medium tracking-wide text-white drop-shadow-md">
                شاهد مجموعة خريف 2026
              </span>
            </div>

            {/* Video Badges */}
            <div className="absolute bottom-5 left-6 flex items-center gap-2 text-[11px] text-[#D5CFC9]">
              <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/15">
                01:45 دقيقة
              </span>
              <span className="px-2.5 py-1 rounded bg-[#B88A44] text-white font-bold">
                4K Ultra HD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#333]">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 left-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="size-5" />
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="SHEORA Cinematic Luxury Film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 6. Clinical Before & After Comparison Slider Section */}
      <section className="py-20 bg-white border-b border-[#EDE8E3]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-wider block">
              فعالية مثبتة سريرياً
            </span>
            <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
              نتائج استثنائية ملحوظة — قبل وبعد
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#78716C]">
              شاهد التحول الحقيقي في نضارة البشرة ومرونتها بفضل تركيبة إكسير الشباب المركزة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F7] rounded-3xl p-6 sm:p-8 border border-[#EDE8E3]">
            {/* Left in RTL: Interactive Before/After Split Slider */}
            <div className="lg:col-span-7">
              <BeforeAfterSlider />
            </div>

            {/* Right in RTL: Spotlight Product & Proven Metrics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-16 rounded-xl bg-white border border-[#EDE8E3] p-1 shrink-0 flex items-center justify-center">
                  <img
                    src="/images/figma/prod_serum.png"
                    alt="سيروم إكسير الشباب"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#B88A44] block">
                    العناية المتطورة
                  </span>
                  <h3 className="font-alexandria text-base font-bold text-[#151211]">
                    سيروم إكسير الشباب المركز
                  </h3>
                  <span className="text-[11px] text-[#8C827A]">
                    L&apos;Éclat de Jeunesse — 30ml
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#6E6761] leading-relaxed">
                تركيبة حصرية غنية بالخلايا الجذعية وحمض الهيالورونيك النقي. يعزز مرونة الجلد، يقلل الخطوط الدقيقة بنسبة 87%، ويمنح نضارة وإشراقة فورية تدوم طوال اليوم.
              </p>

              {/* 3 Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#EDE8E3] text-center">
                  <span className="font-alexandria text-xl font-extrabold text-[#B88A44] block">
                    +94%
                  </span>
                  <span className="text-[10px] text-[#78716C] mt-0.5 block">
                    ترطيب عميق فوري
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#EDE8E3] text-center">
                  <span className="font-alexandria text-xl font-extrabold text-[#B88A44] block">
                    +88%
                  </span>
                  <span className="text-[10px] text-[#78716C] mt-0.5 block">
                    إشراقة وتوحيد لون
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#EDE8E3] text-center">
                  <span className="font-alexandria text-xl font-extrabold text-[#2A7A4D] block">
                    100%
                  </span>
                  <span className="text-[10px] text-[#78716C] mt-0.5 block">
                    نتائج مثبتة سريرياً
                  </span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-2">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-[#151211]">
                    450 ج.م
                  </span>
                  <span className="text-[13px] text-[#A8A19B] line-through">
                    650 ج.م
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#B94727]/10 text-[#B94727] text-[11px] font-bold">
                    وفر 200 ج.م
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSpotAdded(true);
                    setTimeout(() => setSpotAdded(false), 2000);
                  }}
                  className="w-full h-11 rounded-xl bg-[#B88A44] hover:bg-[#A57835] text-white font-medium text-[13px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag className="size-4" />
                  <span>
                    {spotAdded ? "تمت الإضافة بنجاح!" : "أضف إلى السلة — 450 ج.م"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Second Product Section - Face & Body Care */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EDE8E3]">
            <div>
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                العناية بالوجه والجسم
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">
                كل ما تحتاجينه لبشرة مفعمة بالحيوية والنعومة الفائقة
              </p>
            </div>
            <Link
              href="/products?category=skincare"
              className="text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] flex items-center gap-1.5 transition-colors"
            >
              <span>استكشف الطقوس كاملة</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {faceBodyProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="home"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Featured Brands Showcase — Dynamic via API */}
      <section className="py-16 md:py-20 bg-white border-y border-[#F0EBE5]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EDE8E3]">
            <div>
              <div className="inline-flex items-center gap-2 text-[#B88A44] text-[11px] font-semibold tracking-widest uppercase mb-2">
                <Building2 className="size-3.5" />
                <span>دور العطور العالمية</span>
              </div>
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">أرقى الدور العالمية</h2>
              <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">شركاؤنا من بيوت العطور الفاخرة — {brands.length} داراً عالمية</p>
            </div>
            <Link href="/brands" className="text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] flex items-center gap-1.5 transition-colors">
              <span>استكشف كل الماركات</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          {brandsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[180px] rounded-2xl bg-[#FAF9F7] animate-pulse border border-[#EDE8E3]" />
              ))}
            </div>
          ) : displayBrands.length === 0 ? (
            <p className="text-center text-[14px] text-[#78716C] py-12">لا توجد ماركات متاحة</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-[#FAF9F7] border border-[#EDE8E3] hover:bg-white hover:border-[#B88A44]/30 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {brand.featured && (
                    <span className="absolute top-3 right-3 px-1.5 py-0.5 rounded-full bg-[#B88A44] text-white text-[9px] font-bold">مميز</span>
                  )}
                  <div className="size-16 rounded-xl bg-white border border-[#EDE8E3] p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:border-[#B88A44]/20 transition-colors">
                    <img src={brand.image} alt={brand.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                  <h3 className="font-alexandria text-[13px] font-bold text-[#151211] group-hover:text-[#B88A44] transition-colors line-clamp-1">{brand.name}</h3>
                  <span className="text-[11px] text-[#8C827A] flex items-center gap-1 mt-0.5">
                    {brand.country} • {brand.founded}
                  </span>
                  <span className="text-[10px] text-[#78716C] line-clamp-2 mt-1 leading-relaxed">{brand.description.slice(0, 60)}...</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 9. Testimonials / Reviews — Dynamic via API */}
      <section className="py-16 md:py-20 bg-[#FAF9F7]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Star className="size-3.5 fill-[#B88A44] text-[#B88A44]" />
              آراء عملائنا
            </span>
            <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">ماذا يقول عشاق شِيورا</h2>
            <p className="text-[13px] sm:text-[14px] text-[#78716C]">تجارب حقيقية من عملاء وثقوا بجودة عطورنا الفاخرة — {reviews.length} تقييم</p>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[220px] rounded-2xl bg-white animate-pulse border border-[#EDE8E3]" />
              ))}
            </div>
          ) : displayReviews.length === 0 ? (
            <p className="text-center text-[14px] text-[#78716C] py-12">لا توجد تقييمات بعد — كن أول من يقيّم</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayReviews.map((review) => (
                <div key={review.id} className="relative p-6 rounded-2xl bg-white border border-[#EDE8E3] hover:border-[#B88A44]/20 hover:shadow-lg transition-all flex flex-col">
                  <Quote className="absolute top-5 left-5 size-6 text-[#B88A44]/15" />
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-4 ${i < review.rating ? "fill-[#B88A44] text-[#B88A44]" : "text-[#EDE8E3]"}`} />
                    ))}
                    <span className="text-[11px] font-medium text-[#8C6426] mr-1">{review.rating.toFixed(1)}</span>
                  </div>
                  <h3 className="font-alexandria text-[14px] font-bold text-[#151211] mb-1.5 line-clamp-1">{review.title}</h3>
                  <p className="text-[13px] text-[#6E6761] leading-relaxed line-clamp-3 flex-1">&ldquo;{review.comment}&rdquo;</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0EBE5]">
                    <div>
                      <span className="text-[13px] font-semibold text-[#151211] block">{review.userName}</span>
                      <span className="text-[11px] text-[#8C827A]">{new Date(review.createdAt).toLocaleDateString("ar-EG")}</span>
                    </div>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#2A7A4D]/10 text-[#2A7A4D] text-[10px] font-semibold">
                        <BadgeCheck className="size-3" />
                        شراء موثّق
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] transition-colors">
              <span>تصفح كل التقييمات</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Newsletter & VIP Privilege Banner */}
      <section className="py-16 bg-[#171615] text-white border-t border-[#262422]">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6 text-center space-y-6">
          <span className="text-[11px] font-semibold text-[#B88A44] tracking-widest uppercase">
            عضوية شِيورا الحصرية
          </span>

          <h2 className="font-alexandria text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug">
            انضم إلى قائمة النخبة واحصل على مزايا خاصة
          </h2>

          <p className="text-[13px] sm:text-[14px] text-[#A8A19B] max-w-xl mx-auto leading-relaxed">
            كن أول من يعلم بإصدارات العطور المحدودة وتلقى دعوات خاصة للفعاليات والخصومات الحصرية المخصصة لك.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني..."
              className="w-full sm:flex-1 h-12 px-5 rounded-full bg-white/5 border border-white/15 text-[13px] text-white placeholder:text-[#78716C] focus:outline-none focus:border-[#B88A44] focus:ring-1 focus:ring-[#B88A44]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#B88A44] hover:bg-[#A57835] text-white font-medium text-[13px] transition-all cursor-pointer"
            >
              {subscribed ? "شكراً لانضمامك!" : "اشتراك"}
            </button>
          </form>

          {subscribed && (
            <p className="text-[12px] text-[#2A7A4D] flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4" />
              <span>تم تسجيل اشتراكك بنجاح في نادي النخبة. تفقد بريدك لتفعيل المزايا!</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}