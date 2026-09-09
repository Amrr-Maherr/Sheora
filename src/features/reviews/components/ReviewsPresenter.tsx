import type { Review } from "@/types";

const EmptyState = () => <p>No reviews yet.</p>;

const LoadingState = () => <p>Loading reviews...</p>;

const ErrorState = () => <p>Failed to load reviews.</p>;

type ReviewsPresenterProps = {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
}

export function ReviewsPresenter({
  reviews,
  isLoading,
  isError,
}: ReviewsPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (reviews.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Reviews</h2>
      <p>{reviews.length} reviews</p>
    </div>
  );
}