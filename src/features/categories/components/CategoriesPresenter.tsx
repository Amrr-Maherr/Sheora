import type { Category } from "@/types";

const EmptyState = () => <p>No categories found.</p>;

const LoadingState = () => <p>Loading categories...</p>;

const ErrorState = () => <p>Failed to load categories.</p>;

type CategoriesPresenterProps = {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
}

export function CategoriesPresenter({
  categories,
  isLoading,
  isError,
}: CategoriesPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (categories.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Categories List</h2>
      <p>{categories.length} categories</p>
    </div>
  );
}