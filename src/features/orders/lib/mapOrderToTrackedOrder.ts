import type { Order, OrderStatus } from "@/types";
import type { TrackedOrder, TrackedOrderStatus } from "./orderStorage";

const STATUS_MAP: Record<OrderStatus, TrackedOrderStatus> = {
  pending: "confirmed",
  confirmed: "confirmed",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash_on_delivery: "الدفع عند الاستلام (COD)",
  cod: "الدفع عند الاستلام (COD)",
  credit_card: "بطاقة ائتمان",
  card: "بطاقة ائتمان",
};

function toReference(id: string): string {
  const digits = id.replace(/\D/g, "");

  return digits ? `SH-${digits.padStart(5, "0")}` : id.toUpperCase();
}

export function mapOrderToTrackedOrder(order: Order): TrackedOrder {
  const items = order.items.map((item, index) => {
    const unitPrice = item.unitPrice ?? item.price ?? 0;

    return {
      id: `${order.id}-${item.productId}-${item.variantId ?? index}`,
      productId: String(item.productId),
      name: item.name ?? item.title ?? "منتج",
      image: item.image ?? "",
      href: `/products/${item.productId}`,
      quantity: item.quantity,
      unitPrice,
      lineTotal: item.totalPrice ?? unitPrice * item.quantity,
    };
  });

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const status = STATUS_MAP[order.orderStatus ?? order.status ?? "pending"];

  return {
    reference: toReference(order.id),
    createdAt: order.createdAt,
    status: status ?? "processing",
    paymentStatus:
      order.paymentStatus === "paid"
        ? "paid"
        : order.paymentStatus === "refunded"
          ? "refunded"
          : "pending",
    paymentMethod:
      PAYMENT_METHOD_LABELS[order.paymentMethod ?? ""] ??
      order.paymentMethod ??
      "الدفع عند الاستلام (COD)",
    customer: {
      fullName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      governorate: order.shippingAddress.city,
      governorateSlug: order.shippingAddress.city,
      area: order.shippingAddress.city,
      address: order.shippingAddress.address,
    },
    items,
    itemCount,
    totals: {
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      deposit: 0,
      remaining: order.total,
      couponCode: order.couponCode ?? null,
    },
    supportPhone: null,
  };
}
