import type { Order } from "@/types";

const EmptyState = () => <p>No orders found.</p>;

const LoadingState = () => <p>Loading orders...</p>;

const ErrorState = () => <p>Failed to load orders.</p>;

type OrdersPresenterProps = {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
}

export function OrdersPresenter({
  orders,
  isLoading,
  isError,
}: OrdersPresenterProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (orders.length === 0) return <EmptyState />;

  return (
    <div>
      <h2>Orders</h2>
      <p>{orders.length} orders</p>
    </div>
  );
}