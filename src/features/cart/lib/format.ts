const priceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return `${formatPrice(value)} ج.م`;
}

export const DEFAULT_MAX_ITEM_QUANTITY = 10;
export const DEFAULT_MAX_REQUEST_QUANTITY = 99;

export function clampQuantity(
  quantity: number,
  maximum: number = DEFAULT_MAX_REQUEST_QUANTITY,
): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  const max = Math.max(1, Math.floor(maximum));
  return Math.min(max, Math.max(1, Math.round(quantity)));
}
