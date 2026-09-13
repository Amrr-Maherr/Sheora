"use client";

import { useProduct, useProducts } from "../hooks";
import { ProductDetailPresenter } from "./ProductDetailPresenter";

type ProductDetailContainerProps = {
  productId: string;
};

export function ProductDetailContainer({
  productId,
}: ProductDetailContainerProps) {
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: allProducts = [] } = useProducts();

  // Prefer explicit relatedProductIds from product data, fallback to category similarity
  const relatedFromIds = product?.relatedProductIds
    ? allProducts.filter((p) => product.relatedProductIds.includes(p.id))
    : [];

  const fallbackRelated = allProducts
    .filter(
      (p) =>
        p.id !== productId &&
        (p.categoryIds?.some((id) => product?.categoryIds?.includes(id)) ||
          p.brandId === product?.brandId)
    )
    .slice(0, 4);

  const relatedProducts =
    relatedFromIds.length > 0 ? relatedFromIds.slice(0, 4) : fallbackRelated;

  const frequentlyBought = product?.frequentlyBoughtTogether
    ? allProducts.filter((p) => product.frequentlyBoughtTogether.includes(p.id))
    : [];

  return (
    <ProductDetailPresenter
      product={product}
      relatedProducts={relatedProducts}
      frequentlyBoughtTogether={frequentlyBought}
      isLoading={isLoading}
      isError={isError}
    />
  );
}