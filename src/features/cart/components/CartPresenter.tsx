import type { Cart } from "@/types";

const EmptyState = () => <p>Your cart is empty.</p>;

const LoadingState = () => <p>Loading cart...</p>;

const ErrorState = () => <p>Failed to load cart.</p>;

type CartPresenterProps = {
  cart?: Cart;
  isLoading: boolean;
  isError: boolean;
}

export function CartPresenter({ cart, isLoading, isError }: CartPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!cart || cart.items.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>{cart.items.length} items</p>
    </div>
  );
}