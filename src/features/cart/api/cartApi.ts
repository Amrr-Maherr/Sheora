import { laravelApiClient } from "@/services/api";
import type {
  BackendCartData,
  BackendGovernorate,
} from "../types";

export const cartApi = {
  getCart: () => laravelApiClient.get<BackendCartData>("/cart"),

  addItem: (productVariantId: number, quantity: number = 1) =>
    laravelApiClient.post<BackendCartData>("/cart/items", {
      product_variant_id: productVariantId,
      quantity,
    }),

  updateQuantity: (variantId: number, quantity: number) =>
    laravelApiClient.patch<BackendCartData>(`/cart/items/${variantId}`, {
      quantity,
    }),

  removeItem: (variantId: number) =>
    laravelApiClient.delete<BackendCartData>(`/cart/items/${variantId}`),

  clearCart: () => laravelApiClient.delete<BackendCartData>("/cart"),

  applyCoupon: (code: string) =>
    laravelApiClient.post<BackendCartData>("/cart/coupon", { code }),

  removeCoupon: () => laravelApiClient.delete<BackendCartData>("/cart/coupon"),

  updateGovernorate: (governorateSlug: string | null) =>
    laravelApiClient.patch<BackendCartData>("/cart/governorate", {
      governorate_slug: governorateSlug,
    }),

  mergeCart: (
    items: Array<{ product_variant_id: number; quantity: number }>,
  ) =>
    laravelApiClient.post<BackendCartData>("/cart/merge", {
      items,
    }),

  validateGuestCart: (
    items: Array<{ product_variant_id: number; quantity: number }>,
    couponCode?: string,
    governorateSlug?: string,
  ) =>
    laravelApiClient.post<BackendCartData>("/cart/validate", {
      items,
      coupon_code: couponCode || null,
      governorate_slug: governorateSlug || null,
    }),

  getGovernorates: () =>
    laravelApiClient.get<BackendGovernorate[]>("/governorates"),
};
