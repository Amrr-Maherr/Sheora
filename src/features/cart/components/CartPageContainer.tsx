"use client";

import { useCartDrawer } from "../context/CartProvider";
import { CartPagePresenter } from "./CartPagePresenter";

export function CartPageContainer() {
  const {
    lines,
    totals,
    coupon,
    governorateSlug,
    maxItemQuantity,
    setGovernorate,
    isLoading,
    isUpdating,
    error,
    warnings,
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
      governorateSlug={governorateSlug}
      maxItemQuantity={maxItemQuantity}
      onSelectGovernorate={setGovernorate}
      isLoading={isLoading}
      isUpdating={isUpdating}
      error={error}
      warnings={warnings}
      onUpdateQuantity={updateQuantity}
      onRemoveLine={removeLine}
      onAddUpsell={addUpsell}
      onApplyCoupon={applyCoupon}
      onRemoveCoupon={removeCoupon}
    />
  );
}
