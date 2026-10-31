export type LogoType = "typography" | "image";

export type BrandSettings = {
  name: string;
  slogan: string | null;
  logoType: LogoType;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
};

export type AnnouncementSettings = {
  isVisible: boolean;
  text: string | null;
  promoCode: string | null;
  promoBadge: string | null;
  linkUrl: string | null;
  contact: {
    phone: string | null;
    label: string | null;
  };
  branches: {
    label: string | null;
    url: string | null;
  };
};

export type HeaderNavigationItem = {
  label: string;
  url: string;
  highlight?: boolean;
};

export type ValuePillar = {
  icon: string;
  title: string;
  description: string;
};

export type FooterColumnLink = {
  label: string;
  url: string;
};

export type FooterColumn = {
  title: string;
  links: FooterColumnLink[];
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type FooterSettings = {
  pillarsVisible: boolean;
  pillars: ValuePillar[];
  aboutText: string | null;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  paymentStripVisible: boolean;
  paymentMethods: string[];
  copyright: string | null;
};

export type ThemeColors = {
  gold: string;
  goldHover: string;
  goldLight: string;
  goldPale: string;
  goldDark: string;
  obsidian: string;
  obsidianSurface: string;
  background: string;
  foreground: string;
};

export type StorefrontSettings = {
  brand: BrandSettings;
  announcement: AnnouncementSettings;
  navigation: HeaderNavigationItem[];
  footer: FooterSettings;
  theme: ThemeColors;
};
