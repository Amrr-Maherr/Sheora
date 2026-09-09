import type { Product } from "@/types";

const EmptyState = () => <p>Product not found.</p>;

const LoadingState = () => <p>Loading product...</p>;

const ErrorState = () => <p>Failed to load product.</p>;

type ProductDetailPresenterProps = {
  product?: Product;
  isLoading: boolean;
  isError: boolean;
}

export function ProductDetailPresenter({
  product,
  isLoading,
  isError,
}: ProductDetailPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!product) return <EmptyState />;

  return (
    <div>
      <h2>Product Detail</h2>
      <p>{product.title}</p>
    </div>
  );
}