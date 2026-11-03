import type { CartLineInput } from "@/features/cart/types";
import {
  categoryBadgeTone,
  categoryLabel,
} from "@/features/cart/lib/cartCatalog";
import { productsApi } from "@/features/products/api/productsApi";
import type { Product, ProductVariant, Wishlist } from "@/types";

export function normalizeWishlistProductId(productId: string): string {
  return productId.replace(/^product-/i, "");
}

export function getWishlistProductIds(wishlist?: Wishlist): string[] {
  if (!wishlist) {
    return [];
  }

  return wishlist.productIds ?? wishlist.items?.map((item) => item.productId) ?? [];
}

export function getDefaultVariant(product: Product): ProductVariant | null {
  return (
    product.variants?.find((variant) => variant.stock > 0) ??
    product.variants?.[0] ??
    null
  );
}

export function getProductImage(product: Product, variant?: ProductVariant | null) {
  return (
    variant?.imageUrl ??
    product.images?.find((image) => !image.includes("placehold.co")) ??
    "/images/figma/prod_bottle.png"
  );
}

export function buildWishlistCartLine(
  product: Product,
  variant: ProductVariant,
): CartLineInput | null {
  const variantId = Number(variant.id);

  if (!variantId || Number.isNaN(variantId)) {
    return null;
  }

  const name = product.name ?? product.title ?? "منتج SHEORA";
  const image = getProductImage(product, variant);
  const href = `/products/${product.slug || product.id}`;

  return {
    variantId,
    id: String(variantId),
    productId: product.id,
    productSlug: product.slug,
    name,
    variantName:
      [variant.colorName, variant.size].filter(Boolean).join(" - ") ||
      variant.sku,
    note:
      [product.shortDescription, variant.size].filter(Boolean).join(" - ") ||
      product.description.slice(0, 80),
    image,
    href,
    badge: categoryLabel(product.categorySlug),
    badgeTone: categoryBadgeTone(product.categorySlug),
    unitPrice: variant.price,
    compareAtPrice:
      variant.oldPrice > variant.price ? variant.oldPrice : undefined,
    stockAvailable: variant.stock,
    isAvailable: variant.stock > 0,
    swatch: variant.colorHex ?? undefined,
  };
}

export async function fetchWishlistProducts(
  productIds: string[],
): Promise<Product[]> {
  const results = await Promise.allSettled(
    productIds.map((productId) =>
      productsApi.getLaravelProductById(normalizeWishlistProductId(productId)),
    ),
  );

  return results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
}
