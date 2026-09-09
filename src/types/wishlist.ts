export type WishlistItem = {
  productId: string;
  addedAt: string;
}

export type Wishlist = {
  id: string;
  userId: string;
  items: WishlistItem[];
}
