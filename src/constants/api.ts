export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const laravelApiBaseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim();

if (!laravelApiBaseUrl && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_LARAVEL_API_BASE_URL is required for production builds.",
  );
}

export const LARAVEL_API_BASE_URL =
  laravelApiBaseUrl?.replace(/\/+$/, "") || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
  products: "/products",
  categories: "/categories",
  brands: "/brands",
  users: "/users",
  orders: "/orders",
  cart: "/cart",
  wishlist: "/wishlist",
  reviews: "/reviews",
  questions: "/questions",
  addresses: "/addresses",
  coupons: "/coupons",
} as const;