"use client";

import { useLaravelProductBySlug, useRelatedProducts } from "../hooks";
import { ProductDetailPresenter } from "./ProductDetailPresenter";

type LaravelProductDetailContainerProps = {
  slug: string;
};

export function LaravelProductDetailContainer({
  slug,
}: LaravelProductDetailContainerProps) {
  const {
    data: product,
    isLoading,
    isError,
  } = useLaravelProductBySlug(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(product);

  return (
    <ProductDetailPresenter
      product={product}
      relatedProducts={relatedProducts}
      frequentlyBoughtTogether={[]}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
