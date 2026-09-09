"use client";

import { useBrands } from "../hooks";
import { BrandsPresenter } from "./BrandsPresenter";

export function BrandsContainer() {
  const { data: brands = [], isLoading, isError } = useBrands();

  return (
    <BrandsPresenter brands={brands} isLoading={isLoading} isError={isError} />
  );
}