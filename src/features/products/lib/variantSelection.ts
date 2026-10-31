import type { ProductVariant } from "@/types";

export type VariantDimensionKind = "attribute" | "color" | "size";

export type VariantDimensionOption = {
  key: string;
  label: string;
  swatchHex: string | null;
};

export type VariantDimension = {
  key: string;
  label: string;
  kind: VariantDimensionKind;
  attributeCode?: string;
  options: VariantDimensionOption[];
};

export type VariantSelection = Record<string, string>;

function normalizeColor(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();

  return normalized ? normalized : null;
}

function colorOptionKey(variant: ProductVariant): string | null {
  return (
    normalizeColor(variant.colorHex) ??
    normalizeColor(variant.colorName) ??
    null
  );
}

function addOption(
  dimension: VariantDimension,
  option: VariantDimensionOption,
): void {
  if (
    option.key &&
    !dimension.options.some((existing) => existing.key === option.key)
  ) {
    dimension.options.push(option);
  }
}

export function getVariantDimensions(
  variants: ProductVariant[],
): VariantDimension[] {
  const dimensions: VariantDimension[] = [];
  const attributeDimensions = new Map<string, VariantDimension>();

  for (const variant of variants) {
    for (const attribute of variant.attributes) {
      let dimension = attributeDimensions.get(attribute.code);

      if (!dimension) {
        dimension = {
          key: `attribute:${attribute.code}`,
          label: attribute.name || attribute.code,
          kind: "attribute",
          attributeCode: attribute.code,
          options: [],
        };
        attributeDimensions.set(attribute.code, dimension);
        dimensions.push(dimension);
      }

      addOption(dimension, {
        key: String(attribute.optionId),
        label: attribute.label || attribute.value,
        swatchHex: attribute.swatchHex,
      });
    }
  }

  const hasSizeAttribute = dimensions.some(
    (dimension) =>
      dimension.kind === "attribute" &&
      (dimension.attributeCode?.toLowerCase().includes("size") ||
        dimension.label.toLowerCase() === "size"),
  );

  if (!hasSizeAttribute && variants.some((variant) => variant.size)) {
    const sizeDimension: VariantDimension = {
      key: "legacy:size",
      label: "المقاس",
      kind: "size",
      options: [],
    };

    for (const variant of variants) {
      if (variant.size) {
        addOption(sizeDimension, {
          key: variant.size,
          label: variant.size,
          swatchHex: null,
        });
      }
    }

    if (sizeDimension.options.length > 0) {
      dimensions.push(sizeDimension);
    }
  }

  const hasColorAttribute = dimensions.some(
    (dimension) =>
      dimension.kind === "attribute" &&
      (dimension.attributeCode?.toLowerCase().includes("color") ||
        dimension.label.toLowerCase() === "color"),
  );

  const hasLegacyColor = variants.some(
    (variant) => colorOptionKey(variant) !== null,
  );

  if (!hasColorAttribute && hasLegacyColor) {
    const colorDimension: VariantDimension = {
      key: "legacy:color",
      label: "اللون",
      kind: "color",
      options: [],
    };

    for (const variant of variants) {
      const key = colorOptionKey(variant);

      if (key) {
        addOption(colorDimension, {
          key,
          label: variant.colorName ?? variant.colorHex ?? key,
          swatchHex: variant.colorHex,
        });
      }
    }

    if (colorDimension.options.length > 0) {
      dimensions.push(colorDimension);
    }
  }

  return dimensions;
}

export function getVariantOptionValue(
  variant: ProductVariant,
  dimension: VariantDimension,
): string | null {
  if (dimension.kind === "attribute") {
    const attribute = variant.attributes.find(
      (candidate) => candidate.code === dimension.attributeCode,
    );

    return attribute ? String(attribute.optionId) : null;
  }

  if (dimension.kind === "color") {
    return colorOptionKey(variant);
  }

  return variant.size || null;
}

export function buildVariantSelection(
  variant: ProductVariant,
  dimensions: VariantDimension[],
): VariantSelection {
  const selection: VariantSelection = {};

  for (const dimension of dimensions) {
    const value = getVariantOptionValue(variant, dimension);

    if (value !== null) {
      selection[dimension.key] = value;
    }
  }

  return selection;
}

export function findMatchingVariant(
  variants: ProductVariant[],
  dimensions: VariantDimension[],
  selection: VariantSelection,
): ProductVariant | null {
  return (
    variants.find((variant) =>
      dimensions.every((dimension) => {
        const selected = selection[dimension.key];

        if (selected === undefined) {
          return true;
        }

        return getVariantOptionValue(variant, dimension) === selected;
      }),
    ) ?? null
  );
}

export function getDefaultVariantSelection(
  variants: ProductVariant[],
  dimensions: VariantDimension[],
): VariantSelection {
  const preferred =
    variants.find((variant) => variant.stock > 0) ?? variants[0] ?? null;

  return preferred ? buildVariantSelection(preferred, dimensions) : {};
}

export function isVariantOptionAvailable(
  variants: ProductVariant[],
  dimensions: VariantDimension[],
  selection: VariantSelection,
  dimensionKey: string,
  optionKey: string,
): boolean {
  const candidate = { ...selection, [dimensionKey]: optionKey };

  return variants.some(
    (variant) =>
      variant.stock > 0 &&
      dimensions.every((dimension) => {
        const selected = candidate[dimension.key];

        if (selected === undefined) {
          return true;
        }

        return getVariantOptionValue(variant, dimension) === selected;
      }),
  );
}

export function selectVariantOption(
  variants: ProductVariant[],
  dimensions: VariantDimension[],
  selection: VariantSelection,
  dimensionKey: string,
  optionKey: string,
): VariantSelection {
  const next = { ...selection, [dimensionKey]: optionKey };
  const exact = findMatchingVariant(variants, dimensions, next);

  if (exact) {
    return buildVariantSelection(exact, dimensions);
  }

  const dimension = dimensions.find(
    (candidate) => candidate.key === dimensionKey,
  );
  const fallback =
    (dimension
      ? variants.find(
          (variant) =>
            getVariantOptionValue(variant, dimension) === optionKey &&
            variant.stock > 0,
        )
      : null) ??
    (dimension
      ? variants.find(
          (variant) =>
            getVariantOptionValue(variant, dimension) === optionKey,
        )
      : null);

  return fallback
    ? buildVariantSelection(fallback, dimensions)
    : next;
}

export function getVariantOptionLabel(
  dimension: VariantDimension,
  optionKey: string | undefined,
): string | null {
  if (optionKey === undefined) {
    return null;
  }

  return (
    dimension.options.find((option) => option.key === optionKey)?.label ??
    null
  );
}

export function getVariantLabel(
  variant: ProductVariant,
  dimensions: VariantDimension[],
): string {
  const labels = dimensions
    .map((dimension) =>
      getVariantOptionLabel(
        dimension,
        getVariantOptionValue(variant, dimension) ?? undefined,
      ),
    )
    .filter((label): label is string => Boolean(label));

  return labels.join(" / ") || variant.sku;
}
