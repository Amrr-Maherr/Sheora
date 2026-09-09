"use client";

import { useSearchProducts } from "@/features/products";
import { SearchResultsPresenter } from "./SearchResultsPresenter";

type SearchResultsContainerProps = {
  query: string;
}

export function SearchResultsContainer({ query }: SearchResultsContainerProps) {
  const { data: products = [], isLoading, isError } = useSearchProducts(query);

  return (
    <SearchResultsPresenter
      query={query}
      products={products}
      isLoading={isLoading}
      isError={isError}
    />
  );
}