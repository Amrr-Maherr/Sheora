import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { questionsApi } from "../api";

export function useQuestions(productId?: string) {
  return useQuery({
    queryKey: productId ? queryKeys.questions.list(productId) : queryKeys.questions.lists(),
    queryFn: () => questionsApi.getQuestions(productId),
    enabled: Boolean(productId),
  });
}
