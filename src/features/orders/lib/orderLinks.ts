import type { TrackedOrder } from "./orderStorage";

export function buildOrderTrackingWhatsAppUrl(order: TrackedOrder): string {
  const message = [
    `مرحباً SHEORA، أرغب في متابعة طلبي رقم #${order.reference}.`,
    `اسم المستلم: ${order.customer.fullName}`,
    `رقم الموبايل: ${order.customer.phone}`,
  ].join("\n");

  const number = order.supportPhone?.replace(/\D/g, "") ?? "";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
