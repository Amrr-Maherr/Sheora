import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Product } from "@/types";

export const productsApi = {
  getProducts: () => apiClient.get<Product[]>(API_ENDPOINTS.products),

  getProductsByCategory: (categoryId: string) =>
    apiClient.get<Product[]>(
      `${API_ENDPOINTS.products}?categoryIds_like=${categoryId}`,
    ),

  getProductsByBrand: (brandId: string) =>
    apiClient.get<Product[]>(`${API_ENDPOINTS.products}?brandId=${brandId}`),

  searchProducts: (query: string) => {
    const q = query.trim();
    if (!q) return apiClient.get<Product[]>(API_ENDPOINTS.products);
    // JSON Server full-text search `q=` searches all fields (name, description, etc.)
    return apiClient.get<Product[]>(`${API_ENDPOINTS.products}?q=${encodeURIComponent(q)}`);
  },

  getProductById: (id: string) =>
    apiClient.get<Product>(`${API_ENDPOINTS.products}/${id}`),
};