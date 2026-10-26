import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "../api";
import { queryKeys } from "@/constants";

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands.lists(),
    queryFn: brandsApi.getBrands,
  });
}

export function useHomeBrands() {
  return useQuery({
    queryKey: queryKeys.brands.home(),
    queryFn: brandsApi.getHomeBrands,
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: [...queryKeys.brands.all, "slug", slug] as const,
    queryFn: () => brandsApi.getBrandBySlug(slug),
    enabled: Boolean(slug),
  });
}
