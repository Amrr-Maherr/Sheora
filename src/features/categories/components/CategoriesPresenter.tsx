"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Truck,
  MessageCircle,
  Layers,
  SearchX,
} from "lucide-react";
import type { Category } from "@/types";

type CategoriesPresenterProps = {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
};

const categoryImageMap: Record<string, string> = {
  men: "/images/figma/cat_eyes.png",
  women: "/images/figma/cat_makeup.png",
  unisex: "/images/figma/cat_skincare.png",
  "eau-de-parfum": "/images/figma/cat_eyes.png",
  luxury: "/images/figma/hero_box.png",
};

export function CategoriesPresenter({ categories, isLoading, isError }: CategoriesPresenterProps) {
  const featuredCount = categories.filter((c) => c.featured).length;

  if (isError) {
    return (
      <div className="flex flex-col w-full bg-[#FAF9F7] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 w-full">
          <div className="rounded-3xl bg-white border border-[#EDE8E3] p-12 text-center space-y-4">
            <div className="size-16 rounded-full bg-[#B94727]/10 text-[#B94727] flex items-center justify-center mx-auto">
              <SearchX className="size-8" />
            </div>
            <h3 className="font-alexandria text-lg font-bold text-[#151211]">تعذر تحميل التصنيفات</h3>
            <p className="text-[13px] text-[#78716C]">حدث خطأ أثناء جلب المجموعات. حاول مرة أخرى.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[#FAF9F7] py-6 sm:py-8">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 w-full space-y-6 sm:space-y-8">
        {/* Breadcrumb & Trust Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[#78716C] pb-3 border-b border-[#EDE8E3]">
          <nav aria-label="مسار التنقل" className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#B88A44] transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-[#151211] font-semibold">التصنيفات</span>
          </nav>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#B88A44]/25 text-[#8C6426] font-medium text-[11px]">
            <ShieldCheck className="size-3.5 text-[#B88A44]" />
            <span>منتجات أصلية ومضمونة 100% من الوكلاء المعتمدين</span>
          </div>
        </div>

        {/* Editorial Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-[#FAF7F2] via-[#F4EDE2] to-[#FAF7F2] border border-[#EDE8E3] p-8 sm:p-10 lg:p-12">
          <div className="max-w-2xl space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A44]/10 border border-[#B88A44]/20 text-[#8C6426] text-[11px] font-semibold">
              <Layers className="size-3 text-[#B88A44]" />
              <span>المجموعات المختارة بعناية</span>
            </div>
            <h1 className="font-alexandria text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151211] leading-tight">
              طقوس جمال متكاملة
            </h1>
            <p className="text-[13px] sm:text-[15px] text-[#6E6761] leading-relaxed">
              من العطور الرجالية الراقية إلى الباقات الزهرية النسائية والأطياف الخشبية الدافئة — استكشف {categories.length} مجموعة فاخرة مختارة بعناية من أرقى المكونات الطبيعية النادرة.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-[12px] font-medium text-[#151211]">
              <span className="px-3 py-1 rounded-full bg-white shadow-xs border border-[#EDE8E3] flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#B88A44]" />
                عرض {categories.length} مجموعة • {featuredCount} مميزة
              </span>
              <span className="flex items-center gap-1.5 text-[#8C6426]">
                <Truck className="size-3.5 text-[#B88A44]" />
                <span>شحن مجاني سريع للطلبات فوق 500 ج.م</span>
              </span>
            </div>
          </div>
        </section>

        {/* Categories Grid — Editorial 12-col pattern like homepage */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={`${n <= 2 ? "md:col-span-6" : "md:col-span-4"} h-[320px] rounded-2xl bg-white border border-[#EDE8E3] animate-pulse`} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#EDE8E3] p-12 text-center space-y-4">
            <div className="size-16 rounded-full bg-[#FAF7F2] text-[#B88A44] flex items-center justify-center mx-auto">
              <Layers className="size-8" />
            </div>
            <h3 className="font-alexandria text-lg font-bold text-[#151211]">لا توجد مجموعات متاحة حالياً</h3>
            <p className="text-[13px] text-[#78716C] max-w-sm mx-auto">لم نعثر على تصنيفات في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {categories.map((category, idx) => {
              const spanClass = idx % 5 === 0 ? "md:col-span-6" : idx % 5 === 1 ? "md:col-span-6" : "md:col-span-4";
              const imgSrc = categoryImageMap[category.slug] ?? category.image;
              const isLarge = idx % 5 < 2;
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={`${spanClass} group relative h-[320px] sm:h-[360px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all`}
                >
                  <img src={imgSrc} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151211]/85 via-[#151211]/25 to-transparent" />
                  <div className={`absolute bottom-5 right-5 left-5 space-y-1.5 text-white ${isLarge ? "text-right" : "text-center"}`}>
                    <span className="text-[11px] font-semibold text-[#E8B577] tracking-wider uppercase flex items-center gap-1.5 justify-center data-[large=true]:justify-start [&[data-large=true]]:justify-start" data-large={isLarge}>
                      <Sparkles className="size-3 text-[#E8B577]" />
                      {category.productCount} منتج • {category.slug}
                    </span>
                    <h3 className={`font-alexandria font-bold group-hover:text-[#E8B577] transition-colors ${isLarge ? "text-xl sm:text-2xl" : "text-lg"}`}>{category.name}</h3>
                    <p className="text-[12px] text-white/80 line-clamp-2 leading-relaxed">{category.description}</p>
                    {category.featured && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#B88A44] text-white text-[10px] font-bold">مميزة</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] transition-colors">
            <span>تصفح كل المنتجات</span>
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        {/* Consultation Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-[#171615] text-white p-8 sm:p-10 border border-[#262422]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl text-right">
              <h3 className="font-alexandria text-xl sm:text-2xl font-bold text-white">هل تحتار في اختيار المجموعة المناسبة؟</h3>
              <p className="text-[13px] text-[#A8A19B] leading-relaxed">خبراء شِيورا يساعدونك في اختيار التركيبة العطرية الأنسب لشخصيتك ومناسباتك.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[13px] shadow-lg transition-all"
              >
                <MessageCircle className="size-4 fill-white" />
                <span>محادثة واتساب فورية</span>
              </a>
              <Link href="/products" className="h-11 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-[13px] transition-all inline-flex items-center justify-center">
                اختبار الذوق العطري
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
