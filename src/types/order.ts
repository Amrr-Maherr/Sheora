export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "confirmed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderItem = {
  productId: string;
  variantId?: string;
  name?: string;
  title?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  price?: number;
  image?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  status?: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  shippingMethod?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string | null;
  shippingAddressId?: string;
  createdAt: string;
};
