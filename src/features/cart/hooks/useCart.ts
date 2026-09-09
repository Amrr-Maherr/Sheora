import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { cartApi } from "../api";

export function useCart(userId: string) {
  return useQuery({
    queryKey: queryKeys.cart.detail(userId),
    queryFn: () => cartApi.getCart(userId),
    enabled: Boolean(userId),
  });
}