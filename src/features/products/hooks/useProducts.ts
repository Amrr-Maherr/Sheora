import { useQuery } from "@tanstack/react-query";
import { productsApi, type CatalogProductFilters } from "../api";
import { queryKeys } from "@/constants";
import type { Product } from "@/types";

export function useCatalogProducts(filters: CatalogProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsApi.getCatalogProducts(filters),
  });
}

export function useProducts(perPage = 48) {
  return useQuery({
    queryKey: queryKeys.products.list({ perPage }),
    queryFn: () => productsApi.getProducts(perPage),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getLaravelProductById(id),
    enabled: Boolean(id),
  });
}

export function useProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categorySlug),
    queryFn: () =>
      productsApi.getCatalogProducts({ categorySlug, perPage: 48 }),
    select: (page) => page.products,
    enabled: Boolean(categorySlug),
  });
}

export function useProductsByBrand(brandSlug: string) {
  return useQuery({
    queryKey: queryKeys.products.byBrand(brandSlug),
    queryFn: () => productsApi.getCatalogProducts({ brandSlug, perPage: 48 }),
    select: (page) => page.products,
    enabled: Boolean(brandSlug),
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () =>
      productsApi.getCatalogProducts({ search: query, perPage: 48 }),
    select: (page) => page.products,
    enabled: query.trim().length > 0,
  });
}

export function useBestSellers(perPage = 4) {
  return useQuery({
    queryKey: queryKeys.products.bestSellers(perPage),
    queryFn: () => productsApi.getBestSellers(perPage),
  });
}

export function useSpotlightProduct() {
  return useQuery({
    queryKey: queryKeys.products.spotlight(),
    queryFn: productsApi.getSpotlightProduct,
  });
}

export function useLaravelProducts(perPage = 48) {
  return useQuery({
    queryKey: queryKeys.products.laravelList(perPage),
    queryFn: () => productsApi.getLaravelProducts(perPage),
  });
}

export function useLaravelProductBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.laravelDetail(slug),
    queryFn: () => productsApi.getLaravelProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(product?: Product) {
  return useQuery({
    queryKey: queryKeys.products.related(product?.slug ?? ""),
    queryFn: () =>
      productsApi.getRelatedProducts({
        categorySlug: product?.categorySlug,
        brandSlug: product?.brandSlug,
        excludeSlug: product?.slug,
        perPage: 4,
      }),
    enabled: Boolean(product?.slug),
  });
}
