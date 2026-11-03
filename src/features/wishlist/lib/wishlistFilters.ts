import type { Product } from "@/types";
import { getDefaultVariant } from "./wishlistProduct";

export type WishlistCategory = "all" | "perfume" | "makeup" | "skincare";
export type WishlistSort = "featured" | "price_asc" | "price_desc" | "rating";

export const WISHLIST_CATEGORIES: { value: WishlistCategory; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "perfume", label: "عطور" },
  { value: "makeup", label: "مكياج" },
  { value: "skincare", label: "عناية" },
];

export const WISHLIST_SORT_OPTIONS: { value: WishlistSort; label: string }[] = [
  { value: "featured", label: "المميزة أولاً" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
  { value: "rating", label: "الأعلى تقييماً" },
];

function getProductPrice(product: Product): number {
  return (
    getDefaultVariant(product)?.price ??
    product.priceFrom ??
    product.price ??
    0
  );
}

function matchesCategory(product: Product, category: WishlistCategory): boolean {
  if (category === "all") {
    return true;
  }

  const slug = product.categorySlug ?? "";

  if (category === "perfume") {
    return (
      slug === "perfumes" ||
      slug === "perfume" ||
      Boolean(product.concentration)
    );
  }

  if (category === "makeup") {
    return slug === "makeup";
  }

  return slug === "skincare";
}

function featuredScore(product: Product): number {
  return (
    (product.featured ? 3 : 0) +
    (product.bestSeller ? 2 : 0) +
    (product.newArrival ? 1 : 0)
  );
}

export function filterAndSortWishlistProducts(
  products: Product[],
  category: WishlistCategory,
  sort: WishlistSort,
): Product[] {
  const filtered = products.filter((product) =>
    matchesCategory(product, category),
  );

  return [...filtered].sort((a, b) => {
    if (sort === "price_asc") {
      return getProductPrice(a) - getProductPrice(b);
    }

    if (sort === "price_desc") {
      return getProductPrice(b) - getProductPrice(a);
    }

    if (sort === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }

    return (
      featuredScore(b) - featuredScore(a) ||
      (b.rating ?? 0) - (a.rating ?? 0)
    );
  });
}
