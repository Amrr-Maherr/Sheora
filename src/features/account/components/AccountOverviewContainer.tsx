"use client";

import { useMemo } from "react";
import { DEMO_USER_ID } from "@/constants";
import { useProducts } from "@/features/products";
import {
  buildOrderTrackingWhatsAppUrl,
  mapOrderToTrackedOrder,
  openOrderInvoice,
  useOrders,
  useTrackedOrders,
  type TrackedOrder,
} from "@/features/orders";
import { useWishlist } from "@/features/wishlist";
import type { Address } from "@/types";
import { useAccountAddresses, useAccountCoupons, useAccountProfile } from "../hooks";
import { AccountOverviewPresenter } from "./AccountOverviewPresenter";

export function AccountOverviewContainer() {
  const profile = useAccountProfile();
  const { data: backendOrders = [], isLoading: isLoadingOrders } =
    useOrders(DEMO_USER_ID);
  const trackedOrders = useTrackedOrders();
  const { data: wishlists = [] } = useWishlist(DEMO_USER_ID);
  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useAccountAddresses(DEMO_USER_ID);
  const { data: coupons = [] } = useAccountCoupons();
  const { data: recommendations = [], isLoading: isLoadingRecommendations } =
    useProducts(3);

  const orders = useMemo(() => {
    const byReference = new Map<string, TrackedOrder>();

    for (const order of [...trackedOrders, ...backendOrders.map(mapOrderToTrackedOrder)]) {
      if (!byReference.has(order.reference)) {
        byReference.set(order.reference, order);
      }
    }

    return [...byReference.values()].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [backendOrders, trackedOrders]);

  const latestOrder = orders[0] ?? null;
  const wishlistCount =
    wishlists[0]?.productIds?.length ?? wishlists[0]?.items?.length ?? 0;
  const defaultAddress =
    addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;

  const deliveryAddress: Address | null =
    defaultAddress ??
    (latestOrder
      ? {
          id: `latest-${latestOrder.reference}`,
          userId: DEMO_USER_ID,
          label: "عنوان آخر طلب",
          fullName: latestOrder.customer.fullName,
          phone: latestOrder.customer.phone,
          street: [latestOrder.customer.area, latestOrder.customer.address]
            .filter(Boolean)
            .join(" - "),
          city: latestOrder.customer.governorate,
          state: latestOrder.customer.governorate,
          zipCode: "",
          country: "مصر",
          isDefault: true,
        }
      : null);

  const handleTrackOrder = (order: TrackedOrder) => {
    const url = buildOrderTrackingWhatsAppUrl(order);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenInvoice = (order: TrackedOrder) => {
    openOrderInvoice(order);
  };

  return (
    <AccountOverviewPresenter
      profile={profile}
      orders={orders}
      latestOrder={latestOrder}
      deliveryAddress={deliveryAddress}
      coupons={coupons}
      wishlistCount={wishlistCount}
      recommendations={recommendations}
      isLoadingOrders={isLoadingOrders && trackedOrders.length === 0}
      isLoadingAddresses={isLoadingAddresses}
      isLoadingRecommendations={isLoadingRecommendations}
      onTrackOrder={handleTrackOrder}
      onOpenInvoice={handleOpenInvoice}
    />
  );
}
