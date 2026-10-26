"use client";

import { useCartDrawer } from "../context/CartProvider";
import { CartPagePresenter } from "./CartPagePresenter";

export function CartPageContainer() {
  const {
    lines,
    totals,
    coupon,
    updateQuantity,
    removeLine,
    addUpsell,
    applyCoupon,
    removeCoupon,
  } = useCartDrawer();

  return (
    <CartPagePresenter
      lines={lines}
      totals={totals}
      coupon={coupon}
      onUpdateQuantity={updateQuantity}
      onRemoveLine={removeLine}
      onAddUpsell={addUpsell}
      onApplyCoupon={applyCoupon}
      onRemoveCoupon={removeCoupon}
    />
  );
}
