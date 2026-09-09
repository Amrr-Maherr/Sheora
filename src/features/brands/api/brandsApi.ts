import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Brand } from "@/types";

export const brandsApi = {
  getBrands: () => apiClient.get<Brand[]>(API_ENDPOINTS.brands),

  getBrandById: (id: string) =>
    apiClient.get<Brand>(`${API_ENDPOINTS.brands}/${id}`),

  getBrandBySlug: (slug: string) =>
    apiClient.get<Brand[]>(`${API_ENDPOINTS.brands}?slug=${slug}`),
};