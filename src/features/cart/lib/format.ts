const priceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return `${formatPrice(value)} ج.م`;
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.min(99, Math.max(1, Math.round(quantity)));
}
