export type WishlistItem = {
  productId: string;
  addedAt: string;
};

export type Wishlist = {
  id: string;
  userId: string;
  productIds?: string[];
  items?: WishlistItem[];
};
