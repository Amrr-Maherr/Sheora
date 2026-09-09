export type Coupon = {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  isActive: boolean;
  expiresAt: string;
}
