import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Order } from "@/types";

export const ordersApi = {
  getOrders: (userId?: string) => {
    const path = userId
      ? `${API_ENDPOINTS.orders}?userId=${userId}`
      : API_ENDPOINTS.orders;
    return apiClient.get<Order[]>(path);
  },

  getOrderById: (id: string) =>
    apiClient.get<Order>(`${API_ENDPOINTS.orders}/${id}`),
};