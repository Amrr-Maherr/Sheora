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
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBySlug(slug);
  const category = Array.isArray(categoryData) ? categoryData[0] : categoryData;
  const categoryId = category?.id ?? "";

  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
  } = useProductsByCategory(categoryId);

  const hero = category
    ? {
        badge: `${category.productCount} منتج • ${category.slug}`,
        title: category.name,
        description: category.description,
        breadcrumbLabel: category.name,
        breadcrumbHref: `/categories/${category.slug}`,
      }
    : undefined;

  return (
    <ProductListPresenter
      products={products}
      isLoading={categoryLoading || productsLoading}
      isError={isError}
      hero={hero}
    />
  );
}