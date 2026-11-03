import type { CartLine, CartTotals } from "@/features/cart";

export type TrackedOrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type TrackedOrderItem = {
  id: string;
  productId: string;
  name: string;
  variantName?: string;
  note?: string;
  image: string;
  href: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  customization?: string;
};

export type TrackedOrderCustomer = {
  fullName: string;
  phone: string;
  altPhone?: string;
  governorate: string;
  governorateSlug: string;
  area: string;
  address: string;
  notes?: string;
};

export type TrackedOrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  deposit: number;
  remaining: number;
  couponCode?: string | null;
};

export type TrackedOrder = {
  reference: string;
  createdAt: string;
  status: TrackedOrderStatus;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod: string;
  customer: TrackedOrderCustomer;
  items: TrackedOrderItem[];
  itemCount: number;
  totals: TrackedOrderTotals;
  supportPhone: string | null;
};

export type TrackedOrderForm = {
  fullName: string;
  phone: string;
  altPhone: string;
  governorateSlug: string;
  area: string;
  address: string;
  notes: string;
};

type CreateTrackedOrderArgs = {
  reference: string;
  form: TrackedOrderForm;
  lines: CartLine[];
  totals: CartTotals;
  couponCode?: string | null;
  governorateName?: string | null;
  supportPhone?: string | null;
};

const ORDER_STORAGE_KEY = "sheora:tracked-orders:v1";
const ORDER_STORAGE_EVENT = "sheora:tracked-orders-changed";
const MAX_STORED_ORDERS = 25;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getTrackedOrdersRaw(): string | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(ORDER_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToTrackedOrders(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", listener);
  window.addEventListener(ORDER_STORAGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(ORDER_STORAGE_EVENT, listener);
  };
}

export function parseTrackedOrders(raw: string | null): TrackedOrder[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (order): order is TrackedOrder =>
          Boolean(order) &&
          typeof order === "object" &&
          typeof (order as TrackedOrder).reference === "string" &&
          Array.isArray((order as TrackedOrder).items),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  } catch {
    return [];
  }
}

function readStoredOrders(): TrackedOrder[] {
  return parseTrackedOrders(getTrackedOrdersRaw());
}

function writeStoredOrders(orders: TrackedOrder[]): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(orders.slice(0, MAX_STORED_ORDERS)),
    );
    window.dispatchEvent(new Event(ORDER_STORAGE_EVENT));
  } catch {
    // Storage can be unavailable (private mode/quota); tracking simply falls
    // back to the current session state.
  }
}

export function normalizeOrderReference(reference: string): string {
  return reference.replace(/^#/, "").trim().toUpperCase();
}

export function createOrderReference(): string {
  const existing = new Set(
    readStoredOrders().map((order) => normalizeOrderReference(order.reference)),
  );

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const random = Math.floor(10000 + Math.random() * 90000);
    const reference = `SH-${random}`;

    if (!existing.has(reference)) {
      return reference;
    }
  }

  return `SH-${Date.now().toString().slice(-6)}`;
}

export function buildTrackedOrder({
  reference,
  form,
  lines,
  totals,
  couponCode,
  governorateName,
  supportPhone,
}: CreateTrackedOrderArgs): TrackedOrder {
  const deposit = Math.max(0, totals.depositAmount || 0);
  const remaining = Math.max(
    0,
    totals.remainingAmount || totals.total - deposit,
  );

  return {
    reference: normalizeOrderReference(reference),
    createdAt: new Date().toISOString(),
    status: "confirmed",
    paymentStatus: "pending",
    paymentMethod: "الدفع عند الاستلام (COD)",
    customer: {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      altPhone: form.altPhone.trim() || undefined,
      governorate: governorateName?.trim() || form.governorateSlug,
      governorateSlug: form.governorateSlug,
      area: form.area.trim(),
      address: form.address.trim(),
      notes: form.notes.trim() || undefined,
    },
    items: lines.map((line) => ({
      id: line.id,
      productId: line.productId,
      name: line.name,
      variantName: line.variantName,
      note: line.note,
      image: line.image,
      href: line.href,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      lineTotal: line.unitPrice * line.quantity,
      customization: line.customization,
    })),
    itemCount: totals.itemCount,
    totals: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      deposit,
      remaining,
      couponCode: couponCode ?? null,
    },
    supportPhone: supportPhone?.replace(/\D/g, "") || null,
  };
}

export function saveTrackedOrder(order: TrackedOrder): void {
  const normalizedReference = normalizeOrderReference(order.reference);
  const orders = readStoredOrders().filter(
    (existing) =>
      normalizeOrderReference(existing.reference) !== normalizedReference,
  );

  writeStoredOrders([{ ...order, reference: normalizedReference }, ...orders]);
}

export function getTrackedOrders(): TrackedOrder[] {
  return readStoredOrders().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getTrackedOrder(reference: string): TrackedOrder | null {
  const normalizedReference = normalizeOrderReference(reference);

  return (
    getTrackedOrders().find(
      (order) => normalizeOrderReference(order.reference) === normalizedReference,
    ) ?? null
  );
}

export function getLatestTrackedOrder(): TrackedOrder | null {
  return getTrackedOrders()[0] ?? null;
}

export function formatOrderDate(value: string | Date): string {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatOrderTime(value: string | Date): string {
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatOrderDateLabel(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return isSameDay(date, new Date())
    ? `اليوم، ${formatOrderTime(date)}`
    : formatOrderDate(date);
}

export function formatItemCount(count: number): string {
  if (count === 1) {
    return "منتج واحد";
  }

  if (count === 2) {
    return "منتجان";
  }

  if (count >= 3 && count <= 10) {
    return `${count} منتجات`;
  }

  return `${count} منتجاً`;
}
