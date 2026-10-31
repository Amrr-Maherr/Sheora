import type {
  Product,
  ProductVariant,
} from "@/types";

export type LaravelProductImage = {
  id: number;
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
};

export type LaravelProductVariantAttribute = {
  attribute_id: number;
  attribute_code: string;
  attribute_name: string;
  option_id: number;
  label: string;
  value: string;
  swatch_hex?: string | null;
};

export type LaravelProductVariant = {
  id: number;
  sku: string;
  name?: string | null;
  size_ml?: number | null;
  concentration?: string | null;
  color_name?: string | null;
  color_hex?: string | null;
  image_url?: string | null;
  price: string;
  compare_at_price?: string | null;
  stock_quantity?: number;
  effective_max_quantity?: number;
  is_available: boolean;
  attributes?: LaravelProductVariantAttribute[];
  sort_order?: number;
};

export type LaravelProductCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: number | null;
  is_featured?: boolean;
  product_count?: number;
};

export type LaravelProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  details?: string | null;
  usage_instructions?: string | null;
  delivery_returns?: string | null;
  packaging_details?: string | null;
  brand_name?: string | null;
  brand_slug?: string | null;
  price_from: string | null;
  compare_at_price_from: string | null;
  rating: number | null;
  reviews_count: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  category?: LaravelProductCategory | null;
  images?: LaravelProductImage[];
  primary_image?: LaravelProductImage | null;
  variants?: LaravelProductVariant[];
  sort_order?: number;
  created_at?: string | null;
};

function toNumber(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function toGender(slug?: string): Product["gender"] {
  if (slug === "men" || slug === "women") {
    return slug;
  }

  return "unisex";
}

function toConcentration(value?: string | null): Product["concentration"] {
  return value === "edt" ? "Eau de Toilette" : "Eau de Parfum";
}

function mapVariant(variant: LaravelProductVariant): ProductVariant {
  const price = toNumber(variant.price) ?? 0;
  const compareAt = toNumber(variant.compare_at_price);
  const attributes = (variant.attributes ?? []).map((attribute) => ({
    attributeId: attribute.attribute_id,
    code: attribute.attribute_code,
    name: attribute.attribute_name,
    optionId: attribute.option_id,
    label: attribute.label,
    value: attribute.value,
    swatchHex: attribute.swatch_hex?.trim() || null,
  }));
  const sizeAttribute = attributes.find(
    (attribute) =>
      attribute.code.toLowerCase().includes("size") ||
      attribute.name.toLowerCase() === "size",
  );
  const colorAttribute = attributes.find(
    (attribute) =>
      attribute.code.toLowerCase().includes("color") ||
      attribute.name.toLowerCase() === "color",
  );
  const stock = variant.is_available
    ? Math.max(0, Math.floor(variant.stock_quantity ?? 0))
    : 0;
  const maxQuantity =
    variant.effective_max_quantity !== undefined
      ? Math.max(0, Math.floor(variant.effective_max_quantity))
      : stock;

  return {
    id: String(variant.id),
    size:
      sizeAttribute?.label ||
      (variant.size_ml ? `${variant.size_ml}ml` : variant.name ?? ""),
    price,
    oldPrice: compareAt ?? price,
    stock,
    maxQuantity,
    sku: variant.sku,
    colorName:
      variant.color_name?.trim() ||
      colorAttribute?.label ||
      null,
    colorHex:
      variant.color_hex?.trim() ||
      colorAttribute?.swatchHex ||
      null,
    imageUrl: variant.image_url?.trim() || null,
    attributes,
  };
}

export function mapLaravelProduct(product: LaravelProduct): Product {
  const price = toNumber(product.price_from);
  const compareAtPrice = toNumber(product.compare_at_price_from);
  const variants = (product.variants ?? []).map(mapVariant);
  const imageUrls = [
    product.primary_image?.image_url,
    ...(product.images ?? []).map((image) => image.image_url),
    ...variants.map((variant) => variant.imageUrl),
  ].filter((value): value is string => Boolean(value));
  const images = [...new Set(imageUrls)];
  const firstVariant = variants[0];
  const discount =
    price !== null && compareAtPrice !== null && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  return {
    id: String(product.id),
    brandId: product.brand_slug ?? "",
    categoryIds: product.category ? [String(product.category.id)] : [],
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.short_description ?? "",
    details: product.details ?? "",
    usageInstructions: product.usage_instructions ?? "",
    deliveryReturns: product.delivery_returns ?? "",
    packagingDetails: product.packaging_details ?? "",
    price: price ?? 0,
    oldPrice: compareAtPrice ?? price ?? 0,
    priceFrom: price,
    compareAtPriceFrom: compareAtPrice,
    currency: "EGP",
    discount,
    rating: typeof product.rating === "number" ? product.rating : null,
    reviewsCount: product.reviews_count ?? 0,
    stock: variants.filter((variant) => variant.stock > 0).length,
    sku: firstVariant?.sku ?? "",
    gender: toGender(product.category?.slug),
    size: firstVariant?.size ?? "",
    concentration: toConcentration(product.variants?.[0]?.concentration),
    variants,
    fragrance: {
      family: "",
      occasion: [],
      season: [],
      longevity: "",
      sillage: "",
    },
    notes: {
      top: [],
      middle: [],
      base: [],
    },
    features: [],
    images,
    featured: product.is_featured,
    bestSeller: product.is_best_seller,
    newArrival: product.is_new_arrival,
    badges: [],
    relatedProductIds: [],
    frequentlyBoughtTogether: [],
    brandName: product.brand_name ?? undefined,
    brandSlug: product.brand_slug ?? undefined,
    categoryId: product.category ? String(product.category.id) : undefined,
    categorySlug: product.category?.slug ?? undefined,
    compareAtPrice: compareAtPrice ?? undefined,
    isFeatured: product.is_featured,
    isActive: true,
  };
}
