"use client";

import { useCartDrawer } from "../context/CartProvider";
import { CartDrawerPresenter } from "./CartDrawerPresenter";

export function CartDrawerContainer() {
  const {
    lines,
    totals,
    coupon,
    isOpen,
    setCartOpen,
    closeCart,
    updateQuantity,
    removeLine,
    addUpsell,
    applyCoupon,
    removeCoupon,
  } = useCartDrawer();

  return (
    <CartDrawerPresenter
      lines={lines}
      totals={totals}
      coupon={coupon}
      isOpen={isOpen}
      onOpenChange={setCartOpen}
      onClose={closeCart}
      onUpdateQuantity={updateQuantity}
      onRemoveLine={removeLine}
      onAddUpsell={addUpsell}
      onApplyCoupon={applyCoupon}
      onRemoveCoupon={removeCoupon}
    />
  );
}
