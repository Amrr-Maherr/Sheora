"use client";

import Link from "next/link";
import {
  Sparkles,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  MessageCircle,
  SearchX,
} from "lucide-react";
import type { Brand } from "@/types";

type BrandsPresenterProps = {
  brands: Brand[];
  isLoading: boolean;
  isError: boolean;
};

export function BrandsPresenter({ brands, isLoading, isError }: BrandsPresenterProps) {
  const featuredCount = brands.filter((b) => b.featured).length;

  if (isError) {
    return (
      <div className="flex flex-col w-full bg-[#FAF9F7] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 w-full">
          <div className="rounded-3xl bg-white border border-[#EDE8E3] p-12 text-center space-y-4">
            <div className="size-16 rounded-full bg-[#B94727]/10 text-[#B94727] flex items-center justify-center mx-auto">
              <SearchX className="size-8" />
            </div>
            <h3 className="font-alexandria text-lg font-bold text-[#151211]">تعذر تحميل الماركات</h3>
            <p className="text-[13px] text-[#78716C]">حدث خطأ أثناء جلب بيانات دور العطور. حاول مرة أخرى.</p>
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
            <span className="text-[#151211] font-semibold">الماركات</span>
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
              <Building2 className="size-3 text-[#B88A44]" />
              <span>دور العطور العالمية</span>
            </div>
            <h1 className="font-alexandria text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151211] leading-tight">
              أرقى الدور العالمية
            </h1>
            <p className="text-[13px] sm:text-[15px] text-[#6E6761] leading-relaxed">
              اكتشف شركاء شِيورا من أعرق بيوت العطور الفاخرة — من دار ديور الفرنسية إلى توم فورد الأمريكية. كل دار تحكي قصة فخامة وإرث عطري فريد.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-[12px] font-medium text-[#151211]">
              <span className="px-3 py-1 rounded-full bg-white shadow-xs border border-[#EDE8E3] flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#B88A44]" />
                عرض {brands.length} داراً عالمية • {featuredCount} مميزة
              </span>
              <span className="flex items-center gap-1.5 text-[#8C6426]">
                <Truck className="size-3.5 text-[#B88A44]" />
                <span>شحن مجاني سريع للطلبات فوق 500 ج.م</span>
              </span>
            </div>
          </div>
        </section>

        {/* Brands Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-[240px] rounded-2xl bg-white border border-[#EDE8E3] animate-pulse" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#EDE8E3] p-12 text-center space-y-4">
            <div className="size-16 rounded-full bg-[#FAF7F2] text-[#B88A44] flex items-center justify-center mx-auto">
              <Building2 className="size-8" />
            </div>
            <h3 className="font-alexandria text-lg font-bold text-[#151211]">لا توجد ماركات متاحة حالياً</h3>
            <p className="text-[13px] text-[#78716C] max-w-sm mx-auto">لم نعثر على دور عطور في الوقت الحالي. حاول لاحقاً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[#EDE8E3] hover:border-[#B88A44]/30 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {brand.featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#B88A44] text-white text-[10px] font-bold">مميز</span>
                )}
                <div className="size-20 rounded-2xl bg-[#FAF9F7] border border-[#EDE8E3] p-3 flex items-center justify-center overflow-hidden mb-4 group-hover:border-[#B88A44]/20 group-hover:bg-white transition-colors">
                  <img src={brand.image} alt={brand.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
                <h3 className="font-alexandria text-[15px] font-bold text-[#151211] group-hover:text-[#B88A44] transition-colors line-clamp-1">{brand.name}</h3>
                <span className="text-[11px] text-[#8C827A] flex items-center gap-1 mt-1">
                  <span>{brand.country}</span>
                  <span>•</span>
                  <span>{brand.founded}</span>
                </span>
                <p className="text-[12px] text-[#78716C] line-clamp-2 leading-relaxed mt-2">{brand.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#B88A44] group-hover:gap-1.5 transition-all">
                  <span>استكشف العطور</span>
                  <ArrowLeft className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Consultation Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-[#171615] text-white p-8 sm:p-10 border border-[#262422]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl text-right">
              <h3 className="font-alexandria text-xl sm:text-2xl font-bold text-white">هل تبحث عن دار عطر محددة؟</h3>
              <p className="text-[13px] text-[#A8A19B] leading-relaxed">تواصل مع خبراء شِيورا لمساعدتك في اختيار الدار والعطر الأنسب لذوقك ومناسباتك.</p>
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
                تصفح كل العطور
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
