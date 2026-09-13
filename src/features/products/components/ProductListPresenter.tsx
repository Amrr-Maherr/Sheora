"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  ChevronDown,
  X,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductFilters, type FilterState } from "./ProductFilters";

type ProductListPresenterProps = {
  products: Product[];
  totalCount?: number;
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onResetFilters?: () => void;
  sortOption?: string;
  onSortChange?: (option: string) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  hero?: {
    badge?: string;
    title?: string;
    description?: string;
    breadcrumbLabel?: string;
    breadcrumbHref?: string;
  };
};

const defaultFilters: FilterState = {
  selectedBrands: [],
  minPrice: 100,
  maxPrice: 2000,
  selectedIngredient: null,
  selectedSkinType: null,
  minRating: null,
  onlyDeals: false,
  freeSamples: false,
};

export function ProductListPresenter({
  products,
  totalCount = products.length,
  filters = defaultFilters,
  onFilterChange = () => {},
  onResetFilters = () => {},
  sortOption = "popularity",
  onSortChange = () => {},
  currentPage = 1,
  onPageChange = () => {},
  isLoading,
  hero,
}: ProductListPresenterProps) {
  const heroBadge = hero?.badge ?? "مجموعة العناية الفائقة";
  const heroTitle = hero?.title ?? "سيروم وإكسير النضارة الفاخر";
  const heroDescription =
    hero?.description ??
    "اكتشفي تشكيلة استثنائية من أرقى مستحضرات العناية المركزة، مصممة لإعادة إشراقة ونضارة البشرة بمكونات طبيعية نقية وتقنيات متطورة تحاكي طقوس الجمال الأزلية.";
  const breadcrumbLabel = hero?.breadcrumbLabel ?? "سيروم وإكسير النضارة";
  const breadcrumbHref = hero?.breadcrumbHref ?? "/products?category=skincare";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Active filters helper
  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.selectedIngredient !== null ||
    filters.selectedSkinType !== null ||
    filters.minRating !== null ||
    filters.onlyDeals ||
    filters.freeSamples ||
    filters.maxPrice < 2000;

  return (
    <div className="flex flex-col w-full bg-[#FAF9F7] py-6 sm:py-8">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 w-full space-y-6 sm:space-y-8">
        {/* 1. Breadcrumb & Trust Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[#78716C] pb-3 border-b border-[#EDE8E3]">
          {/* Breadcrumb path */}
          <nav aria-label="مسار التنقل" className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#B88A44] transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href={breadcrumbHref} className="hover:text-[#B88A44] transition-colors">
              {breadcrumbHref.includes("/brands") ? "الماركات" : breadcrumbHref.includes("/categories") ? "التصنيفات" : "العناية بالبشرة"}
            </Link>
            <span>/</span>
            <span className="text-[#151211] font-semibold">{breadcrumbLabel}</span>
          </nav>

          {/* Trust Banner Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#B88A44]/25 text-[#8C6426] font-medium text-[11px]">
            <ShieldCheck className="size-3.5 text-[#B88A44]" />
            <span>منتجات أصلية ومضمونة 100% من الوكلاء المعتمدين</span>
          </div>
        </div>

        {/* 2. Category Editorial Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-[#FAF7F2] via-[#F4EDE2] to-[#FAF7F2] border border-[#EDE8E3] p-8 sm:p-10 lg:p-12">
          <div className="max-w-2xl space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A44]/10 border border-[#B88A44]/20 text-[#8C6426] text-[11px] font-semibold">
              <Sparkles className="size-3 text-[#B88A44]" />
              <span>{heroBadge}</span>
            </div>

            <h1 className="font-alexandria text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151211] leading-tight">{heroTitle}</h1>

            <p className="text-[13px] sm:text-[15px] text-[#6E6761] leading-relaxed">{heroDescription}</p>

            {/* Counts & Delivery perks */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-[12px] font-medium text-[#151211]">
              <span className="px-3 py-1 rounded-full bg-white shadow-xs border border-[#EDE8E3]">
                عرض {totalCount} منتج متميز
              </span>
              <span className="flex items-center gap-1.5 text-[#8C6426]">
                <Truck className="size-3.5 text-[#B88A44]" />
                <span>شحن مجاني سريع للطلبات فوق 500 ج.م</span>
              </span>
            </div>
          </div>
        </section>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EDE8E3] text-[13px] font-semibold text-[#151211] shadow-xs"
          >
            <SlidersHorizontal className="size-4 text-[#B88A44]" />
            <span>تصفية النتائج</span>
          </button>
          <span className="text-[12px] text-[#78716C] font-medium">
            {products.length} منتج
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex justify-end">
            <div className="w-full max-w-sm bg-white rounded-2xl h-full overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E3]">
                <h3 className="font-alexandria font-bold text-base">التصفية</h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="size-5" />
                </button>
              </div>
              <ProductFilters
                filters={filters}
                onFilterChange={onFilterChange}
                onReset={onResetFilters}
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-[#151211] text-white text-[13px] font-bold"
              >
                تطبيق التصفية
              </button>
            </div>
          </div>
        )}

        {/* 3. Main Catalog Grid (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar on right in RTL (Span 3) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28">
            <ProductFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onResetFilters}
            />
          </div>

          {/* Products Main Area on left in RTL (Span 9) */}
          <section className="lg:col-span-9 space-y-6">
            {/* Controls Bar: Active Filters, Sorting, and View Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EDE8E3] shadow-xs">
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <span className="text-[12px] text-[#8C827A] font-medium">
                  التصفية الحالية:
                </span>

                {filters.maxPrice < 2000 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#B88A44]/30 text-[#8C6426] text-[11px]">
                    <span>السعر: حتى {filters.maxPrice} ج.م</span>
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, maxPrice: 2000 })}
                      className="hover:text-black cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {filters.selectedIngredient && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#B88A44]/30 text-[#8C6426] text-[11px]">
                    <span>{filters.selectedIngredient}</span>
                    <button
                      type="button"
                      onClick={() => onFilterChange({ ...filters, selectedIngredient: null })}
                      className="hover:text-black cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[11px] text-[#B88A44] hover:underline cursor-pointer mr-2"
                  >
                    مسح الكل
                  </button>
                )}

                {!hasActiveFilters && (
                  <span className="text-[11px] text-[#A8A19B]">
                    جميع المنتجات معروضة
                  </span>
                )}
              </div>

              {/* Sorting and View Switcher */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="appearance-none h-9 pr-3 pl-8 text-[12px] font-medium bg-[#FAF9F7] border border-[#E8E2DA] rounded-xl text-[#151211] focus:outline-none focus:border-[#B88A44] cursor-pointer"
                  >
                    <option value="popularity">الأكثر طلباً وتفضيلاً</option>
                    <option value="price-asc">السعر: من الأقل للأعلى</option>
                    <option value="price-desc">السعر: من الأعلى للأقل</option>
                    <option value="newest">الأحدث وصولاً</option>
                  </select>
                  <ChevronDown className="absolute left-2.5 top-2.5 size-3.5 text-[#8C827A] pointer-events-none" />
                </div>

                {/* View Switcher */}
                <div className="flex items-center rounded-xl bg-[#FAF9F7] border border-[#E8E2DA] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="عرض شبكي"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-[#151211] shadow-xs"
                        : "text-[#8C827A] hover:text-[#151211]"
                    }`}
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="عرض قائمة"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white text-[#151211] shadow-xs"
                        : "text-[#8C827A] hover:text-[#151211]"
                    }`}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-[460px] rounded-2xl bg-white border border-[#EDE8E3] animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl bg-white border border-[#EDE8E3] p-12 text-center space-y-4">
                <div className="size-16 rounded-full bg-[#FAF7F2] text-[#B88A44] flex items-center justify-center mx-auto">
                  <HelpCircle className="size-8" />
                </div>
                <h3 className="font-alexandria text-lg font-bold text-[#151211]">
                  لم يتم العثور على منتجات مطابقة للبحث
                </h3>
                <p className="text-[13px] text-[#78716C] max-w-sm mx-auto">
                  جربي تغيير خيارات التصفية أو مسح معايير البحث لعرض المزيد من المنتجات.
                </p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#151211] text-white hover:bg-[#B88A44] text-[12px] font-bold transition-colors cursor-pointer"
                >
                  إعادة ضبط التصفية
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="catalog"
                  />
                ))}
              </div>
            )}

            {/* 4. Pagination & Load More */}
            {products.length > 0 && (
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EDE8E3]">
                {/* Page Numbers */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => onPageChange(page)}
                      className={`size-9 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-[#151211] text-white shadow-xs"
                          : "bg-white border border-[#EDE8E3] text-[#554F49] hover:border-[#B88A44] hover:text-[#B88A44]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <span className="px-2 text-[#A8A19B]">...</span>
                  <button
                    type="button"
                    onClick={() => onPageChange(8)}
                    className={`size-9 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                      currentPage === 8
                        ? "bg-[#151211] text-white"
                        : "bg-white border border-[#EDE8E3] text-[#554F49] hover:border-[#B88A44]"
                    }`}
                  >
                    8
                  </button>
                </div>

                {/* Load More Button */}
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#B88A44]/50 text-[#8C6426] hover:bg-[#FAF7F2] font-semibold text-[13px] transition-all cursor-pointer shadow-xs"
                >
                  <span>عرض المزيد من السيرومات</span>
                  <ChevronDown className="size-4" />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* 5. Beauty Consultation Advisory Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-[#171615] text-white p-8 sm:p-10 border border-[#262422]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl text-right">
              <h3 className="font-alexandria text-xl sm:text-2xl font-bold text-white">
                هل تحتارين في اختيار السيروم المثالي لبشرتك؟
              </h3>
              <p className="text-[13px] text-[#A8A19B] leading-relaxed">
                تواصلي مباشرة مع خبيرات العناية بالبشرة لدى دار شيورا للحصول على استشارة تشخيصية مخصصة مجاناً عبر واتساب.
              </p>
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

              <button
                type="button"
                className="h-11 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-[13px] transition-all cursor-pointer"
              >
                اختبار البشرة السريع
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
