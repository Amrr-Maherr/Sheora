import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api";
import { queryKeys } from "@/constants";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: categoriesApi.getCategories,
  });
}

export function useHomeCategories() {
  return useQuery({
    queryKey: queryKeys.categories.home(),
    queryFn: categoriesApi.getHomeCategories,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: [...queryKeys.categories.all, "slug", slug] as const,
    queryFn: () => categoriesApi.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}
