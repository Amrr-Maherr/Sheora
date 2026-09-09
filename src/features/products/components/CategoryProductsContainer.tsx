"use client";

import { useCategoryBySlug } from "@/features/categories";
import { useProductsByCategory } from "../hooks";
import { ProductListPresenter } from "./ProductListPresenter";

type CategoryProductsContainerProps = {
  slug: string;
}

export function CategoryProductsContainer({
  slug,
}: CategoryProductsContainerProps) {
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug);
  const categoryId = category?.id ?? "";

  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
  } = useProductsByCategory(categoryId);

  return (
    <ProductListPresenter
      products={products}
      isLoading={categoryLoading || productsLoading}
      isError={isError}
    />
  );
}