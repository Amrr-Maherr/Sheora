import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { Question } from "@/types";

export const questionsApi = {
  getQuestions: (productId?: string) => {
    const path = productId
      ? `${API_ENDPOINTS.questions}?productId=${productId}`
      : API_ENDPOINTS.questions;
    return apiClient.get<Question[]>(path);
  },
};
