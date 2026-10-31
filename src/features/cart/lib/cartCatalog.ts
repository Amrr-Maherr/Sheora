import {
  DEFAULT_MAX_ITEM_QUANTITY,
  DEFAULT_MAX_REQUEST_QUANTITY,
} from "./format";
import type {
  AppliedCoupon,
  BackendCartData,
  CartBadgeTone,
  CartLine,
  CartTotals,
  CartUpsell,
} from "../types";

export const GIFT_WRAP_FEE = 0;

export const EMPTY_TOTALS: CartTotals = {
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  subtotalAfterDiscount: 0,
  shipping: 0,
  freeShippingThreshold: null,
  isFreeShipping: false,
  shippingStatus: "pending",
  shippingMessage: null,
  governorate: null,
  giftWrap: 0,
  total: 0,
};

export const CART_UPSELL: CartUpsell = {
  id: "eclat-serum",
  name: "سيروم النضارة L'Éclat (30 مل)",
  description: "حمض الهيالورونيك وخلايا النضارة",
  price: 320,
  compareAtPrice: 420,
  image: "/images/figma/prod_serum.png",
  href: "/products",
};

const CATEGORY_LABELS: Record<string, string> = {
  perfumes: "عطور",
  perfume: "عطور",
  makeup: "مكياج",
  skincare: "العناية بالبشرة",
  hair: "العناية بالشعر",
  haircare: "العناية بالشعر",
  body: "العناية بالجسم",
  tools: "أدوات التجميل",
  men: "العناية الرجالية",
};

export function categoryLabel(slug?: string): string | undefined {
  if (!slug) {
    return undefined;
  }
  return CATEGORY_LABELS[slug];
}

export function categoryBadgeTone(slug?: string): CartBadgeTone {
  if (slug === "makeup") {
    return "makeup";
  }
  if (slug === "perfumes" || slug === "perfume") {
    return "perfume";
  }
  return "default";
}

export function transformBackendCart(data: BackendCartData): {
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  maxItemQuantity: number;
  maxRequestQuantity: number;
} {
  const lines: CartLine[] = (data.items ?? []).map((item) => {
    const unitPrice = Number(item.unit_price) || 0;
    const compareAtPrice = item.compare_at_price
      ? Number(item.compare_at_price)
      : undefined;

    const note =
      item.variant_name ||
      [
        item.size_ml ? `${item.size_ml} مل` : "",
        item.concentration ? item.concentration.toUpperCase() : "",
      ]
        .filter(Boolean)
        .join(" • ");

    return {
      id: String(item.variant_id),
      variantId: item.variant_id,
      productId: String(item.product_id),
      productSlug: item.product_slug,
      name: item.name,
      variantName: item.variant_name ?? undefined,
      note,
      image: item.image_url || "/images/figma/prod_bottle.png",
      href: `/products/${item.product_id}`,
      badge: categoryLabel(item.category_slug ?? undefined),
      badgeTone: categoryBadgeTone(item.category_slug ?? undefined),
      unitPrice,
      compareAtPrice,
      quantity: item.quantity,
      stockAvailable: item.stock_available,
      isAvailable: item.is_available,
    };
  });

  const coupon: AppliedCoupon | null = data.coupon
    ? {
        code: data.coupon.code,
        description: data.coupon.description ?? undefined,
        discountType: data.coupon.discount_type,
        discountValue: Number(data.coupon.discount_value) || 0,
        discountAmount: Number(data.coupon.discount_amount) || 0,
        label:
          data.coupon.discount_type === "percentage"
            ? `خصم ${Number(data.coupon.discount_value)}%`
            : `خصم ${Number(data.coupon.discount_value)} ج.م`,
        percent:
          data.coupon.discount_type === "percentage"
            ? Number(data.coupon.discount_value)
            : 0,
      }
    : null;

  const totals: CartTotals = {
    itemCount: data.item_count,
    subtotal: Number(data.subtotal) || 0,
    discount: Number(data.discount_amount) || 0,
    subtotalAfterDiscount: Number(data.subtotal_after_discount) || 0,
    shipping: Number(data.shipping.shipping_fee) || 0,
    freeShippingThreshold: data.shipping.free_shipping_threshold
      ? Number(data.shipping.free_shipping_threshold)
      : null,
    isFreeShipping: data.shipping.is_free_shipping,
    shippingStatus: data.shipping.status,
    shippingMessage: data.shipping.message,
    governorate: data.shipping.governorate
      ? {
          slug: data.shipping.governorate.slug,
          nameAr: data.shipping.governorate.name_ar,
          nameEn: data.shipping.governorate.name_en,
        }
      : null,
    giftWrap: GIFT_WRAP_FEE,
    total: Number(data.total) || 0,
  };

  return {
    lines,
    totals,
    coupon,
    maxItemQuantity: Math.max(
      1,
      data.quantity_policy?.max_item_quantity ?? DEFAULT_MAX_ITEM_QUANTITY,
    ),
    maxRequestQuantity: Math.max(
      1,
      data.quantity_policy?.max_request_quantity ??
        DEFAULT_MAX_REQUEST_QUANTITY,
    ),
  };
}
