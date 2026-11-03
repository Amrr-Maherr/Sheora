import { formatCurrency } from "@/features/cart/lib/format";
import type { AppliedCoupon, CartLine, CartTotals } from "@/features/cart";
import type { CheckoutFormValues } from "../types";

type BuildCheckoutWhatsAppUrlArgs = {
  form: CheckoutFormValues;
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  governorateName?: string | null;
  whatsappNumber?: string | null;
  reference?: string | null;
};

export function buildCheckoutWhatsAppUrl({
  form,
  lines,
  totals,
  coupon,
  governorateName,
  whatsappNumber,
  reference,
}: BuildCheckoutWhatsAppUrlArgs): string {
  const items = lines.map(
    (line) =>
      `- ${line.name}${line.variantName ? ` (${line.variantName})` : ""} × ${line.quantity} — ${formatCurrency(line.unitPrice * line.quantity)}`,
  );

  const message = [
    "طلب جديد من SHEORA",
    reference ? `رقم الطلب: #${reference}` : null,
    "",
    `الاسم: ${form.fullName.trim()}`,
    `رقم الموبايل: ${form.phone.trim()}`,
    form.altPhone.trim() ? `رقم إضافي: ${form.altPhone.trim()}` : null,
    `المحافظة: ${governorateName ?? form.governorateSlug}`,
    `المنطقة / الحي: ${form.area.trim()}`,
    `العنوان بالتفصيل: ${form.address.trim()}`,
    form.notes.trim() ? `ملاحظات: ${form.notes.trim()}` : null,
    "",
    "المنتجات:",
    ...items,
    "",
    `مجموع المنتجات: ${formatCurrency(totals.subtotal)}`,
    coupon && totals.discount > 0
      ? `الخصم (${coupon.code}): -${formatCurrency(totals.discount)}`
      : null,
    `مصاريف الشحن: ${
      totals.shippingStatus === "pending"
        ? "يُحدد حسب المحافظة"
        : totals.isFreeShipping || totals.shipping === 0
          ? "مجاني"
          : formatCurrency(totals.shipping)
    }`,
    `الإجمالي: ${formatCurrency(totals.total)}`,
    "",
    "طريقة الدفع: الدفع عند الاستلام (COD)",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const number = whatsappNumber?.replace(/\D/g, "") ?? "";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
