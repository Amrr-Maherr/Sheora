import type { Brand } from "@/types";

const EmptyState = () => <p>No brands found.</p>;

const LoadingState = () => <p>Loading brands...</p>;

const ErrorState = () => <p>Failed to load brands.</p>;

type BrandsPresenterProps = {
  brands: Brand[];
  isLoading: boolean;
  isError: boolean;
}

export function BrandsPresenter({
  brands,
  isLoading,
  isError,
}: BrandsPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (brands.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Brands List</h2>
      <p>{brands.length} brands</p>
    </div>
  );
}