export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  images: string[];
  categoryId: string;
  brandId: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
}
