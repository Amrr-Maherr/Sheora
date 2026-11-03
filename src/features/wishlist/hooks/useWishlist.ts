import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { wishlistApi } from "../api";

export function useWishlist(userId: string) {
  return useQuery({
    queryKey: queryKeys.wishlist.detail(userId),
    queryFn: () => wishlistApi.getWishlist(userId),
    enabled: Boolean(userId),
  });
}

export function useWishlistProducts(productIds: string[]) {
  return useQuery({
    queryKey: queryKeys.wishlist.products(productIds),
    queryFn: () => wishlistApi.getProductsByIds(productIds),
    enabled: productIds.length > 0,
  });
}

type RemoveWishlistProductArgs = {
  wishlistId: string;
  productId: string;
  productIds: string[];
};

export function useRemoveWishlistProduct(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wishlistId, productIds }: RemoveWishlistProductArgs) =>
      wishlistApi.updateWishlist(wishlistId, productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlist.detail(userId),
      });
    },
  });
}
