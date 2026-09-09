export type QueryFilters = {
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating_desc" | "newest";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const DEFAULT_PAGE_SIZE = 12;