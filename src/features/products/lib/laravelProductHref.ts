import type { Product } from "@/types";

export function laravelProductHref(product: Pick<Product, "slug">): string | null {
  const slug = product.slug?.trim();

  if (!slug) {
    return null;
  }

  return `/product/${encodeURIComponent(slug)}`;
}
