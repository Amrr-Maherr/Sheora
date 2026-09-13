"use client";

import { useProducts } from "@/features/products/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useBrands } from "@/features/brands/hooks";
import { useAllReviews } from "@/features/reviews/hooks/useReviews";
import { HomePagePresenter } from "./HomePagePresenter";

export function HomePageContainer() {
  const { data: products = [], isLoading, isError } = useProducts();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const {
    data: brands = [],
    isLoading: brandsLoading,
    isError: brandsError,
  } = useBrands();
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useAllReviews();

  return (
    <HomePagePresenter
      products={products}
      isLoading={isLoading}
      isError={isError}
      categories={categories}
      categoriesLoading={categoriesLoading}
      categoriesError={categoriesError}
      brands={brands}
      brandsLoading={brandsLoading}
      brandsError={brandsError}
      reviews={reviews}
      reviewsLoading={reviewsLoading}
      reviewsError={reviewsError}
    />
  );
}