import type { Wishlist } from "@/types";

const EmptyState = () => <p>Your wishlist is empty.</p>;

const LoadingState = () => <p>Loading wishlist...</p>;

const ErrorState = () => <p>Failed to load wishlist.</p>;

type WishlistPresenterProps = {
  wishlist?: Wishlist;
  isLoading: boolean;
  isError: boolean;
}

export function WishlistPresenter({
  wishlist,
  isLoading,
  isError,
}: WishlistPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!wishlist || wishlist.items.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Wishlist</h2>
      <p>{wishlist.items.length} items</p>
    </div>
  );
}