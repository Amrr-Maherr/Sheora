"use client";

import { Suspense } from "react";
import { useCategoryBySlug } from "@/features/categories";
import { ProductListContainer } from "./ProductListContainer";

type CategoryProductsContainerProps = {
  slug: string;
};

export function CategoryProductsContainer({
  slug,
}: CategoryProductsContainerProps) {
  const { data: category } = useCategoryBySlug(slug);

  const hero = category
    ? {
        badge: `${category.productCount} منتج`,
        title: category.name,
        description: category.description,
        breadcrumbLabel: category.name,
        breadcrumbHref: `/categories/${category.slug}`,
      }
    : undefined;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1280px] px-4 py-12">
          <div className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
        </div>
      }
    >
      <ProductListContainer
        fixedCategorySlug={slug}
        basePath={`/categories/${slug}`}
        hero={hero}
      />
    </Suspense>
  );
}
