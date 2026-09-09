import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Review } from "@/types";

export const reviewsApi = {
  getReviews: (productId?: string) => {
    const path = productId
      ? `${API_ENDPOINTS.reviews}?productId=${productId}`
      : API_ENDPOINTS.reviews;
    return apiClient.get<Review[]>(path);
  },
};