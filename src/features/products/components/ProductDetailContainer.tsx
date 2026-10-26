"use client";

import { useProduct, useRelatedProducts } from "../hooks";
import { ProductDetailPresenter } from "./ProductDetailPresenter";

type ProductDetailContainerProps = {
  productId: string;
};

export function ProductDetailContainer({
  productId,
}: ProductDetailContainerProps) {
  const { data: product, isLoading, isError } = useProduct(productId);
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