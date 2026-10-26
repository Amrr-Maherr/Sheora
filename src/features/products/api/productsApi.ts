import { laravelApiClient } from "@/services/api";
import type {
  LaravelCollection,
  LaravelPaginationMeta,
} from "@/services/api";
import type { Product } from "@/types";
import { mapLaravelProduct, type LaravelProduct } from "./productMapper";

export type CatalogSort =
  | "featured"
  | "name"
  | "price_asc"
  | "price_desc"
  | "newest";

export type CatalogProductFilters = {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  excludeSlug?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  onSale?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sort?: CatalogSort;
  page?: number;
  perPage?: number;
};

export type CatalogPriceRange = {
  min: number;
  max: number;
};

export type CatalogProductPage = {
  products: Product[];
  meta: LaravelPaginationMeta;
  priceRange: CatalogPriceRange | null;
};

type LaravelProductCollection = LaravelCollection<LaravelProduct> & {
  price_range?: CatalogPriceRange;
};

function toQueryParams(
  filters: CatalogProductFilters,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    per_page: filters.perPage ?? 24,
  };

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }
  if (filters.categorySlug) {
    params.category_slug = filters.categorySlug;
  }
  if (filters.brandSlug) {
    params.brand_slug = filters.brandSlug;
  }
  if (filters.excludeSlug) {
    params.exclude_slug = filters.excludeSlug;
  }
  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    params.min_price = filters.minPrice;
  }
  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    params.max_price = filters.maxPrice;
  }
  if (filters.minRating !== null && filters.minRating !== undefined) {
    params.min_rating = filters.minRating;
  }
  if (filters.onSale) {
    params["filter[on_sale]"] = 1;
  }
  if (filters.featured) {
    params["filter[featured]"] = 1;
  }
  if (filters.bestSeller) {
    params["filter[best_seller]"] = 1;
  }
  if (filters.newArrival) {
    params["filter[new_arrival]"] = 1;
  }
  if (filters.sort) {
    params.sort = filters.sort;
  }
  if (filters.page && filters.page > 1) {
    params.page = filters.page;
  }

  return params;
}

async function getCatalogProducts(
  filters: CatalogProductFilters = {},
): Promise<CatalogProductPage> {
  const response = await laravelApiClient.getCollection<LaravelProduct>(
    "/products",
    { params: toQueryParams(filters) },
  );

  const collection = response as LaravelProductCollection;

  return {
    products: collection.data.map(mapLaravelProduct),
    meta: collection.meta,
    priceRange: collection.price_range ?? null,
  };
}

async function getProductByPath(path: string): Promise<Product> {
  const product = await laravelApiClient.get<LaravelProduct>(path);

  return mapLaravelProduct(product);
}

export const productsApi = {
  getCatalogProducts,

  getProducts: async (perPage = 48): Promise<Product[]> =>
    (await getCatalogProducts({ perPage })).products,

  getBestSellers: async (perPage = 4): Promise<Product[]> =>
    (await getCatalogProducts({ bestSeller: true, perPage })).products,

  getSpotlightProduct: async (): Promise<Product | null> =>
    (await getCatalogProducts({ featured: true, perPage: 1 })).products[0] ??
    null,

  getLaravelProducts: async (perPage = 48): Promise<Product[]> =>
    (await getCatalogProducts({ perPage })).products,

  getLaravelProductBySlug: (slug: string): Promise<Product> =>
    getProductByPath(`/products/${encodeURIComponent(slug)}`),

  getLaravelProductById: (id: string): Promise<Product> =>
    getProductByPath(`/products/${encodeURIComponent(id)}`),

  getRelatedProducts: async (options: {
    categorySlug?: string | null;
    brandSlug?: string | null;
    excludeSlug?: string | null;
    perPage?: number;
  }): Promise<Product[]> => {
    const filters: CatalogProductFilters = {
      categorySlug: options.categorySlug ?? undefined,
      brandSlug: options.categorySlug ? undefined : options.brandSlug ?? undefined,
      excludeSlug: options.excludeSlug ?? undefined,
      perPage: options.perPage ?? 4,
    };

    return (await getCatalogProducts(filters)).products;
  },
};
