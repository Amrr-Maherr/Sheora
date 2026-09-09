import type { Product } from "@/types";

const EmptyState = () => <p>No products found.</p>;

const LoadingState = () => <p>Loading products...</p>;

const ErrorState = () => <p>Failed to load products.</p>;

type ProductListPresenterProps = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

export function ProductListPresenter({
  products,
  isLoading,
  isError,
}: ProductListPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (products.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Products List</h2>
      <p>{products.length} products</p>
    </div>
  );
}