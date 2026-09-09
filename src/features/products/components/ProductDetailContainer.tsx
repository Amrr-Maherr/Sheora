"use client";

import { useProduct } from "../hooks";
import { ProductDetailPresenter } from "./ProductDetailPresenter";

type ProductDetailContainerProps = {
  productId: string;
}

export function ProductDetailContainer({
  productId,
}: ProductDetailContainerProps) {
  const { data: product, isLoading, isError } = useProduct(productId);

  return (
    <ProductDetailPresenter
      product={product}
      isLoading={isLoading}
      isError={isError}
    />
  );
}