"use client";

import { useProducts } from "../hooks";
import { ProductListPresenter } from "./ProductListPresenter";

export function ProductListContainer() {
  const { data: products = [], isLoading, isError } = useProducts();

  return (
    <ProductListPresenter
      products={products}
      isLoading={isLoading}
      isError={isError}
    />
  );
}