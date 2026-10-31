import { describe, expect, it } from "vitest";
import type { ProductVariant, ProductVariantAttribute } from "@/types";
import {
  buildVariantSelection,
  findMatchingVariant,
  getDefaultVariantSelection,
  getVariantDimensions,
  getVariantLabel,
  isVariantOptionAvailable,
  selectVariantOption,
} from "../variantSelection";

function attribute(
  code: string,
  name: string,
  optionId: number,
  label: string,
  extra: Partial<ProductVariantAttribute> = {},
): ProductVariantAttribute {
  return {
    attributeId: code === "clothing_size" ? 1 : 4,
    code,
    name,
    optionId,
    label,
    value: label.toLowerCase(),
    swatchHex: null,
    ...extra,
  };
}

function variant(
  overrides: Partial<ProductVariant> & Pick<ProductVariant, "id" | "sku">,
): ProductVariant {
  return {
    size: "",
    price: 200,
    oldPrice: 200,
    stock: 50,
    maxQuantity: 10,
    colorName: null,
    colorHex: null,
    imageUrl: null,
    attributes: [],
    ...overrides,
  };
}

const sizeS = attribute("clothing_size", "Size", 2, "S");
const sizeM = attribute("clothing_size", "Size", 3, "M");
const fitSlim = attribute("clothing_fit", "Fit", 15, "Slim Fit");

const variants: ProductVariant[] = [
  variant({
    id: "33",
    sku: "s-slimfit-black",
    colorName: "black",
    colorHex: "#000000",
    attributes: [sizeS, fitSlim],
  }),
  variant({
    id: "34",
    sku: "m-slim-black",
    colorName: "black",
    colorHex: "#000000",
    attributes: [sizeM, fitSlim],
  }),
  variant({
    id: "35",
    sku: "s-slim-white",
    colorName: "white",
    colorHex: "#FFFFFF",
    attributes: [sizeS, fitSlim],
  }),
];

describe("variant selection", () => {
  it("builds Size, Fit and legacy Color dimensions", () => {
    const dimensions = getVariantDimensions(variants);

    expect(dimensions.map((dimension) => dimension.label)).toEqual([
      "Size",
      "Fit",
      "اللون",
    ]);
    expect(
      dimensions.find((dimension) => dimension.key === "legacy:color")?.options,
    ).toEqual([
      { key: "#000000", label: "black", swatchHex: "#000000" },
      { key: "#ffffff", label: "white", swatchHex: "#FFFFFF" },
    ]);
  });

  it("selects the exact variant even when attributes are shared", () => {
    const dimensions = getVariantDimensions(variants);
    const initial = getDefaultVariantSelection(variants, dimensions);

    expect(initial).toEqual({
      "attribute:clothing_size": "2",
      "attribute:clothing_fit": "15",
      "legacy:color": "#000000",
    });
    expect(findMatchingVariant(variants, dimensions, initial)?.id).toBe("33");

    const white = selectVariantOption(
      variants,
      dimensions,
      initial,
      "legacy:color",
      "#ffffff",
    );

    expect(white["legacy:color"]).toBe("#ffffff");
    expect(findMatchingVariant(variants, dimensions, white)?.id).toBe("35");
  });

  it("falls back to an available color when switching to a size with no white stock", () => {
    const dimensions = getVariantDimensions(variants);
    const whiteS = buildVariantSelection(variants[2], dimensions);

    const next = selectVariantOption(
      variants,
      dimensions,
      whiteS,
      "attribute:clothing_size",
      "3",
    );

    expect(next).toEqual({
      "attribute:clothing_size": "3",
      "attribute:clothing_fit": "15",
      "legacy:color": "#000000",
    });
    expect(findMatchingVariant(variants, dimensions, next)?.id).toBe("34");
  });

  it("disables options with no matching available variant", () => {
    const dimensions = getVariantDimensions(variants);
    const sizeMBlack = buildVariantSelection(variants[1], dimensions);

    expect(
      isVariantOptionAvailable(
        variants,
        dimensions,
        sizeMBlack,
        "legacy:color",
        "#ffffff",
      ),
    ).toBe(false);
    expect(
      isVariantOptionAvailable(
        variants,
        dimensions,
        sizeMBlack,
        "legacy:color",
        "#000000",
      ),
    ).toBe(true);
  });

  it("labels a variant using all dimensions", () => {
    const dimensions = getVariantDimensions(variants);

    expect(getVariantLabel(variants[0], dimensions)).toBe(
      "S / Slim Fit / black",
    );
  });

  it("supports legacy size-only variants", () => {
    const sizeOnly = [
      variant({ id: "1", sku: "50ml", size: "50ml" }),
      variant({ id: "2", sku: "100ml", size: "100ml" }),
    ];
    const dimensions = getVariantDimensions(sizeOnly);

    expect(dimensions).toHaveLength(1);
    expect(dimensions[0].key).toBe("legacy:size");
    expect(dimensions[0].options.map((option) => option.label)).toEqual([
      "50ml",
      "100ml",
    ]);
    expect(
      findMatchingVariant(
        sizeOnly,
        dimensions,
        buildVariantSelection(sizeOnly[1], dimensions),
      )?.id,
    ).toBe("2");
  });

  it("uses color attributes and swatches when color is variant-defining", () => {
    const redBlack = attribute("color", "Color", 21, "Red", {
      swatchHex: "#FF0000",
    });
    const redBlue = attribute("color", "Color", 22, "Blue", {
      swatchHex: "#0000FF",
    });
    const colored = [
      variant({ id: "1", sku: "red", attributes: [redBlack] }),
      variant({ id: "2", sku: "blue", attributes: [redBlue] }),
    ];
    const dimensions = getVariantDimensions(colored);

    expect(dimensions).toHaveLength(1);
    expect(dimensions[0].kind).toBe("attribute");
    expect(dimensions[0].options.map((option) => option.swatchHex)).toEqual([
      "#FF0000",
      "#0000FF",
    ]);
  });
});
