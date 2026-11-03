import { API_ENDPOINTS } from "@/constants";
import { apiClient } from "@/services/api";
import type { Address, Coupon } from "@/types";

export const accountApi = {
  getAddresses: (userId: string) =>
    apiClient.get<Address[]>(`${API_ENDPOINTS.addresses}?userId=${userId}`),

  getActiveCoupons: () =>
    apiClient.get<Coupon[]>(`${API_ENDPOINTS.coupons}?isActive=true`),
};
