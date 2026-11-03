import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Wishlist } from "@/types";
import { fetchWishlistProducts } from "../lib/wishlistProduct";

export const wishlistApi = {
  getWishlist: (userId: string) =>
    apiClient.get<Wishlist[]>(`${API_ENDPOINTS.wishlist}?userId=${userId}`),

  getProductsByIds: fetchWishlistProducts,

  updateWishlist: (wishlistId: string, productIds: string[]) =>
    apiClient.patch<Wishlist>(`${API_ENDPOINTS.wishlist}/${wishlistId}`, {
      productIds,
    }),
};
