"use client";

import { useBrands } from "@/features/brands";
import type { Brand } from "@/types";
import { useCategories, useCategoryBrands } from "../hooks";
import { CategoryMegaMenuPresenter } from "./CategoryMegaMenuPresenter";

type CategoryMegaMenuContainerProps = {
  activeLabel: string;
  categorySlug?: string | null;
  onClose: () => void;
};

export function CategoryMegaMenuContainer({
  activeLabel,
  categorySlug,
  onClose,
}: CategoryMegaMenuContainerProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allBrands = [] } = useBrands();

  const matchedCategory = categories.find(
    (category) => category.name === activeLabel,
  );
  const resolvedSlug = categorySlug ?? matchedCategory?.slug ?? null;

  const { data: categoryBrands = [], isLoading: brandsLoading } =
    useCategoryBrands(resolvedSlug);

  const brandsBySlug = new Map(allBrands.map((brand) => [brand.slug, brand]));
  const brands: Brand[] = categoryBrands.map((categoryBrand) => {
    const brand = brandsBySlug.get(categoryBrand.slug);

    return (
      brand ?? {
        id: categoryBrand.id,
        name: categoryBrand.name,
        slug: categoryBrand.slug,
        description: "",
        logo: "",
        image: "",
        country: "",
        founded: 0,
        featured: false,
        productCount: 0,
      }
    );
  });

  return (
    <CategoryMegaMenuPresenter
      activeLabel={activeLabel}
      categories={categories}
      brands={brands}
      isLoading={categoriesLoading}
      brandsLoading={brandsLoading}
      onClose={onClose}
    />
  );
}
