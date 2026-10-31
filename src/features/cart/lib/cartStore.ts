import { EMPTY_TOTALS } from "./cartCatalog";
import {
  DEFAULT_MAX_ITEM_QUANTITY,
  DEFAULT_MAX_REQUEST_QUANTITY,
  clampQuantity,
} from "./format";
import type {
  AppliedCoupon,
  BackendCartData,
  CartLine,
  CartTotals,
} from "../types";

const GUEST_STORAGE_KEY = "sheora.cart.v1";

export type StoredGuestCart = {
  items: Array<{ product_variant_id: number; quantity: number }>;
  couponCode?: string | null;
  governorateSlug?: string | null;
};

export type CartSnapshot = {
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  governorateSlug: string | null;
  maxItemQuantity: number;
  maxRequestQuantity: number;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  warnings: string[];
};

export const SERVER_SNAPSHOT: CartSnapshot = {
  lines: [],
  totals: EMPTY_TOTALS,
  coupon: null,
  governorateSlug: null,
  maxItemQuantity: DEFAULT_MAX_ITEM_QUANTITY,
  maxRequestQuantity: DEFAULT_MAX_REQUEST_QUANTITY,
  isLoading: false,
  isUpdating: false,
  error: null,
  warnings: [],
};

let snapshot: CartSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function normalizeItems(raw: unknown): StoredGuestCart["items"] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      const source = item as {
        product_variant_id?: unknown;
        variantId?: unknown;
        quantity?: unknown;
      } | null;
      const variantId = Number(
        source?.product_variant_id ?? source?.variantId,
      );
      const quantity = Number(source?.quantity);

      return {
        product_variant_id: variantId,
        quantity: clampQuantity(quantity),
      };
    })
    .filter(
      (item) =>
        Number.isInteger(item.product_variant_id) && item.product_variant_id > 0,
    );
}

export function readStoredGuestCart(): StoredGuestCart {
  if (typeof window === "undefined") {
    return { items: [] };
  }

  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) {
      return { items: [] };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) {
      // Legacy format migration if lines array was stored
      if (Array.isArray(parsed.lines)) {
        return {
          items: normalizeItems(parsed.lines),
          couponCode: parsed.coupon?.code || null,
        };
      }
      return { items: [] };
    }

    return {
      items: normalizeItems(parsed.items),
      couponCode: parsed.couponCode ?? null,
      governorateSlug: parsed.governorateSlug ?? null,
    };
  } catch {
    return { items: [] };
  }
}

export function writeStoredGuestCart(cart: StoredGuestCart): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore local storage errors
  }
}

export function clearStoredGuestCart(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function syncStoredGuestQuantities(data: BackendCartData): void {
  if (typeof window === "undefined") {
    return;
  }

  const guestCart = readStoredGuestCart();
  if (guestCart.items.length === 0) {
    return;
  }

  const backendQuantities = new Map(
    data.items.map((item) => [item.variant_id, item.quantity]),
  );

  const syncedItems = guestCart.items
    .filter((item) => backendQuantities.has(item.product_variant_id))
    .map((item) => ({
      product_variant_id: item.product_variant_id,
      quantity: clampQuantity(
        backendQuantities.get(item.product_variant_id) ?? item.quantity,
        data.quantity_policy?.max_request_quantity ??
          DEFAULT_MAX_REQUEST_QUANTITY,
      ),
    }));

  writeStoredGuestCart({ ...guestCart, items: syncedItems });
}

export function getCartSnapshot(): CartSnapshot {
  return snapshot;
}

export function getCartServerSnapshot(): CartSnapshot {
  return SERVER_SNAPSHOT;
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setCartSnapshot(next: CartSnapshot): void {
  snapshot = next;
  emit();
}

export function updateCartSnapshot(partial: Partial<CartSnapshot>): void {
  snapshot = { ...snapshot, ...partial };
  emit();
}
