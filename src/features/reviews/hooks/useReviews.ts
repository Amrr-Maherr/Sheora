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

export function useAllReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.lists(),
    queryFn: () => reviewsApi.getReviews(),
  });
}

export function useHomeReviews(perPage = 3) {
  return useQuery({
    queryKey: queryKeys.reviews.home(),
    queryFn: () => reviewsApi.getHomeReviews(perPage),
  });
}