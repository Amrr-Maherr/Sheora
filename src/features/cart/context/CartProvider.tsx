"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CART_UPSELL,
  EMPTY_TOTALS,
  transformBackendCart,
} from "../lib/cartCatalog";
import { clampQuantity } from "../lib/format";
import {
  clearStoredGuestCart,
  getCartServerSnapshot,
  getCartSnapshot,
  readStoredGuestCart,
  setCartSnapshot,
  subscribeCart,
  syncStoredGuestQuantities,
  updateCartSnapshot,
  writeStoredGuestCart,
} from "../lib/cartStore";
import { formatCartWarnings } from "../lib/cartWarnings";
import {
  DEFAULT_MAX_ITEM_QUANTITY,
  DEFAULT_MAX_REQUEST_QUANTITY,
} from "../lib/format";
import { cartApi } from "../api/cartApi";
import { clearAuthToken, isAuthenticated } from "@/lib/authStorage";
import { ApiError } from "@/services/api";
import type {
  AppliedCoupon,
  CartLine,
  CartLineInput,
  CartTotals,
  CouponResult,
} from "../types";

type CartContextValue = {
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  governorateSlug: string | null;
  maxItemQuantity: number;
  isOpen: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  warnings: string[];
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
  addLine: (line: CartLineInput) => Promise<void>;
  addUpsell: () => void;
  removeLine: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<CouponResult>;
  removeCoupon: () => Promise<void>;
  setGovernorate: (slug: string | null) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  resetCartOnLogout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const setCartOpen = useCallback((open: boolean) => setIsOpen(open), []);

  const validateAndSyncGuestCart = useCallback(
    async (...args: Parameters<typeof cartApi.validateGuestCart>) => {
      const data = await cartApi.validateGuestCart(...args);
      syncStoredGuestQuantities(data);
      return data;
    },
    [],
  );

  /**
   * Authoritative sync from backend.
   */
  const refreshCart = useCallback(async () => {
    updateCartSnapshot({ isLoading: true, error: null });

    try {
      if (isAuthenticated()) {
        // Authenticated customer: check if guest items need merging first
        const guestData = readStoredGuestCart();
        if (guestData.items && guestData.items.length > 0) {
          const mergedData = await cartApi.mergeCart(guestData.items);
          clearStoredGuestCart();
          const transformed = transformBackendCart(mergedData);
          setCartSnapshot({
            ...transformed,
            governorateSlug: transformed.totals.governorate?.slug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(mergedData.warnings),
          });
          return;
        }

        const data = await cartApi.getCart();
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: transformed.totals.governorate?.slug ?? null,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: formatCartWarnings(data.warnings),
        });
      } else {
        // Guest user: validate items statelessly
        const guestData = readStoredGuestCart();
        if (guestData.items && guestData.items.length > 0) {
          const data = await validateAndSyncGuestCart(
            guestData.items,
            guestData.couponCode || undefined,
            guestData.governorateSlug || undefined,
          );
          const transformed = transformBackendCart(data);
          setCartSnapshot({
            ...transformed,
            governorateSlug: guestData.governorateSlug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(data.warnings),
          });
        } else {
          setCartSnapshot({
            lines: [],
            totals: EMPTY_TOTALS,
            maxItemQuantity: DEFAULT_MAX_ITEM_QUANTITY,
            maxRequestQuantity: DEFAULT_MAX_REQUEST_QUANTITY,
            coupon: null,
            governorateSlug: null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: [],
          });
        }
      }
    } catch (err: unknown) {
      if (isUnauthorizedError(err) && isAuthenticated()) {
        // The stored token is stale/revoked. Drop it and continue as a guest
        // so the cart keeps working instead of silently showing an empty cart.
        clearAuthToken();

        try {
          const guestData = readStoredGuestCart();
          if (guestData.items && guestData.items.length > 0) {
            const data = await validateAndSyncGuestCart(
              guestData.items,
              guestData.couponCode || undefined,
              guestData.governorateSlug || undefined,
            );
            const transformed = transformBackendCart(data);
            setCartSnapshot({
              ...transformed,
              governorateSlug: guestData.governorateSlug ?? null,
              isLoading: false,
              isUpdating: false,
              error: null,
              warnings: formatCartWarnings(data.warnings),
            });
          } else {
            setCartSnapshot({
              lines: [],
              totals: EMPTY_TOTALS,
              maxItemQuantity: DEFAULT_MAX_ITEM_QUANTITY,
              maxRequestQuantity: DEFAULT_MAX_REQUEST_QUANTITY,
              coupon: null,
              governorateSlug: guestData.governorateSlug ?? null,
              isLoading: false,
              isUpdating: false,
              error: null,
              warnings: [],
            });
          }
          return;
        } catch {
          // Fall through to the generic error state below.
        }
      }

      const message =
        err instanceof Error ? err.message : "تعذر تحميل حالة السلة، حاولي مرة أخرى";
      updateCartSnapshot({ isLoading: false, isUpdating: false, error: message });
    }
  }, [validateAndSyncGuestCart]);

  // Hydrate on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /**
   * Add item to cart
   */
  const addLine = useCallback(
    async (lineInput: CartLineInput) => {
      updateCartSnapshot({ isUpdating: true, error: null });

      const variantId =
        lineInput.variantId ||
        (lineInput.id && !isNaN(Number(lineInput.id))
          ? Number(lineInput.id)
          : null);

      if (!variantId) {
        updateCartSnapshot({
          isUpdating: false,
          error: "تعذر تحديد نوع المنتج المطلوب",
        });
        return;
      }

      const quantity = clampQuantity(lineInput.quantity ?? 1);

      try {
        if (isAuthenticated()) {
          try {
            const data = await cartApi.addItem(variantId, quantity);
            const transformed = transformBackendCart(data);
            setCartSnapshot({
              ...transformed,
              governorateSlug: transformed.totals.governorate?.slug ?? null,
              isLoading: false,
              isUpdating: false,
              error: null,
              warnings: formatCartWarnings(data.warnings),
            });
            setIsOpen(true);
            return;
          } catch (err: unknown) {
            if (!isUnauthorizedError(err)) {
              throw err;
            }

            // Expired/revoked session: ignore the stale token and add the item
            // to the local guest cart instead of failing silently.
            clearAuthToken();
          }
        }

        const guestData = readStoredGuestCart();
        const existingIndex = guestData.items.findIndex(
          (item) => item.product_variant_id === variantId,
        );

        if (existingIndex > -1) {
          guestData.items[existingIndex].quantity = clampQuantity(
            guestData.items[existingIndex].quantity + quantity,
          );
        } else {
          guestData.items.push({
            product_variant_id: variantId,
            quantity,
          });
        }

        writeStoredGuestCart(guestData);

        const data = await validateAndSyncGuestCart(
          guestData.items,
          guestData.couponCode || undefined,
          guestData.governorateSlug || undefined,
        );
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: guestData.governorateSlug ?? null,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: formatCartWarnings(data.warnings),
        });

        setIsOpen(true);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "تعذر إضافة المنتج إلى سلة المشتريات";
        updateCartSnapshot({ isUpdating: false, error: message });
        setIsOpen(true);
      }
    },
    [validateAndSyncGuestCart],
  );

  /**
   * Update quantity
   */
  const updateQuantity = useCallback(
    async (id: string, newQuantity: number) => {
      const variantId = Number(id);
      if (isNaN(variantId)) return;

      const qty = clampQuantity(newQuantity);
      updateCartSnapshot({ isUpdating: true, error: null });

      try {
        if (isAuthenticated()) {
          const data = await cartApi.updateQuantity(variantId, qty);
          const transformed = transformBackendCart(data);
          setCartSnapshot({
            ...transformed,
            governorateSlug: transformed.totals.governorate?.slug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(data.warnings),
          });
        } else {
          const guestData = readStoredGuestCart();
          const target = guestData.items.find(
            (item) => item.product_variant_id === variantId,
          );
          if (target) {
            target.quantity = qty;
            writeStoredGuestCart(guestData);
          }

          const data = await validateAndSyncGuestCart(
            guestData.items,
            guestData.couponCode || undefined,
            guestData.governorateSlug || undefined,
          );
          const transformed = transformBackendCart(data);
          setCartSnapshot({
            ...transformed,
            governorateSlug: guestData.governorateSlug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(data.warnings),
          });
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "خطأ أثناء تحديث الكمية";
        updateCartSnapshot({ isUpdating: false, error: message });
      }
    },
    [validateAndSyncGuestCart],
  );

  /**
   * Remove item
   */
  const removeLine = useCallback(
    async (id: string) => {
      const variantId = Number(id);
      if (isNaN(variantId)) return;

      updateCartSnapshot({ isUpdating: true, error: null });

      try {
        if (isAuthenticated()) {
          const data = await cartApi.removeItem(variantId);
          const transformed = transformBackendCart(data);
          setCartSnapshot({
            ...transformed,
            governorateSlug: transformed.totals.governorate?.slug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(data.warnings),
          });
        } else {
          const guestData = readStoredGuestCart();
          guestData.items = guestData.items.filter(
            (item) => item.product_variant_id !== variantId,
          );
          writeStoredGuestCart(guestData);

          if (guestData.items.length === 0) {
            setCartSnapshot({
              lines: [],
              totals: EMPTY_TOTALS,
              maxItemQuantity: DEFAULT_MAX_ITEM_QUANTITY,
              maxRequestQuantity: DEFAULT_MAX_REQUEST_QUANTITY,
              coupon: null,
              governorateSlug: guestData.governorateSlug ?? null,
              isLoading: false,
              isUpdating: false,
              error: null,
              warnings: [],
            });
            return;
          }

          const data = await validateAndSyncGuestCart(
            guestData.items,
            guestData.couponCode || undefined,
            guestData.governorateSlug || undefined,
          );
          const transformed = transformBackendCart(data);
          setCartSnapshot({
            ...transformed,
            governorateSlug: guestData.governorateSlug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(data.warnings),
          });
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "خطأ حذف المنتج";
        updateCartSnapshot({ isUpdating: false, error: message });
      }
    },
    [validateAndSyncGuestCart],
  );

  /**
   * Clear cart
   */
  const clearCart = useCallback(async () => {
    updateCartSnapshot({ isUpdating: true, error: null });

    try {
      if (isAuthenticated()) {
        const data = await cartApi.clearCart();
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: null,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: [],
        });
      } else {
        clearStoredGuestCart();
        setCartSnapshot({
          lines: [],
          totals: EMPTY_TOTALS,
          maxItemQuantity: DEFAULT_MAX_ITEM_QUANTITY,
          maxRequestQuantity: DEFAULT_MAX_REQUEST_QUANTITY,
          coupon: null,
          governorateSlug: null,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: [],
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "تعذر إفراغ السلة";
      updateCartSnapshot({ isUpdating: false, error: message });
    }
  }, []);

  /**
   * Apply coupon
   */
  const applyCoupon = useCallback(
    async (code: string): Promise<CouponResult> => {
      const trimmed = code.trim().toUpperCase();
      if (!trimmed) {
        return { ok: false, message: "يرجى إدخال كود الخصم أولاً" };
      }

      updateCartSnapshot({ isUpdating: true, error: null });

      try {
        if (isAuthenticated()) {
          const data = await cartApi.applyCoupon(trimmed);
          const transformed = transformBackendCart(data);
          setCartSnapshot({
            ...transformed,
            governorateSlug: transformed.totals.governorate?.slug ?? null,
            isLoading: false,
            isUpdating: false,
            error: null,
            warnings: formatCartWarnings(data.warnings),
          });
          return {
            ok: true,
            message: `تم تطبيق كود الخصم (${trimmed})`,
            coupon: transformed.coupon ?? undefined,
          };
        } else {
          const guestData = readStoredGuestCart();
          const data = await validateAndSyncGuestCart(
            guestData.items,
            trimmed,
            guestData.governorateSlug || undefined,
          );

          if (data.coupon) {
            const syncedGuestData = readStoredGuestCart();
            syncedGuestData.couponCode = trimmed;
            writeStoredGuestCart(syncedGuestData);

            const transformed = transformBackendCart(data);
            setCartSnapshot({
              ...transformed,
              governorateSlug: guestData.governorateSlug ?? null,
              isLoading: false,
              isUpdating: false,
              error: null,
              warnings: formatCartWarnings(data.warnings),
            });
            return {
              ok: true,
              message: `تم تطبيق كود الخصم (${trimmed})`,
              coupon: transformed.coupon ?? undefined,
            };
          } else {
            updateCartSnapshot({ isUpdating: false });
            return { ok: false, message: "كود الخصم غير صالح أو لا يستوفي الشروط" };
          }
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "كود الخصم غير صالح";
        updateCartSnapshot({ isUpdating: false, error: message });
        return { ok: false, message };
      }
    },
    [validateAndSyncGuestCart],
  );

  /**
   * Remove coupon
   */
  const removeCoupon = useCallback(async () => {
    updateCartSnapshot({ isUpdating: true, error: null });

    try {
      if (isAuthenticated()) {
        const data = await cartApi.removeCoupon();
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: transformed.totals.governorate?.slug ?? null,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: formatCartWarnings(data.warnings),
        });
      } else {
        const guestData = readStoredGuestCart();
        guestData.couponCode = null;
        writeStoredGuestCart(guestData);

        const data = await validateAndSyncGuestCart(
          guestData.items,
          undefined,
          guestData.governorateSlug || undefined,
        );
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: guestData.governorateSlug ?? null,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: formatCartWarnings(data.warnings),
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "تعذر إزالة كود الخصم";
      updateCartSnapshot({ isUpdating: false, error: message });
    }
  }, [validateAndSyncGuestCart]);

  /**
   * Update governorate
   */
  const setGovernorate = useCallback(async (slug: string | null) => {
    updateCartSnapshot({ isUpdating: true, error: null });

    try {
      if (isAuthenticated()) {
        const data = await cartApi.updateGovernorate(slug);
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: slug,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: formatCartWarnings(data.warnings),
        });
      } else {
        const guestData = readStoredGuestCart();
        guestData.governorateSlug = slug;
        writeStoredGuestCart(guestData);

        const data = await validateAndSyncGuestCart(
          guestData.items,
          guestData.couponCode || undefined,
          slug || undefined,
        );
        const transformed = transformBackendCart(data);
        setCartSnapshot({
          ...transformed,
          governorateSlug: slug,
          isLoading: false,
          isUpdating: false,
          error: null,
          warnings: formatCartWarnings(data.warnings),
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "تعذر تحديث المحافظة";
      updateCartSnapshot({ isUpdating: false, error: message });
    }
  }, [validateAndSyncGuestCart]);

  /**
   * Explicit merge after login
   */
  const mergeGuestCart = useCallback(async () => {
    const guestData = readStoredGuestCart();
    if (!guestData.items || guestData.items.length === 0) {
      await refreshCart();
      return;
    }

    updateCartSnapshot({ isLoading: true, error: null });

    try {
      const data = await cartApi.mergeCart(guestData.items);
      clearStoredGuestCart();
      const transformed = transformBackendCart(data);
      setCartSnapshot({
        ...transformed,
        governorateSlug: transformed.totals.governorate?.slug ?? null,
        isLoading: false,
        isUpdating: false,
        error: null,
        warnings: formatCartWarnings(data.warnings),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "تعذر دمج سلة المشتريات";
      updateCartSnapshot({ isLoading: false, error: message });
    }
  }, [refreshCart]);

  /**
   * Logout cleanup
   */
  const resetCartOnLogout = useCallback(() => {
    clearStoredGuestCart();
    setCartSnapshot({
      lines: [],
      totals: EMPTY_TOTALS,
      maxItemQuantity: DEFAULT_MAX_ITEM_QUANTITY,
      maxRequestQuantity: DEFAULT_MAX_REQUEST_QUANTITY,
      coupon: null,
      governorateSlug: null,
      isLoading: false,
      isUpdating: false,
      error: null,
      warnings: [],
    });
  }, []);

  const addUpsell = useCallback(() => {
    // Upsell card item
    addLine({
      variantId: 1, // Fallback if added
      productId: CART_UPSELL.id,
      name: CART_UPSELL.name,
      note: CART_UPSELL.description,
      image: CART_UPSELL.image,
      href: CART_UPSELL.href,
      unitPrice: CART_UPSELL.price,
      compareAtPrice: CART_UPSELL.compareAtPrice,
      quantity: 1,
    });
  }, [addLine]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: snapshot.lines,
      totals: snapshot.totals,
      coupon: snapshot.coupon,
      governorateSlug: snapshot.governorateSlug,
      maxItemQuantity: snapshot.maxItemQuantity,
      isOpen,
      isLoading: snapshot.isLoading,
      isUpdating: snapshot.isUpdating,
      error: snapshot.error,
      warnings: snapshot.warnings,
      openCart,
      closeCart,
      setCartOpen,
      addLine,
      addUpsell,
      removeLine,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      setGovernorate,
      clearCart,
      refreshCart,
      mergeGuestCart,
      resetCartOnLogout,
    }),
    [
      snapshot,
      isOpen,
      openCart,
      closeCart,
      setCartOpen,
      addLine,
      addUpsell,
      removeLine,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      setGovernorate,
      clearCart,
      refreshCart,
      mergeGuestCart,
      resetCartOnLogout,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartDrawer(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartDrawer must be used within a CartProvider");
  }

  return context;
}
