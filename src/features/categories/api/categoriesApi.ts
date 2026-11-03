import { laravelApiClient } from "@/services/api";
import type { Category } from "@/types";
import { categoryImageFallback } from "../lib/categoryImage";

export type LaravelCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_featured: boolean;
  product_count: number;
};

export type CategoryBrand = {
  id: string;
  name: string;
  slug: string;
};

type LaravelCategoryFilters = {
  brands?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

export function mapCategory(category: LaravelCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image: category.image_url?.trim() || categoryImageFallback(category.slug),
    productCount: category.product_count ?? 0,
    featured: category.is_featured,
  };
}

async function getCategoriesPage(perPage = 50): Promise<Category[]> {
  const response = await laravelApiClient.getCollection<LaravelCategory>(
    "/categories",
    { params: { per_page: perPage } },
  );

  return response.data.map(mapCategory);
}

export const categoriesApi = {
  getCategories: (): Promise<Category[]> => getCategoriesPage(50),

  getHomeCategories: (): Promise<Category[]> => getCategoriesPage(15),

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const category = await laravelApiClient.get<LaravelCategory>(
      `/categories/${encodeURIComponent(slug)}`,
    );

    return mapCategory(category);
  },

  getCategoryBrands: async (slug: string): Promise<CategoryBrand[]> => {
    const filters = await laravelApiClient.get<LaravelCategoryFilters>(
      `/categories/${encodeURIComponent(slug)}/filters`,
    );

    return (filters.brands ?? []).map((brand) => ({
      id: String(brand.id),
      name: brand.name,
      slug: brand.slug,
    }));
  },
};
