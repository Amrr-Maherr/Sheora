import type { Brand, Category, Product, Review } from "@/types";

export type HomeBadge = {
  icon: string;
  label: string;
};

export type HomeVisibility = {
  announcements: boolean;
  hero: boolean;
  categories: boolean;
  bestSellers: boolean;
  video: boolean;
  beforeAfter: boolean;
  spotlight: boolean;
  brands: boolean;
  reviews: boolean;
  newsletter: boolean;
  secondaryCollection: boolean;
};

export type HomeAnnouncement = {
  id: string;
  message: string;
  icon: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
};

export type HomeHero = {
  mediaType: "video" | "image";
  mediaUrl: string | null;
  posterUrl: string | null;
  mobileMediaUrl: string | null;
  heading: string | null;
  highlight: string | null;
  subtitle: string | null;
  primaryCtaLabel: string | null;
  primaryCtaUrl: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaUrl: string | null;
  badges: HomeBadge[];
};

export type HomeVideo = {
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  ctaLabel: string | null;
  mediaUrl: string | null;
  posterUrl: string | null;
  durationLabel: string | null;
  qualityLabel: string | null;
};

export type HomeMetric = {
  value: string;
  label: string;
};

export type HomeBeforeAfterProduct = {
  id: string;
  name: string;
  slug: string;
  priceFrom: number | null;
  compareAtPriceFrom: number | null;
  primaryImageUrl: string | null;
};

export type HomeBeforeAfterEntry = {
  id: string;
  title: string | null;
  description: string | null;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel: string;
  afterLabel: string;
  metrics: HomeMetric[];
  product: HomeBeforeAfterProduct | null;
};

export type HomeSpotlight = {
  eyebrow: string | null;
  heading: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  product: Product | null;
};

export type HomeNewsletter = {
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  placeholder: string | null;
  buttonLabel: string | null;
  successMessage: string | null;
};

export type HomeSection = {
  key: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export type HomeSections = Record<string, HomeSection>;

export type HomeSecondaryCollection = {
  category: Category | null;
  products: Product[];
};

export type HomeReviews = {
  items: Review[];
  total: number;
};

export type HomeContent = {
  visibility: HomeVisibility;
  announcements: HomeAnnouncement[];
  hero: HomeHero;
  categories: Category[];
  bestSellers: Product[];
  video: HomeVideo;
  beforeAfter: HomeBeforeAfterEntry[];
  spotlight: HomeSpotlight;
  brands: Brand[];
  reviews: HomeReviews;
  newsletter: HomeNewsletter;
  secondaryCollection: HomeSecondaryCollection;
  sectionOrder: string[];
  sections: HomeSections;
};
