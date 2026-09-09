import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Category } from "@/types";

export const categoriesApi = {
  getCategories: () => apiClient.get<Category[]>(API_ENDPOINTS.categories),

  getCategoryById: (id: string) =>
    apiClient.get<Category>(`${API_ENDPOINTS.categories}/${id}`),

  getCategoryBySlug: (slug: string) =>
    apiClient.get<Category[]>(`${API_ENDPOINTS.categories}?slug=${slug}`),
};