export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export const API_ENDPOINTS = {
  products: "/products",
  categories: "/categories",
  brands: "/brands",
  users: "/users",
  orders: "/orders",
  cart: "/cart",
  wishlist: "/wishlist",
  reviews: "/reviews",
  addresses: "/addresses",
  coupons: "/coupons",
} as const;