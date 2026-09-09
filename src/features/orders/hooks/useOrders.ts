import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { ordersApi } from "../api";

export function useOrders(userId?: string) {
  return useQuery({
    queryKey: userId ? queryKeys.orders.list(userId) : queryKeys.orders.lists(),
    queryFn: () => ordersApi.getOrders(userId),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: Boolean(id),
  });
}