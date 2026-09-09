"use client";

import { useBrandBySlug } from "@/features/brands";
import { useProductsByBrand } from "../hooks";
import { ProductListPresenter } from "./ProductListPresenter";

type BrandProductsContainerProps = {
  slug: string;
}

export function BrandProductsContainer({ slug }: BrandProductsContainerProps) {
  const { data: brand, isLoading: brandLoading } = useBrandBySlug(slug);
  const brandId = brand?.id ?? "";

  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
  } = useProductsByBrand(brandId);

  return (
    <ProductListPresenter
      products={products}
      isLoading={brandLoading || productsLoading}
      isError={isError}
    />
  );
}