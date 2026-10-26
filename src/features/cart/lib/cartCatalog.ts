import type {
  AppliedCoupon,
  CartBadgeTone,
  CartLine,
  CartTotals,
  CartUpsell,
} from "../types";

export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FEE = 60;
export const GIFT_WRAP_FEE = 0;

export const CART_COUPONS: AppliedCoupon[] = [
  { code: "SHEORA10", percent: 10, label: "خصم 10% إضافي" },
  { code: "SHEORA25", percent: 25, label: "خصم 25% إضافي" },
];

export const DEMO_CART_LINES: CartLine[] = [
  {
    id: "demo-oud-nawa",
    productId: "demo-oud-nawa",
    name: "عطر أو دو بارفان نوار فاخر",
    note: "100ml Eau de Parfum Noir • مركز يدوم طويلاً",
    image: "/images/figma/prod_perfume.png",
    href: "/products",
    badge: "عطور",
    badgeTone: "perfume",
    unitPrice: 1299,
    compareAtPrice: 1599,
    quantity: 1,
    customization: "مخصص: حفر ليزر بالاسم «Dr. Yasmine»",
  },
  {
    id: "demo-velvet-lipstick",
    productId: "demo-velvet-lipstick",
    name: "أحمر الشفاه المخملي الفاخر",
    note: "Rouge Velours Matte #07 • ثبات 16 ساعة",
    image: "/images/figma/prod_lipstick.png",
    href: "/products",
    badge: "مكياج",
    badgeTone: "makeup",
    unitPrice: 360,
    quantity: 1,
    swatch: "#8A1A24",
    swatchLabel: "الدرجة الفرنسية الساتان المخملي",
  },
];

export const CART_UPSELL: CartUpsell = {
  id: "demo-eclat-serum",
  name: "سيروم النضارة L'Éclat (30 مل)",
  description: "حمض الهيالورونيك وخلايا النضارة",
  price: 320,
  compareAtPrice: 420,
  image: "/images/figma/prod_serum.png",
  href: "/products",
};

const CATEGORY_LABELS: Record<string, string> = {
  perfumes: "عطور",
  perfume: "عطور",
  makeup: "مكياج",
  skincare: "العناية بالبشرة",
  hair: "العناية بالشعر",
  haircare: "العناية بالشعر",
  body: "العناية بالجسم",
  tools: "أدوات التجميل",
  men: "العناية الرجالية",
};

export function categoryLabel(slug?: string): string | undefined {
  if (!slug) {
    return undefined;
  }

  return CATEGORY_LABELS[slug];
}

export function categoryBadgeTone(slug?: string): CartBadgeTone {
  if (slug === "makeup") {
    return "makeup";
  }

  if (slug === "perfumes" || slug === "perfume") {
    return "perfume";
  }

  return "default";
}

export function upsellToLine(upsell: CartUpsell): CartLine {
  return {
    id: upsell.id,
    productId: upsell.id,
    name: upsell.name,
    note: upsell.description,
    image: upsell.image,
    href: upsell.href,
    badge: "عناية",
    badgeTone: "default",
    unitPrice: upsell.price,
    compareAtPrice: upsell.compareAtPrice,
    quantity: 1,
  };
}

export function findCoupon(code: string): AppliedCoupon | undefined {
  const normalized = code.trim().toUpperCase();

  return CART_COUPONS.find((coupon) => coupon.code === normalized);
}

export function calculateTotals(
  lines: CartLine[],
  coupon: AppliedCoupon | null,
): CartTotals {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const discount = coupon
    ? Math.round((subtotal * coupon.percent) / 100)
    : 0;
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const giftWrap = subtotal > 0 ? GIFT_WRAP_FEE : 0;
  const total = Math.max(0, subtotal - discount + shipping + giftWrap);

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    giftWrap,
    total,
  };
}
