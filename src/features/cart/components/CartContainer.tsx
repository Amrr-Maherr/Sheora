"use client";

import type { Cart } from "@/types";
import { useCart } from "../hooks";
import { CartPresenter } from "./CartPresenter";

export function CartContainer() {
  const { data: cartData, isLoading, isError } = useCart();

  return (
    <CartPresenter cart={cartData as unknown as Cart} isLoading={isLoading} isError={isError} />
  );
}
