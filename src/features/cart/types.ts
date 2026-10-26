export type CartBadgeTone = "perfume" | "makeup" | "default";

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  note: string;
  image: string;
  href: string;
  badge?: string;
  badgeTone?: CartBadgeTone;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  customization?: string;
  swatch?: string;
  swatchLabel?: string;
};

export type CartLineInput = Omit<CartLine, "quantity"> & {
  quantity?: number;
};

export type AppliedCoupon = {
  code: string;
  percent: number;
  label: string;
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  giftWrap: number;
  total: number;
};

export type CouponResult = {
  ok: boolean;
  message: string;
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
