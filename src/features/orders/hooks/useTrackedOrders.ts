"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getTrackedOrdersRaw,
  parseTrackedOrders,
  subscribeToTrackedOrders,
  type TrackedOrder,
} from "../lib/orderStorage";

export function useTrackedOrders(): TrackedOrder[] {
  const raw = useSyncExternalStore(
    subscribeToTrackedOrders,
    getTrackedOrdersRaw,
    () => null,
  );

  return useMemo(() => parseTrackedOrders(raw), [raw]);
}
