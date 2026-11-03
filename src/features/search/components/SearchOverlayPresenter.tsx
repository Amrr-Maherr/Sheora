"use client";

import type { RefObject } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  History,
  Layers,
  Search,
  SearchX,
  ShieldCheck,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";
import type { Brand, Category, Product } from "@/types";
import { SearchProductCard } from "./SearchProductCard";

type SearchOverlayPresenterProps = {
  panelRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  categories: Category[];
  activeCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  products: Product[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  recentSearches: string[];
  popularSearches: string[];
  onSelectQuery: (value: string) => void;
  onRemoveRecent: (value: string) => void;
  matchedCategories: Category[];
  matchedBrands: Brand[];
};

export function SearchOverlayPresenter({
  panelRef,
  inputRef,
  query,
  onQueryChange,
  onSubmit,
  onClose,
  categories,
  activeCategorySlug,
  onSelectCategory,
  products,
  totalCount,
  isLoading,
  isError,
  recentSearches,
  popularSearches,
  onSelectQuery,
  onRemoveRecent,
  matchedCategories,
  matchedBrands,
}: SearchOverlayPresenterProps) {
  const trimmedQuery = query.trim();
  const isSearching = Boolean(trimmedQuery || activeCategorySlug);
  const allResultsHref = (() => {
    const params = new URLSearchParams();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }
    if (activeCategorySlug) {
      params.set("category", activeCategorySlug);
    }

    const search = params.toString();

    return search ? `/products?${search}` : "/products";
  })();

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="البحث في متجر شيورا"
      className="max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain bg-[#FAF9F7] p-4 sm:p-6"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex items-center gap-2">
          <form onSubmit={onSubmit} className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-[#B88A44]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="ابحث عن سيروم، عطر، مكياج، ماركة..."
              aria-label="البحث في المنتجات"
              className="h-14 w-full rounded-xl border-2 border-[#B88A44] bg-white pr-12 pl-12 font-alexandria text-[15px] font-bold text-[#151211] shadow-[0_6px_18px_rgba(184,138,68,0.08)] outline-none placeholder:text-[12px] placeholder:font-normal placeholder:text-[#A8A19B] focus:ring-4 focus:ring-[#B88A44]/10 sm:text-[18px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="مسح كلمة البحث"
                className="absolute left-3.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#F5F1EB] text-[#78716C] transition-colors hover:bg-[#EDE8E3] hover:text-[#151211]"
              >
                <X className="size-3.5" />
              </button>
            )}
          </form>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق البحث"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#E7E0D7] bg-white text-[#57534E] transition-colors hover:border-[#B88A44] hover:text-[#B88A44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-medium text-[#78716C]">
            تصفية حسب:
          </span>
          <FilterChip
            active={!activeCategorySlug}
            label={`الكل (${totalCount})`}
            onClick={() => onSelectCategory(null)}
          />
          {categories.slice(0, 4).map((category) => (
            <FilterChip
              key={category.id}
              active={activeCategorySlug === category.slug}
              label={`${category.name} (${category.productCount})`}
              onClick={() =>
                onSelectCategory(
                  activeCategorySlug === category.slug ? null : category.slug,
                )
              }
            />
          ))}
        </div>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="order-2 space-y-5 rounded-2xl border border-[#EDE8E3] bg-white p-5 lg:order-1">
            {recentSearches.length > 0 && (
              <section>
                <SectionTitle icon={<History className="size-4" />}>
                  عمليات بحثك الأخيرة
                </SectionTitle>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E0D7] bg-[#FAF9F7] py-1 pe-1.5 ps-3 text-[11px] text-[#3F3A35]"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectQuery(term)}
                        className="max-w-[150px] truncate transition-colors hover:text-[#B88A44]"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveRecent(term)}
                        aria-label={`إزالة ${term} من عمليات البحث الأخيرة`}
                        className="flex size-4 items-center justify-center rounded-full text-[#A8A19B] transition-colors hover:bg-[#EDE8E3] hover:text-[#151211]"
                      >
                        <X className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className={recentSearches.length > 0 ? "border-t border-[#F0EBE5] pt-4" : ""}>
              <SectionTitle icon={<TrendingUp className="size-4" />}>
                الأكثر رواجاً وبحثاً الآن
              </SectionTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onSelectQuery(term)}
                    className="rounded-md border border-[#EADFD0] bg-[#FBF5EC] px-2.5 py-1.5 text-[11px] text-[#8C6426] transition-colors hover:border-[#B88A44] hover:bg-[#F6EBD9]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {matchedCategories.length > 0 && (
              <section className="border-t border-[#F0EBE5] pt-4">
                <SectionTitle icon={<Layers className="size-4" />}>
                  أقسام مطابقة لبحثك
                </SectionTitle>
                <ul className="mt-2 divide-y divide-[#F4EFE9]">
                  {matchedCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/products?category=${encodeURIComponent(category.slug)}`}
                        onClick={onClose}
                        className="flex items-center justify-between gap-2 py-2.5 text-[11.5px] text-[#3F3A35] transition-colors hover:text-[#B88A44]"
                      >
                        <span className="line-clamp-1">{category.name}</span>
                        <span className="shrink-0 rounded-full bg-[#FBF5EC] px-2 py-0.5 text-[9px] font-semibold text-[#8C6426]">
                          {category.productCount} منتج
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {matchedBrands.length > 0 && (
              <section className="border-t border-[#F0EBE5] pt-4">
                <SectionTitle icon={<BadgeCheck className="size-4" />}>
                  ماركات متطابقة
                </SectionTitle>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {matchedBrands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.slug}`}
                      onClick={onClose}
                      className="flex min-h-11 items-center justify-center rounded-lg border border-[#EDE8E3] bg-white px-2 py-2 text-center text-[11px] font-semibold text-[#3F3A35] transition-colors hover:border-[#B88A44] hover:text-[#8C6426]"
                    >
                      <span className="line-clamp-2">{brand.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>

          <section className="order-1 min-w-0 lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[13px] font-semibold text-[#151211]">
                {trimmedQuery ? (
                  <>
                    نتائج البحث الفورية لـ{" "}
                    <span className="text-[#B88A44]">&quot;{trimmedQuery}&quot;</span>{" "}
                    <span className="text-[11px] font-normal text-[#8C827A]">
                      (تم العثور على {totalCount} نتيجة)
                    </span>
                  </>
                ) : (
                  "اكتشف منتجاتنا المختارة"
                )}
              </h2>
              <span className="text-[10px] text-[#8C827A]">
                الأسعار تشمل ضريبة القيمة المضافة
              </span>
            </div>

            {isLoading && isSearching ? (
              <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[320px] animate-pulse rounded-xl border border-[#EDE8E3] bg-white"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-[#EDE8E3] bg-white py-16 text-center">
                <SearchX className="size-10 text-[#B88A44]" />
                <p className="mt-3 font-alexandria text-[15px] font-bold text-[#151211]">
                  تعذر تحميل نتائج البحث
                </p>
                <p className="mt-1 text-[12px] text-[#78716C]">
                  حاول مرة أخرى بعد قليل.
                </p>
              </div>
            ) : !isSearching ? (
              <div className="mt-4 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E0D7] bg-white/60 px-6 py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#FBF5EC] text-[#B88A44]">
                  <Search className="size-6" />
                </span>
                <p className="mt-4 font-alexandria text-[16px] font-bold text-[#151211]">
                  ابحث عن منتجك المفضل
                </p>
                <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-[#78716C]">
                  اكتب اسم المنتج أو الماركة أو القسم، وستظهر لك النتائج
                  الفورية والاقتراحات المطابقة.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-[#EDE8E3] bg-white py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#FBF5EC] text-[#B88A44]">
                  <SearchX className="size-6" />
                </span>
                <p className="mt-3 font-alexandria text-[15px] font-bold text-[#151211]">
                  لا توجد نتائج مطابقة
                </p>
                <p className="mt-1 text-[12px] text-[#78716C]">
                  جرّب كلمة بحث أخرى أو اختر قسماً مختلفاً.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {products.map((product) => (
                  <SearchProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            )}

            {isSearching && products.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 border-t border-[#EDE8E3] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#8C827A]">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="size-3.5 text-[#B88A44]" />
                    شحن سريع لجميع المحافظات
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-[#B88A44]" />
                    منتجات أصلية 100%
                  </span>
                </div>
                <Link
                  href={allResultsHref}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B88A44] transition-colors hover:text-[#8C6426]"
                >
                  <span>
                    عرض كافة نتائج البحث ({totalCount} منتج
                    {trimmedQuery ? ` لـ "${trimmedQuery}"` : ""})
                  </span>
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-full bg-[#B88A44] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-colors"
          : "rounded-full border border-[#E7E0D7] bg-white px-3.5 py-1.5 text-[11px] font-medium text-[#3F3A35] transition-colors hover:border-[#B88A44] hover:text-[#8C6426]"
      }
    >
      {label}
    </button>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 font-alexandria text-[12px] font-bold text-[#8C6426]">
      <span className="text-[#B88A44]">{icon}</span>
      <span>{children}</span>
    </h3>
  );
}
