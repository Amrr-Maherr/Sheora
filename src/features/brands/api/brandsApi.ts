import { laravelApiClient } from "@/services/api";
import type { Brand } from "@/types";

export type LaravelBrand = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
  country?: string | null;
  founded?: number | null;
  is_featured: boolean;
  product_count?: number;
};

export function mapBrand(brand: LaravelBrand): Brand {
  return {
    id: String(brand.id),
    name: brand.name,
    slug: brand.slug,
    description: brand.description ?? "",
    logo: brand.logo_url ?? "",
    image: brand.image_url ?? brand.logo_url ?? "",
    country: brand.country ?? "",
    founded: brand.founded ?? 0,
    featured: brand.is_featured,
    productCount: brand.product_count ?? 0,
  };
}

async function getBrandsPage(perPage = 50): Promise<Brand[]> {
  const response = await laravelApiClient.getCollection<LaravelBrand>(
    "/brands",
    { params: { per_page: perPage } },
  );

  return response.data.map(mapBrand);
}

export const brandsApi = {
  getBrands: (): Promise<Brand[]> => getBrandsPage(50),

  getHomeBrands: (): Promise<Brand[]> => getBrandsPage(6),

  getBrandBySlug: async (slug: string): Promise<Brand> => {
    const brand = await laravelApiClient.get<LaravelBrand>(
      `/brands/${encodeURIComponent(slug)}`,
    );

    return mapBrand(brand);
  },
};
