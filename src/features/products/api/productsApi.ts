import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Product } from "@/types";

export const productsApi = {
  getProducts: () => apiClient.get<Product[]>(API_ENDPOINTS.products),

  getProductsByCategory: (categoryId: string) =>
    apiClient.get<Product[]>(
      `${API_ENDPOINTS.products}?categoryId=${categoryId}`,
    ),

  getProductsByBrand: (brandId: string) =>
    apiClient.get<Product[]>(`${API_ENDPOINTS.products}?brandId=${brandId}`),

  searchProducts: (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("title_like", query.trim());
    }
    const queryString = params.toString();
    return apiClient.get<Product[]>(
      `${API_ENDPOINTS.products}${queryString ? `?${queryString}` : ""}`,
    );
  },

  getProductById: (id: string) =>
    apiClient.get<Product>(`${API_ENDPOINTS.products}/${id}`),
};