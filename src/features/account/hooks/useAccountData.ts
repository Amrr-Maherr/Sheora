import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { accountApi } from "../api";

export function useAccountAddresses(userId: string) {
  return useQuery({
    queryKey: queryKeys.addresses.list(userId),
    queryFn: () => accountApi.getAddresses(userId),
    enabled: Boolean(userId),
  });
}

export function useAccountCoupons() {
  return useQuery({
    queryKey: queryKeys.coupons.lists(),
    queryFn: accountApi.getActiveCoupons,
  });
}
