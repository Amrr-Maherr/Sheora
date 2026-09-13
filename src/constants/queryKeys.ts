export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: unknown) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    byCategory: (categoryId: string) =>
      [...queryKeys.products.lists(), "category", categoryId] as const,
    byBrand: (brandId: string) =>
      [...queryKeys.products.lists(), "brand", brandId] as const,
    search: (query: string) => [...queryKeys.products.lists(), "search", query] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  brands: {
    all: ["brands"] as const,
    lists: () => [...queryKeys.brands.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.brands.lists(), filters] as const,
    details: () => [...queryKeys.brands.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.brands.details(), id] as const,
  },
  cart: {
    all: ["cart"] as const,
    detail: (userId: string) => [...queryKeys.cart.all, userId] as const,
  },
  wishlist: {
    all: ["wishlist"] as const,
    detail: (userId: string) => [...queryKeys.wishlist.all, userId] as const,
  },
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (userId: string) => [...queryKeys.orders.lists(), userId] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    list: (productId: string) => [...queryKeys.reviews.lists(), productId] as const,
  },
  questions: {
    all: ["questions"] as const,
    lists: () => [...queryKeys.questions.all, "list"] as const,
    list: (productId: string) => [...queryKeys.questions.lists(), productId] as const,
  },
  coupons: {
    all: ["coupons"] as const,
    lists: () => [...queryKeys.coupons.all, "list"] as const,
  },
  addresses: {
    all: ["addresses"] as const,
    lists: () => [...queryKeys.addresses.all, "list"] as const,
    list: (userId: string) => [...queryKeys.addresses.lists(), userId] as const,
  },
} as const;