import type { BackendCartWarning } from "../types";

export type CartWarningLocale = "ar" | "en";

const quantityMessages: Record<
  CartWarningLocale,
  Record<string, (quantity: number) => string>
> = {
  ar: {
    MAX_ITEM_QUANTITY: (quantity) =>
      `تم تعديل الكمية إلى الحد الأقصى المسموح به وهو ${quantity} لكل منتج.`,
    INSUFFICIENT_STOCK: (quantity) =>
      `تم تعديل الكمية إلى المخزون المتاح (${quantity}).`,
  },
  en: {
    MAX_ITEM_QUANTITY: (quantity) =>
      `Quantity adjusted to the maximum allowed of ${quantity} per product.`,
    INSUFFICIENT_STOCK: (quantity) =>
      `Quantity adjusted to the available stock (${quantity}).`,
  },
};

function resolveLocale(locale?: string): CartWarningLocale {
  if (locale) {
    return locale.toLowerCase().startsWith("en") ? "en" : "ar";
  }

  if (typeof document === "undefined") {
    return "ar";
  }

  return document.documentElement.lang?.toLowerCase().startsWith("en")
    ? "en"
    : "ar";
}

export function formatCartWarning(
  warning: BackendCartWarning,
  locale?: string,
): string {
  if (warning.code !== "QUANTITY_ADJUSTED") {
    return warning.message;
  }

  const activeLocale = resolveLocale(locale);
  const applied = warning.applied ?? warning.adjusted_to;
  const reason = warning.reason ?? "";
  const formatter = quantityMessages[activeLocale][reason];

  if (formatter && typeof applied === "number") {
    return formatter(applied);
  }

  return activeLocale === "en"
    ? `Quantity adjusted to ${applied ?? "the available amount"}.`
    : `تم تعديل الكمية إلى ${applied ?? "الكمية المتاحة"}.`;
}

export function formatCartWarnings(
  warnings: BackendCartWarning[] | undefined,
  locale?: string,
): string[] {
  return (warnings ?? []).map((warning) =>
    formatCartWarning(warning, locale),
  );
}
