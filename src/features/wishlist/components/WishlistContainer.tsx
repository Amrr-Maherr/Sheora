"use client";

import { useWishlist } from "../hooks";
import { WishlistPresenter } from "./WishlistPresenter";

type WishlistContainerProps = {
  userId: string;
}

export function WishlistContainer({ userId }: WishlistContainerProps) {
  const { data: wishlists = [], isLoading, isError } = useWishlist(userId);
  const wishlist = wishlists[0];

  return (
    <WishlistPresenter
      wishlist={wishlist}
      isLoading={isLoading}
      isError={isError}
    />
  );
}