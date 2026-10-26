"use client";

import { Suspense } from "react";
import { useBrandBySlug } from "@/features/brands";
import { ProductListContainer } from "./ProductListContainer";

type BrandProductsContainerProps = {
  slug: string;
};

export function BrandProductsContainer({ slug }: BrandProductsContainerProps) {
  const { data: brand } = useBrandBySlug(slug);

  const hero = brand
    ? {
        badge: `${brand.productCount ?? 0} منتج`,
        title: brand.name,
        description: brand.description,
        breadcrumbLabel: brand.name,
        breadcrumbHref: `/brands/${brand.slug}`,
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
        fixedBrandSlug={slug}
        basePath={`/brands/${slug}`}
        hero={hero}
        showBrands={false}
      />
    </Suspense>
  );
}
