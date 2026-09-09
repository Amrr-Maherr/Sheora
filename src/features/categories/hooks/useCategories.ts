import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api";
import { queryKeys } from "@/constants";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: categoriesApi.getCategories,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled: Boolean(id),
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: [...queryKeys.categories.all, "slug", slug] as const,
    queryFn: () => categoriesApi.getCategoryBySlug(slug),
    select: (categories) => categories[0],
    enabled: Boolean(slug),
  });
}