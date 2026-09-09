import type { Product } from "@/types";

const EmptyState = () => <p>No results found.</p>;

const LoadingState = () => <p>Searching...</p>;

const ErrorState = () => <p>Search failed. Please try again.</p>;

type SearchResultsPresenterProps = {
  query: string;
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

export function SearchResultsPresenter({
  query,
  products,
  isLoading,
  isError,
}: SearchResultsPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <p>
        {products.length} results for &quot;{query}&quot;
      </p>
    </div>
  );
}