export type Coupon = {
  id: string;
  code: string;
  type?: "percentage" | "fixed" | "free_shipping";
  value?: number;
  discountPercent?: number;
  maxDiscount?: number;
  maximumDiscount?: number;
  minOrder?: number;
  minimumOrder?: number;
  isActive: boolean;
  expiresAt: string;
  description?: string;
};
