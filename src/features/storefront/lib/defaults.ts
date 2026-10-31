import type { StorefrontSettings } from "../types";

export const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettings = {
  brand: {
    name: "SHEORA",
    slogan: "Create Your Aura",
    logoType: "typography",
    logoUrl: null,
    logoDarkUrl: null,
    faviconUrl: null,
  },
  announcement: {
    isVisible: true,
    text: "للحصول على خصم 25% مع شحن مجاني لكافة الطلبات",
    promoCode: "SHEORA25",
    promoBadge: "خصم 25%",
    linkUrl: "/products?deals=true",
    contact: {
      phone: null,
      label: "خدمة العملاء والاستشارات",
    },
    branches: {
      label: "فروعنا في القاهرة والإسكندرية",
      url: "/stores",
    },
  },
  navigation: [
    { label: "العناية بالبشرة", url: "/products?category=skincare", highlight: false },
    { label: "المكياج", url: "/products?category=makeup", highlight: false },
    { label: "العناية بالشعر", url: "/products?category=hair", highlight: false },
    { label: "العناية بالجسم", url: "/products?category=body", highlight: false },
    { label: "العطور", url: "/products?category=perfumes", highlight: false },
    { label: "أدوات التجميل", url: "/products?category=tools", highlight: false },
    { label: "العناية الرجالية", url: "/products?category=men", highlight: false },
    { label: "العروض الحصرية", url: "/products?deals=true", highlight: true },
  ],
  footer: {
    pillarsVisible: true,
    pillars: [
      {
        icon: "shield-check",
        title: "أصالة مضمونة 100%",
        description: "جميع المنتجات أصلية ومستوردة مباشرة من كبرى دور التجميل",
      },
      {
        icon: "truck",
        title: "توصيل سريع وفخم",
        description: "تغليف هدايا ملكي مجاني وشحن سريع لجميع المحافظات",
      },
      {
        icon: "lock",
        title: "دفع إلكتروني محمي",
        description: "بوابات دفع مشفرة ودعم كامل لوسائل الدفع المصرية",
      },
      {
        icon: "sparkles",
        title: "استشارات تجميلية",
        description: "تواصل مباشر ومجاني مع خبيرات العناية بالبشرة",
      },
    ],
    aboutText:
      "دار شِيورا هي وجهتك الأولى في مصر والشرق الأوسط للعناية الراقية بالبشرة، العطور النيش النادرة، ومستحضرات التجميل المختارة بعناية فائقة لتعكس أناقتك المتفردة.",
    columns: [
      {
        title: "خدمة العملاء",
        links: [
          { label: "تتبع مسار شحنتك", url: "/orders" },
          { label: "سياسة الإرجاع والاستبدال", url: "/returns" },
          { label: "الأسئلة الشائعة", url: "/faq" },
          { label: "استشارة خبير التجميل", url: "/consultation" },
          { label: "فروعنا ونقاط البيع", url: "/stores" },
        ],
      },
      {
        title: "عن دار شِيورا",
        links: [
          { label: "قصتنا وفلسفتنا", url: "/about" },
          { label: "معايير الأصالة والجودة", url: "/authenticity" },
          { label: "برنامج ولاء عملاء شِيورا", url: "/loyalty" },
          { label: "الشروط والأحكام", url: "/terms" },
          { label: "سياسة الخصوصية", url: "/privacy" },
        ],
      },
      {
        title: "التسوق الحصري",
        links: [
          { label: "سيروم وإكسير النضارة", url: "/products?category=skincare" },
          { label: "عطور نيش محدودة الإصدار", url: "/products?category=perfumes" },
          { label: "علاجات إصلاح البشرة", url: "/products?category=treatments" },
          { label: "مجموعات الهدايا الملكية", url: "/products?category=gifts" },
          { label: "العروض والتخفيضات الحصرية", url: "/products?deals=true" },
        ],
      },
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "tiktok", url: "https://tiktok.com" },
    ],
    paymentStripVisible: true,
    paymentMethods: [
      "Instapay",
      "فودافون كاش",
      "Visa / MasterCard",
      "الدفع عند الاستلام",
    ],
    copyright:
      "جميع الحقوق محفوظة © 2026 دار شِيورا للعطور الفاخرة ومستحضرات التجميل SHEORA. صُنعت بكل فخر وإتقان.",
  },
  theme: {
    gold: "#B88A44",
    goldHover: "#A57835",
    goldLight: "#D8A86C",
    goldPale: "#FBF5EC",
    goldDark: "#8C6426",
    obsidian: "#121110",
    obsidianSurface: "#1A1918",
    background: "#FAF9F7",
    foreground: "#151211",
  },
};
