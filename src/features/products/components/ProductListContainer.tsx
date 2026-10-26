"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBrands } from "@/features/brands/hooks";
import { useCatalogProducts } from "../hooks";
import { ProductListPresenter } from "./ProductListPresenter";
import type { FilterState } from "./ProductFilters";
import type { CatalogSort } from "../api";

const validSorts: CatalogSort[] = [
  "featured",
  "name",
  "price_asc",
  "price_desc",
  "newest",
];

function parseSort(value: string | null): CatalogSort {
  return validSorts.includes(value as CatalogSort)
    ? (value as CatalogSort)
    : "featured";
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

type ProductListHero = {
  badge?: string;
  title?: string;
  description?: string;
  breadcrumbLabel?: string;
  breadcrumbHref?: string;
};

type ProductListContainerProps = {
  fixedCategorySlug?: string;
  fixedBrandSlug?: string;
  basePath?: string;
  hero?: ProductListHero;
  showBrands?: boolean;
};

export function ProductListContainer({
  fixedCategorySlug,
  fixedBrandSlug,
  basePath = "/products",
  hero,
  showBrands = true,
}: ProductListContainerProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlug =
    fixedCategorySlug ??
    searchParams.get("category") ??
    searchParams.get("category_slug") ??
    undefined;
  const search = searchParams.get("q") ?? searchParams.get("search") ?? undefined;
  const brandSlug =
    fixedBrandSlug ?? searchParams.get("brand_slug") ?? undefined;
  const sort = parseSort(searchParams.get("sort"));
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const minRatingParam = Number(searchParams.get("min_rating"));
  const minRating =
    Number.isFinite(minRatingParam) && minRatingParam > 0
      ? minRatingParam
      : null;
  const onlyDeals =
    searchParams.get("on_sale") === "true" ||
    searchParams.get("on_sale") === "1" ||
    searchParams.get("deals") === "true";
  const maxPriceParam = Number(searchParams.get("max_price"));
  const hasMaxPrice = Number.isFinite(maxPriceParam) && maxPriceParam > 0;

  const { data: brands = [] } = useBrands();
  const { data, isLoading, isError } = useCatalogProducts({
    search,
    categorySlug,
    brandSlug,
    minRating,
    onSale: onlyDeals,
    sort,
    page,
    perPage: 12,
  });

  const priceMin = data?.priceRange?.min ?? 0;
  const priceMax = data?.priceRange?.max ?? 0;
  const filters: FilterState = {
    selectedBrands: fixedBrandSlug ? [] : brandSlug ? [brandSlug] : [],
    minPrice: priceMin,
    maxPrice: hasMaxPrice ? maxPriceParam : priceMax,
    minRating,
    onlyDeals,
  };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }

      const query = next.toString();
      router.replace(query ? `${basePath}?${query}` : basePath, {
        scroll: false,
      });
    },
    [basePath, router, searchParams],
  );

  const handleFilterChange = (next: FilterState) => {
    const nextBrand = fixedBrandSlug
      ? fixedBrandSlug
      : next.selectedBrands[0] ?? null;

    updateParams({
      brand_slug: nextBrand,
      min_rating: next.minRating === null ? null : String(next.minRating),
      on_sale: next.onlyDeals ? "true" : null,
      deals: null,
      max_price:
        priceMax > 0 && next.maxPrice < priceMax
          ? String(next.maxPrice)
          : null,
      page: null,
    });
  };

  const handleResetFilters = () => {
    updateParams({
      brand_slug: fixedBrandSlug ?? null,
      min_rating: null,
      on_sale: null,
      deals: null,
      min_price: null,
      max_price: null,
      page: null,
    });
  };

  const handleSortChange = (nextSort: string) => {
    updateParams({
      sort: nextSort === "featured" ? null : nextSort,
      page: null,
    });
  };

  const handlePageChange = (nextPage: number) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : null });
  };

  return (
    <ProductListPresenter
      products={data?.products ?? []}
      brands={showBrands ? brands : []}
      totalCount={data?.meta.total ?? 0}
      totalPages={data?.meta.last_page ?? 1}
      priceMin={priceMin}
      priceMax={priceMax}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
      sortOption={sort}
      onSortChange={handleSortChange}
      currentPage={page}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      isError={isError}
      hero={hero}
    />
  );
}
