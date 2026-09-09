"use client";

import { useCategories } from "../hooks";
import { CategoriesPresenter } from "./CategoriesPresenter";

export function CategoriesContainer() {
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <CategoriesPresenter
      categories={categories}
      isLoading={isLoading}
      isError={isError}
    />
  );
}