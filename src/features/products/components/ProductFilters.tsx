"use client";

import { useState } from "react";
import { Search, RotateCcw, ChevronDown, Check, Star } from "lucide-react";

export type FilterState = {
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  selectedIngredient: string | null;
  selectedSkinType: string | null;
  minRating: number | null;
  onlyDeals: boolean;
  freeSamples: boolean;
};

type ProductFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
};

const brandsList = [
  { id: "sheora", name: "دار شِيورا (SHEORA)", count: 18 },
  { id: "the-ordinary", name: "The Ordinary", count: 14 },
  { id: "cerave", name: "CeraVe", count: 12 },
  { id: "la-roche", name: "La Roche-Posay", count: 9 },
  { id: "eucerin", name: "Eucerin", count: 7 },
];

const ingredients = [
  "حمض الهيالورونيك",
  "فيتامين C النقي",
  "النياسيناميد",
  "خلاصة الورد",
  "الذهب عيار 24",
];

const skinTypes = [
  { id: "all", label: "جميع أنواع البشرة" },
  { id: "sensitive-dry", label: "البشرة الحساسة والجافة" },
  { id: "combination-oily", label: "البشرة المختلطة والدهنية" },
];

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
}: ProductFiltersProps) {
  const [brandSearch, setBrandSearch] = useState("");

  const filteredBrands = brandsList.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleBrand = (id: string) => {
    const next = filters.selectedBrands.includes(id)
      ? filters.selectedBrands.filter((b) => b !== id)
      : [...filters.selectedBrands, id];
    onFilterChange({ ...filters, selectedBrands: next });
  };

  const toggleIngredient = (ing: string) => {
    const next = filters.selectedIngredient === ing ? null : ing;
    onFilterChange({ ...filters, selectedIngredient: next });
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-[#EDE8E3] p-5 sm:p-6 space-y-6">
      {/* Header: Title & Reset */}
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

      {/* 1. Brand Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>الماركة التجارية</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        {/* Brand Search Input */}
        <div className="relative">
          <input
            type="text"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            placeholder="ابحث عن ماركة..."
            className="w-full h-8 pr-8 pl-3 text-[12px] rounded-lg bg-[#FAF9F7] border border-[#E8E2DA] focus:outline-none focus:border-[#B88A44]"
          />
          <Search className="absolute right-2.5 top-2 size-3.5 text-[#8C827A]" />
        </div>

        {/* Brand Checkboxes */}
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {filteredBrands.map((b) => {
            const isChecked = filters.selectedBrands.includes(b.id);
            return (
              <label
                key={b.id}
                onClick={() => toggleBrand(b.id)}
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
                  <span>{b.name}</span>
                </div>
                <span className="text-[11px] text-[#A8A19B] font-mono">
                  {b.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#F0EBE5]" />

      {/* 2. Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>نطاق السعر (جنيه مصري)</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="flex items-center justify-between text-[12px] font-semibold text-[#151211] bg-[#FAF9F7] p-2.5 rounded-xl border border-[#EDE8E3]">
          <span className="px-2 py-1 bg-white rounded-md border border-[#E8E2DA]">
            {filters.minPrice} ج.م
          </span>
          <span className="text-[#A8A19B]">—</span>
          <span className="px-2 py-1 bg-white rounded-md border border-[#E8E2DA]">
            {filters.maxPrice} ج.م
          </span>
        </div>

        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={filters.maxPrice}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              maxPrice: Number(e.target.value),
            })
          }
          className="w-full accent-[#B88A44] cursor-pointer"
        />
      </div>

      <div className="h-px bg-[#F0EBE5]" />

      {/* 3. Active Ingredients */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>المكونات الفعالة</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ingredients.map((ing) => {
            const isSelected = filters.selectedIngredient === ing;
            return (
              <button
                key={ing}
                type="button"
                onClick={() => toggleIngredient(ing)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#151211] text-white"
                    : "bg-[#FAF7F2] text-[#6E6761] border border-[#EDE8E3] hover:border-[#B88A44]"
                }`}
              >
                {ing}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#F0EBE5]" />

      {/* 4. Skin Type */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>نوع البشرة</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="space-y-2">
          {skinTypes.map((st) => {
            const isSelected = filters.selectedSkinType === st.id;
            return (
              <label
                key={st.id}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    selectedSkinType: isSelected ? null : st.id,
                  })
                }
                className="flex items-center gap-2.5 text-[12px] text-[#4A4541] hover:text-[#151211] cursor-pointer"
              >
                <div
                  className={`size-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-[#B88A44] bg-[#B88A44]"
                      : "border-[#D5CFC9] bg-white"
                  }`}
                >
                  {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                </div>
                <span>{st.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#F0EBE5]" />

      {/* 5. Rating & Deals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-bold text-[#151211]">
          <span>التقييم والعروض</span>
          <ChevronDown className="size-4 text-[#8C827A]" />
        </div>

        <div className="space-y-2">
          {/* 4+ Stars */}
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
              {filters.minRating === 4 && <Check className="size-3 stroke-[3]" />}
            </div>
            <div className="flex items-center gap-1 text-[#B88A44]">
              <Star className="size-3.5 fill-[#B88A44]" />
              <span className="text-[#151211] font-medium">4 نجوم فما فوق</span>
            </div>
          </label>

          {/* Deals */}
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

          {/* Free Samples */}
          <label
            onClick={() =>
              onFilterChange({
                ...filters,
                freeSamples: !filters.freeSamples,
              })
            }
            className="flex items-center gap-2.5 text-[12px] text-[#4A4541] hover:text-[#151211] cursor-pointer"
          >
            <div
              className={`size-4 rounded-sm border flex items-center justify-center ${
                filters.freeSamples
                  ? "bg-[#151211] border-[#151211] text-white"
                  : "border-[#D5CFC9] bg-white"
              }`}
            >
              {filters.freeSamples && <Check className="size-3 stroke-[3]" />}
            </div>
            <span>هدايا وعينات فاخرة مجاناً</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
