export const DEFAULT_HOME_SECTION_ORDER: readonly string[] = [
  "announcements",
  "hero",
  "curated_categories",
  "best_sellers",
  "video",
  "before_after",
  "spotlight",
  "secondary_collection",
  "featured_brands",
  "reviews",
  "newsletter",
];

export function homeSectionOrderIndex(
  order: readonly string[] | undefined,
  key: string,
): number {
  const resolved = order && order.length > 0 ? order : DEFAULT_HOME_SECTION_ORDER;
  const index = resolved.indexOf(key);

  return index === -1
    ? DEFAULT_HOME_SECTION_ORDER.length + DEFAULT_HOME_SECTION_ORDER.indexOf(key)
    : index;
}

export function homeSectionOrderStyle(
  order: readonly string[] | undefined,
  key: string,
): { order: number } {
  return { order: homeSectionOrderIndex(order, key) };
}
