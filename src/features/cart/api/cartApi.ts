import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Cart } from "@/types";

export const cartApi = {
  getCart: (userId: string) =>
    apiClient.get<Cart[]>(`${API_ENDPOINTS.cart}?userId=${userId}`),
};