import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { cartApi } from "../api/cartApi";

export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: () => cartApi.getCart(),
  });
}
