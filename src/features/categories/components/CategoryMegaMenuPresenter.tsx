"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles, X } from "lucide-react";
import type { Brand, Category } from "@/types";

type CategoryMegaMenuPresenterProps = {
  activeLabel: string;
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  brandsLoading: boolean;
  onClose: () => void;
};

export function CategoryMegaMenuPresenter({
  activeLabel,
  categories,
  brands,
  isLoading,
  brandsLoading,
  onClose,
}: CategoryMegaMenuPresenterProps) {
  return (
    <div className="absolute left-1/2 top-full z-50 max-h-[calc(100dvh-10rem)] w-[calc(100%-2rem)] max-w-[1280px] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-b-2xl border border-t-0 border-[#EDE8E3] bg-white shadow-[0_28px_70px_rgba(20,20,20,0.16)]">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-7">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F0EBE5] pb-5">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[#B88A44]" />
            <div>
              <h2 className="font-alexandria text-[22px] font-bold leading-tight text-[#151211]">
                أشهر الماركات والعناية الفاخرة
              </h2>
              <p className="mt-1 text-[12px] text-[#8C827A]">
                مختارات أصلية 100% مع ضمان الجودة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/brands"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#8C6426] transition-colors hover:text-[#B88A44]"
            >
              <span>تسوّق جميع الماركات</span>
              <ArrowLeft className="size-4" />
            </Link>
            <span className="hidden h-5 w-px bg-[#E7E0D7] sm:block" />
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق قائمة الأقسام"
              className="flex size-10 items-center justify-center rounded-full border border-[#E7E0D7] text-[#57534E] transition-colors hover:border-[#B88A44] hover:text-[#B88A44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="border-e border-[#EDE8E3] pe-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-[#B88A44]" />
              <h3 className="font-alexandria text-[14px] font-bold text-[#8C6426]">
                أقسام {activeLabel}
              </h3>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-5 animate-pulse rounded bg-[#F3EEE7]"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="py-3 text-[12px] text-[#8C827A]">
                لا توجد أقسام متاحة حالياً.
              </p>
            ) : (
              <ul className="divide-y divide-[#F4EFE9]">
                {categories.slice(0, 8).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category.slug)}`}
                      onClick={onClose}
                      className="flex items-center justify-between gap-3 py-2.5 text-[12.5px] text-[#3F3A35] transition-colors hover:text-[#B88A44]"
                    >
                      <span className="line-clamp-1">{category.name}</span>
                      <span className="shrink-0 text-[11px] text-[#B7AEA4]">
                        ({category.productCount})
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 rounded-xl border border-[#EADFD0] bg-[#FBF5EC] p-4 text-center">
              <p className="text-[12px] font-bold text-[#8C6426]">
                عرض حصري للأعضاء
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#8C7A60]">
                احصل على هدية مجانية فاخرة مع أي طلب يتجاوز 500 ج.م من ماركات
                العناية المختارة.
              </p>
              <Link
                href="/products?deals=true"
                onClick={onClose}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#8C6426] transition-colors hover:text-[#B88A44]"
              >
                <span>استكشف العرض</span>
                <ArrowLeft className="size-3.5" />
              </Link>
            </div>
          </aside>

          <section>
            {brandsLoading ? (
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[72px] animate-pulse rounded-xl bg-[#F7F3ED]"
                  />
                ))}
              </div>
            ) : brands.length === 0 ? (
              <div className="flex h-full min-h-40 items-center justify-center rounded-xl border border-dashed border-[#E7E0D7] text-[12px] text-[#8C827A]">
                لا توجد ماركات متاحة حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                {brands.slice(0, 12).map((brand) => (
                  <BrandMenuCard key={brand.id} brand={brand} onNavigate={onClose} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function BrandMenuCard({
  brand,
  onNavigate,
}: {
  brand: Brand;
  onNavigate: () => void;
}) {
  const logo = brand.logo || brand.image;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      onClick={onNavigate}
      className="group flex min-h-[72px] items-center justify-between gap-3 rounded-xl border border-[#EDE8E3] bg-white px-4 py-3 transition-all hover:border-[#B88A44]/45 hover:shadow-[0_8px_24px_rgba(184,138,68,0.12)]"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F6F0E6] text-[#B88A44] transition-colors group-hover:bg-[#B88A44] group-hover:text-white">
        <ArrowUpRight className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1 truncate text-center text-[12.5px] font-bold text-[#151211] transition-colors group-hover:text-[#8C6426]">
        {brand.name}
      </span>
      <span className="flex h-11 w-[112px] shrink-0 items-center justify-center overflow-hidden">
        {logo ? (
          <img
            src={logo}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="font-playfair text-[13px] font-bold tracking-wide text-[#8C827A]">
            {brand.name}
          </span>
        )}
      </span>
    </Link>
  );
}
