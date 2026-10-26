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
  calculateTotals,
  findCoupon,
  upsellToLine,
} from "../lib/cartCatalog";
import { clampQuantity } from "../lib/format";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  hydrateCart,
  setCartSnapshot,
  subscribeCart,
} from "../lib/cartStore";
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
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
  addLine: (line: CartLineInput) => void;
  addUpsell: () => void;
  removeLine: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { lines, coupon } = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    hydrateCart();
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const setCartOpen = useCallback((open: boolean) => setIsOpen(open), []);

  const addLine = useCallback((line: CartLineInput) => {
    const current = getCartSnapshot();
    const quantity = clampQuantity(line.quantity ?? 1);
    const existing = current.lines.find((item) => item.id === line.id);
    const nextLines = existing
      ? current.lines.map((item) =>
          item.id === line.id
            ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
            : item,
        )
      : [...current.lines, { ...line, quantity }];

    setCartSnapshot({ lines: nextLines, coupon: current.coupon });
    setIsOpen(true);
  }, []);

  const addUpsell = useCallback(() => {
    addLine(upsellToLine(CART_UPSELL));
  }, [addLine]);

  const removeLine = useCallback((id: string) => {
    const current = getCartSnapshot();

    setCartSnapshot({
      lines: current.lines.filter((line) => line.id !== id),
      coupon: current.coupon,
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const current = getCartSnapshot();

    setCartSnapshot({
      lines: current.lines.map((line) =>
        line.id === id
          ? { ...line, quantity: clampQuantity(quantity) }
          : line,
      ),
      coupon: current.coupon,
    });
  }, []);

  const applyCoupon = useCallback((code: string): CouponResult => {
    const matched = findCoupon(code);

    if (!matched) {
      return { ok: false, message: "كود الخصم غير صالح" };
    }

    const current = getCartSnapshot();
    setCartSnapshot({ lines: current.lines, coupon: matched });

    return {
      ok: true,
      message: `تم تطبيق كود الخصم (${matched.label})`,
    };
  }, []);

  const removeCoupon = useCallback(() => {
    const current = getCartSnapshot();
    setCartSnapshot({ lines: current.lines, coupon: null });
  }, []);

  const totals = useMemo(() => calculateTotals(lines, coupon), [lines, coupon]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals,
      coupon,
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
    }),
    [
      lines,
      totals,
      coupon,
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
