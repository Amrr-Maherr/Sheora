import {
  CART_COUPONS,
  DEMO_CART_LINES,
} from "./cartCatalog";
import type { AppliedCoupon, CartLine } from "../types";

const STORAGE_KEY = "sheora.cart.v1";

type CartSnapshot = {
  lines: CartLine[];
  coupon: AppliedCoupon | null;
};

const SERVER_SNAPSHOT: CartSnapshot = {
  lines: DEMO_CART_LINES,
  coupon: CART_COUPONS[0] ?? null,
};

let snapshot: CartSnapshot = SERVER_SNAPSHOT;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStoredCart(): CartSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CartSnapshot>;

    if (!parsed || !Array.isArray(parsed.lines)) {
      return null;
    }

    return {
      lines: parsed.lines,
      coupon: parsed.coupon ?? null,
    };
  } catch {
    return null;
  }
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

export function hydrateCart(): void {
  if (hydrated || typeof window === "undefined") {
    return;
  }

  hydrated = true;

  const stored = readStoredCart();

  if (stored) {
    snapshot = stored;
    emit();
  }
}

export function setCartSnapshot(next: CartSnapshot): void {
  snapshot = next;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      void error;
    }
  }

  emit();
}
