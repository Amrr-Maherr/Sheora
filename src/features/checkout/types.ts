export type CheckoutPaymentMethod = "cod";

export type CheckoutFormValues = {
  fullName: string;
  phone: string;
  altPhone: string;
  governorateSlug: string;
  area: string;
  address: string;
  notes: string;
  paymentMethod: CheckoutPaymentMethod;
};

export type CheckoutFormErrors = Partial<
  Record<keyof CheckoutFormValues, string>
>;
