"use client";

import { useState } from "react";
import { Search, RotateCcw, ChevronDown, Check, Star } from "lucide-react";
import type { Brand } from "@/types";

export type FilterState = {
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number | null;
  onlyDeals: boolean;
};

type ProductFiltersProps = {
  filters: FilterState;
  brands: Brand[];
  priceMin: number;
  priceMax: number;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
};

export function ProductFilters({
  filters,
  brands,
  priceMin,
  priceMax,
  onFilterChange,
  onReset,
}: ProductFiltersProps) {
  const [brandSearch, setBrandSearch] = useState("");

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.trim().toLowerCase()),
  );

  const toggleBrand = (slug: string) => {
    const next = filters.selectedBrands.includes(slug) ? [] : [slug];
    onFilterChange({ ...filters, selectedBrands: next });
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-[#EDE8E3] p-5 sm:p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE5]">
        <h3 className="font-alexandria text-base font-bold text-[#151211]">
          تصفية النتائج
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-[12px] text-[#B88A44] hover:text-[#8C6426] transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3" />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {brands.length > 0 && (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
              <span>الماركة التجارية</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="relative">
          <input
            type="text"
            value={brandSearch}
            onChange={(event) => setBrandSearch(event.target.value)}
            placeholder="ابحث عن ماركة..."
            className="w-full h-8 pr-8 pl-3 text-[12px] rounded-lg bg-[#FAF9F7] border border-[#E8E2DA] focus:outline-none focus:border-[#B88A44]"
          />
          <Search className="absolute right-2.5 top-2 size-3.5 text-[#8C827A]" />
        </div>

        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {filteredBrands.length === 0 ? (
            <p className="text-[12px] text-[#8C827A]">لا توجد ماركات متاحة.</p>
          ) : (
            filteredBrands.map((brand) => {
              const isChecked = filters.selectedBrands.includes(brand.slug);
              return (
                <label
                  key={brand.slug}
                  onClick={() => toggleBrand(brand.slug)}
                  className="flex items-center justify-between text-[12px] text-[#4A4541] hover:text-[#151211] cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`size-4 rounded-sm border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-[#151211] border-[#151211] text-white"
                          : "border-[#D5CFC9] bg-white"
                      }`}
                    >
                      {isChecked && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <span>{brand.name}</span>
                  </div>
                  <span className="text-[11px] text-[#A8A19B] font-mono">
                    {brand.productCount ?? 0}
                  </span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <div className="h-px bg-[#F0EBE5]" />
        </>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>نطاق السعر (جنيه مصري)</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="flex items-center justify-between text-[12px] font-semibold text-[#151211] bg-[#FAF9F7] p-2.5 rounded-xl border border-[#EDE8E3]">
          <span className="px-2 py-1 bg-white rounded-md border border-[#E8E2DA]">
            {priceMin} ج.م
          </span>
          <span className="text-[#A8A19B]">—</span>
          <span className="px-2 py-1 bg-white rounded-md border border-[#E8E2DA]">
            {filters.maxPrice} ج.م
          </span>
        </div>

        <input
          type="range"
          min={priceMin}
          max={priceMax}
          step={10}
          value={filters.maxPrice}
          disabled={priceMax <= priceMin}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              maxPrice: Number(event.target.value),
            })
          }
          className="w-full accent-[#B88A44] cursor-pointer disabled:cursor-not-allowed"
        />
      </div>

      <div className="h-px bg-[#F0EBE5]" />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>التقييم والعروض</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="space-y-2">
          <label
            onClick={() =>
              onFilterChange({
                ...filters,
                minRating: filters.minRating === 4 ? null : 4,
              })
            }
            className="flex items-center gap-2.5 text-[12px] text-[#4A4541] hover:text-[#151211] cursor-pointer"
          >
            <div
              className={`size-4 rounded-sm border flex items-center justify-center ${
                filters.minRating === 4
                  ? "bg-[#151211] border-[#151211] text-white"
                  : "border-[#D5CFC9] bg-white"
              }`}
            >
              {filters.minRating === 4 && (
                <Check className="size-3 stroke-[3]" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[#B88A44]">
              <Star className="size-3.5 fill-[#B88A44]" />
              <span className="text-[#151211] font-medium">
                4 نجوم فما فوق
              </span>
            </div>
          </label>

          <label
            onClick={() =>
              onFilterChange({
                ...filters,
                onlyDeals: !filters.onlyDeals,
              })
            }
            className="flex items-center gap-2.5 text-[12px] text-[#4A4541] hover:text-[#151211] cursor-pointer"
          >
            <div
              className={`size-4 rounded-sm border flex items-center justify-center ${
                filters.onlyDeals
                  ? "bg-[#151211] border-[#151211] text-white"
                  : "border-[#D5CFC9] bg-white"
              }`}
            >
              {filters.onlyDeals && <Check className="size-3 stroke-[3]" />}
            </div>
            <span>عروض حصرية وخصومات</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
