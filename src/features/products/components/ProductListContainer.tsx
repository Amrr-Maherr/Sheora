"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "../hooks";
import { ProductListPresenter } from "./ProductListPresenter";
import type { FilterState } from "./ProductFilters";

export function ProductListContainer() {
  const searchParams = useSearchParams();
  const searchParamQuery = searchParams.get("q") ?? "";

  const { data: allProducts = [], isLoading, isError } = useProducts();

  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    minPrice: 100,
    maxPrice: 2000,
    selectedIngredient: null,
    selectedSkinType: null,
    minRating: null,
    onlyDeals: false,
    freeSamples: false,
  });

  const [sortOption, setSortOption] = useState<string>("popularity");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleResetFilters = () => {
    setFilters({
      selectedBrands: [],
      minPrice: 100,
      maxPrice: 2000,
      selectedIngredient: null,
      selectedSkinType: null,
      minRating: null,
      onlyDeals: false,
      freeSamples: false,
    });
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search query
    if (searchParamQuery) {
      const q = searchParamQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
      );
    }

    // Price range
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Deals filter
    if (filters.onlyDeals) {
      result = result.filter((p) => (p.oldPrice && p.oldPrice > p.price) || (p.discount && p.discount > 0));
    }

    // Rating filter
    if (filters.minRating) {
      result = result.filter((p) => (p.rating ?? 4.5) >= (filters.minRating ?? 0));
    }

    // Sort order
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else {
      // Popularity / default
      result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }

    return result;
  }, [allProducts, filters, sortOption, searchParamQuery]);

  return (
    <ProductListPresenter
      products={filteredProducts}
      totalCount={allProducts.length}
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={handleResetFilters}
      sortOption={sortOption}
      onSortChange={setSortOption}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
      isError={isError}
    />
  );
}