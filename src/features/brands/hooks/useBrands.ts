import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "../api";
import { queryKeys } from "@/constants";

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands.lists(),
    queryFn: brandsApi.getBrands,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => brandsApi.getBrandById(id),
    enabled: Boolean(id),
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: [...queryKeys.brands.all, "slug", slug] as const,
    queryFn: () => brandsApi.getBrandBySlug(slug),
    select: (brands) => brands[0],
    enabled: Boolean(slug),
  });
}