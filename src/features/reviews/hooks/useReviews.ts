import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { reviewsApi } from "../api";

export function useReviews(productId?: string) {
  return useQuery({
    queryKey: productId
      ? queryKeys.reviews.list(productId)
      : queryKeys.reviews.lists(),
    queryFn: () => reviewsApi.getReviews(productId),
    enabled: Boolean(productId),
  });
}