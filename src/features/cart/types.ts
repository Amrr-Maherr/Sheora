export type CartBadgeTone = "perfume" | "makeup" | "default";

export type CartLine = {
  id: string; // variant ID string
  variantId: number;
  productId: string;
  productSlug?: string;
  name: string;
  variantName?: string;
  note: string;
  image: string;
  href: string;
  badge?: string;
  badgeTone?: CartBadgeTone;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  stockAvailable?: number;
  isAvailable?: boolean;
  customization?: string;
  swatch?: string;
  swatchLabel?: string;
};

export type CartLineInput = {
  variantId: number;
  productId: string;
  productSlug?: string;
  name: string;
  variantName?: string;
  note?: string;
  image?: string;
  href?: string;
  badge?: string;
  badgeTone?: CartBadgeTone;
  unitPrice: number;
  compareAtPrice?: number;
  quantity?: number;
  stockAvailable?: number;
  isAvailable?: boolean;
  customization?: string;
  swatch?: string;
  swatchLabel?: string;
  // Fallback for older calls with id
  id?: string;
};

export type AppliedCoupon = {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  label: string;
  percent?: number; // legacy compatibility
};

export type Governorate = {
  slug: string;
  nameAr: string;
  nameEn: string;
  shippingFee: number;
  freeShippingThreshold: number | null;
  sortOrder?: number;
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  discount: number;
  subtotalAfterDiscount: number;
  shipping: number;
  freeShippingThreshold: number | null;
  isFreeShipping: boolean;
  shippingStatus: "pending" | "calculated" | "unsupported";
  shippingMessage?: string | null;
  governorate?: { slug: string; nameAr: string; nameEn: string } | null;
  giftWrap: number;
  total: number;
  depositRequired: boolean;
  depositAmount: number;
  remainingAmount: number;
};

export type CouponResult = {
  ok: boolean;
  message: string;
  coupon?: AppliedCoupon;
};

export type CartUpsell = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  href: string;
};

// Backend API schemas
export type BackendCartItem = {
  id: number | null;
  variant_id: number;
  product_id: number;
  product_slug: string;
  name: string;
  variant_name?: string | null;
  sku: string;
  size_ml?: number | null;
  concentration?: string | null;
  unit_price: string;
  compare_at_price?: string | null;
  quantity: number;
  line_subtotal: string;
  stock_available: number;
  is_available: boolean;
  image_url?: string | null;
  category_slug?: string | null;
  brand_name?: string | null;
};

export type BackendCoupon = {
  code: string;
  description?: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  discount_amount: string;
};

export type BackendShipping = {
  status: "pending" | "calculated" | "unsupported";
  governorate: { slug: string; name_ar: string; name_en: string } | null;
  shipping_fee: string;
  free_shipping_threshold: string | null;
  is_free_shipping: boolean;
  message: string | null;
};

export type BackendQuantityPolicy = {
  max_item_quantity: number;
  max_request_quantity: number;
};

export type BackendCartWarning = {
  code: string;
  variant_id?: number;
  requested?: number;
  applied?: number;
  adjusted_to?: number;
  reason?: "MAX_ITEM_QUANTITY" | "INSUFFICIENT_STOCK" | string | null;
  message: string;
};

export type BackendCartData = {
  items: BackendCartItem[];
  item_count: number;
  currency: string;
  subtotal: string;
  discount_amount: string;
  subtotal_after_discount: string;
  coupon: BackendCoupon | null;
  shipping: BackendShipping;
  total: string;
  deposit_estimate?: {
    deposit_required: boolean;
    estimated_deposit_amount: string;
    remaining_due_at_delivery: string;
    notice?: string | null;
  };
  quantity_policy?: BackendQuantityPolicy;
  warnings?: BackendCartWarning[];
};

export type BackendGovernorate = {
  slug: string;
  name_ar: string;
  name_en: string;
  shipping_fee: string;
  free_shipping_threshold: string | null;
  sort_order: number;
};
