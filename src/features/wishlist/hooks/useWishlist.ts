import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { wishlistApi } from "../api";

export function useWishlist(userId: string) {
  return useQuery({
    queryKey: queryKeys.wishlist.detail(userId),
    queryFn: () => wishlistApi.getWishlist(userId),
    enabled: Boolean(userId),
  });
}