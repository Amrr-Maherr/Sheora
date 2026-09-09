"use client";

import { useCart } from "../hooks";
import { CartPresenter } from "./CartPresenter";

type CartContainerProps = {
  userId: string;
}

export function CartContainer({ userId }: CartContainerProps) {
  const { data: carts = [], isLoading, isError } = useCart(userId);
  const cart = carts[0];

  return (
    <CartPresenter cart={cart} isLoading={isLoading} isError={isError} />
  );
}