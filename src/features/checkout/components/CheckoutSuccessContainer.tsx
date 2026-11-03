"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildOrderTrackingWhatsAppUrl,
  getTrackedOrdersRaw,
  normalizeOrderReference,
  openOrderInvoice,
  parseTrackedOrders,
  subscribeToTrackedOrders,
  type TrackedOrder,
} from "@/features/orders";
import { CheckoutSuccessPresenter } from "./CheckoutSuccessPresenter";

type CheckoutSuccessContainerProps = {
  supportPhone?: string | null;
};

export function CheckoutSuccessContainer({
  supportPhone = null,
}: CheckoutSuccessContainerProps) {
  const searchParams = useSearchParams();
  const reference = searchParams.get("order") ?? "";
  const rawOrders = useSyncExternalStore(
    subscribeToTrackedOrders,
    getTrackedOrdersRaw,
    () => null,
  );

  const order = useMemo(() => {
    const orders = parseTrackedOrders(rawOrders);

    if (!reference) {
      return orders[0] ?? null;
    }

    const normalizedReference = normalizeOrderReference(reference);

    return (
      orders.find(
        (item) =>
          normalizeOrderReference(item.reference) === normalizedReference,
      ) ?? null
    );
  }, [rawOrders, reference]);

  const handleTrackOrder = (trackedOrder: TrackedOrder) => {
    const url = buildOrderTrackingWhatsAppUrl({
      ...trackedOrder,
      supportPhone: trackedOrder.supportPhone ?? supportPhone,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadInvoice = (trackedOrder: TrackedOrder) => {
    openOrderInvoice(trackedOrder);
  };

  return (
    <CheckoutSuccessPresenter
      order={order}
      isLoading={rawOrders === null}
      supportPhone={supportPhone}
      onTrackOrder={handleTrackOrder}
      onDownloadInvoice={handleDownloadInvoice}
    />
  );
}
