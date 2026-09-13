"use client";

import { useBrandBySlug } from "@/features/brands";
import { useProductsByBrand } from "../hooks";
import { ProductListPresenter } from "./ProductListPresenter";

type BrandProductsContainerProps = {
  slug: string;
}

export function BrandProductsContainer({ slug }: BrandProductsContainerProps) {
  const { data: brandData, isLoading: brandLoading } = useBrandBySlug(slug);
  const brand = Array.isArray(brandData) ? brandData[0] : brandData;
  const brandId = brand?.id ?? "";

  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
  } = useProductsByBrand(brandId);

  const hero = brand
    ? {
        badge: `${brand.country} • منذ ${brand.founded}`,
        title: brand.name,
        description: brand.description,
        breadcrumbLabel: brand.name,
        breadcrumbHref: `/brands/${brand.slug}`,
      }
    : undefined;

  return (
    <ProductListPresenter
      products={products}
      isLoading={brandLoading || productsLoading}
      isError={isError}
      hero={hero}
    />
  );
}