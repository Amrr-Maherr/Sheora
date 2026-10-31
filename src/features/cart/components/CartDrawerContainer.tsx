"use client";

import { useCartDrawer } from "../context/CartProvider";
import { CartDrawerPresenter } from "./CartDrawerPresenter";

export function CartDrawerContainer() {
  const {
    lines,
    totals,
    coupon,
    governorateSlug,
    maxItemQuantity,
    setGovernorate,
    isOpen,
    isLoading,
    isUpdating,
    error,
    warnings,
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
      governorateSlug={governorateSlug}
      maxItemQuantity={maxItemQuantity}
      onSelectGovernorate={setGovernorate}
      isOpen={isOpen}
      isLoading={isLoading}
      isUpdating={isUpdating}
      error={error}
      warnings={warnings}
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
