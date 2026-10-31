import { afterEach, describe, expect, it } from "vitest";
import { transformBackendCart } from "../cartCatalog";
import {
  readStoredGuestCart,
  syncStoredGuestQuantities,
  writeStoredGuestCart,
} from "../cartStore";
import { formatCartWarning, formatCartWarnings } from "../cartWarnings";
import { clampQuantity } from "../format";
import type { BackendCartData, BackendCartWarning } from "../../types";

function makeBackendCart(
  overrides: Partial<BackendCartData> = {},
): BackendCartData {
  return {
    items: [],
    item_count: 0,
    currency: "EGP",
    subtotal: "0.00",
    discount_amount: "0.00",
    subtotal_after_discount: "0.00",
    coupon: null,
    shipping: {
      status: "pending",
      governorate: null,
      shipping_fee: "0.00",
      free_shipping_threshold: null,
      is_free_shipping: false,
      message: null,
    },
    total: "0.00",
    quantity_policy: {
      max_item_quantity: 10,
      max_request_quantity: 99,
    },
    warnings: [],
    ...overrides,
  };
}

function makeItem(quantity: number, variantId = 7) {
  return {
    id: 1,
    variant_id: variantId,
    product_id: 1,
    product_slug: "rose",
    name: "Rose",
    sku: "SKU-ROSE",
    unit_price: "100.00",
    quantity,
    line_subtotal: `${quantity * 100}.00`,
    stock_available: 20,
    is_available: true,
  };
}

function installFakeWindow(): Map<string, string> {
  const storage = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
  };

  (globalThis as { window?: unknown }).window = { localStorage };

  return storage;
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("cart quantity policy helpers", () => {
  it("uses the backend quantity policy for cart limits", () => {
    const transformed = transformBackendCart(
      makeBackendCart({
        items: [makeItem(4)],
        item_count: 4,
        quantity_policy: {
          max_item_quantity: 4,
          max_request_quantity: 50,
        },
      }),
    );

    expect(transformed.maxItemQuantity).toBe(4);
    expect(transformed.maxRequestQuantity).toBe(50);
    expect(transformed.lines[0]?.quantity).toBe(4);
  });

  it("keeps quantities below the defensive ceiling before the backend responds", () => {
    expect(clampQuantity(120)).toBe(99);
    expect(clampQuantity(15, 50)).toBe(15);
    expect(clampQuantity(Number.NaN)).toBe(1);
  });

  it("formats maximum-limit adjustments in arabic", () => {
    const warning: BackendCartWarning = {
      code: "QUANTITY_ADJUSTED",
      variant_id: 7,
      requested: 15,
      applied: 4,
      reason: "MAX_ITEM_QUANTITY",
      message: "ignored",
    };

    const message = formatCartWarning(warning, "ar");

    expect(message).toContain("4");
    expect(message).toContain("الحد الأقصى");
  });

  it("formats stock adjustments in english", () => {
    const warning: BackendCartWarning = {
      code: "QUANTITY_ADJUSTED",
      variant_id: 7,
      requested: 5,
      applied: 2,
      reason: "INSUFFICIENT_STOCK",
      message: "ignored",
    };

    expect(formatCartWarning(warning, "en")).toBe(
      "Quantity adjusted to the available stock (2).",
    );
  });

  it("falls back to the backend message for non-quantity warnings", () => {
    const warning: BackendCartWarning = {
      code: "OUT_OF_STOCK",
      variant_id: 7,
      message: "An item is out of stock and was excluded.",
    };

    expect(formatCartWarnings([warning], "ar")).toEqual([
      "An item is out of stock and was excluded.",
    ]);
  });
});

describe("guest cart synchronization", () => {
  it("stores the backend-applied quantities and drops unavailable items", () => {
    installFakeWindow();
    writeStoredGuestCart({
      items: [
        { product_variant_id: 7, quantity: 99 },
        { product_variant_id: 8, quantity: 3 },
      ],
      couponCode: "SAVE",
      governorateSlug: "cairo",
    });

    syncStoredGuestQuantities(
      makeBackendCart({
        items: [makeItem(4)],
        item_count: 4,
        quantity_policy: {
          max_item_quantity: 4,
          max_request_quantity: 99,
        },
      }),
    );

    expect(readStoredGuestCart()).toEqual({
      items: [{ product_variant_id: 7, quantity: 4 }],
      couponCode: "SAVE",
      governorateSlug: "cairo",
    });
  });
});
