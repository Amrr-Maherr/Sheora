export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  oldPrice: number;
  stock: number;
  sku: string;
};

export type ProductFragrance = {
  family: string;
  occasion: string[];
  season: string[];
  longevity: string;
  sillage: string;
};

export type ProductNotes = {
  top: string[];
  middle: string[];
  base: string[];
};

export type Product = {
  id: string;
  brandId: string;
  categoryIds: string[];
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number;
  currency: string;
  discount: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  sku: string;
  gender: "men" | "women" | "unisex";
  size: string;
  concentration: "Eau de Parfum" | "Eau de Toilette";
  variants: ProductVariant[];
  fragrance: ProductFragrance;
  notes: ProductNotes;
  features: string[];
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  badges: string[];
  relatedProductIds: string[];
  frequentlyBoughtTogether: string[];
  // legacy compatibility
  title?: string;
  compareAtPrice?: number;
  categoryId?: string;
  reviewCount?: number;
  isFeatured?: boolean;
  isActive?: boolean;
};
