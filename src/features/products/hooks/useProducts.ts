import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api";
import { queryKeys } from "@/constants";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: productsApi.getProducts,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: Boolean(id),
  });
}

export function useProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId),
    queryFn: () => productsApi.getProductsByCategory(categoryId),
    enabled: Boolean(categoryId),
  });
}

export function useProductsByBrand(brandId: string) {
  return useQuery({
    queryKey: queryKeys.products.byBrand(brandId),
    queryFn: () => productsApi.getProductsByBrand(brandId),
    enabled: Boolean(brandId),
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productsApi.searchProducts(query),
    enabled: query.trim().length > 0,
  });
}