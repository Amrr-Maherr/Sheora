"use client";

import { useOrders } from "../hooks";
import { OrdersPresenter } from "./OrdersPresenter";

type OrdersContainerProps = {
  userId?: string;
}

export function OrdersContainer({ userId }: OrdersContainerProps) {
  const { data: orders = [], isLoading, isError } = useOrders(userId);

  return (
    <OrdersPresenter orders={orders} isLoading={isLoading} isError={isError} />
  );
}