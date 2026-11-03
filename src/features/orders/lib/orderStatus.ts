import type { TrackedOrderStatus } from "./orderStorage";

export const ORDER_STATUS_LABELS: Record<TrackedOrderStatus, string> = {
  confirmed: "تم تأكيد الطلب",
  processing: "قيد التجهيز",
  shipped: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export const ORDER_STATUS_STYLES: Record<TrackedOrderStatus, string> = {
  confirmed: "bg-[#FBF5EC] text-[#8C6426] border-[#E9D9BE]",
  processing: "bg-[#EEF6F0] text-[#047857] border-[#CDE7D6]",
  shipped: "bg-[#EEF4FB] text-[#1D4ED8] border-[#CFE0F5]",
  delivered: "bg-[#EEF6F0] text-[#047857] border-[#CDE7D6]",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export const ORDER_STATUS_STEP: Record<TrackedOrderStatus, number> = {
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export const ORDER_TRACKING_STEPS = [
  {
    title: "تم استلام الطلب",
    description: "وصلنا طلبك وتم تأكيده بنجاح.",
  },
  {
    title: "قيد التجهيز",
    description: "نحضّر منتجاتك بعناية فائقة.",
  },
  {
    title: "تم الشحن",
    description: "طلبك في الطريق إليك.",
  },
  {
    title: "تم التوصيل",
    description: "نتمنى أن تنال منتجاتك إعجابك.",
  },
] as const;
