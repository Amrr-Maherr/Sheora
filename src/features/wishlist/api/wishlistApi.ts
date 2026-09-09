import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Wishlist } from "@/types";

export const wishlistApi = {
  getWishlist: (userId: string) =>
    apiClient.get<Wishlist[]>(`${API_ENDPOINTS.wishlist}?userId=${userId}`),
};