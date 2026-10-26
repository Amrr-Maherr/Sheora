import { LARAVEL_API_BASE_URL } from "@/constants/api";
import {
  mapBrand,
  type LaravelBrand,
} from "@/features/brands/api/brandsApi";
import {
  mapCategory,
  type LaravelCategory,
} from "@/features/categories/api/categoriesApi";
import {
  mapLaravelProduct,
  type LaravelProduct,
} from "@/features/products/api/productMapper";
import {
  mapReview,
  type LaravelReview,
} from "@/features/reviews/api/reviewsApi";
import type {
  HomeAnnouncement,
  HomeBeforeAfterEntry,
  HomeBeforeAfterProduct,
  HomeContent,
  HomeHero,
  HomeMetric,
  HomeNewsletter,
  HomeSection,
  HomeSections,
  HomeSpotlight,
  HomeVideo,
} from "../types";

type LaravelHomeAnnouncement = {
  id: number;
  message: string;
  icon?: string | null;
  link_url?: string | null;
  link_label?: string | null;
};

type LaravelHomeSection = {
  key: string;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
};

type LaravelBeforeAfterProduct = {
  id: number;
  name: string;
  slug: string;
  price_from: string | null;
  compare_at_price_from: string | null;
  primary_image_url?: string | null;
};

type LaravelBeforeAfterEntry = {
  id: number;
  title?: string | null;
  description?: string | null;
  before_image_url: string;
  after_image_url: string;
  before_label?: string | null;
  after_label?: string | null;
  metrics?: Array<{ value?: string | null; label?: string | null }>;
  product?: LaravelBeforeAfterProduct | null;
};

type LaravelHomeData = {
  visibility: {
    announcements: boolean;
    hero: boolean;
    categories: boolean;
    best_sellers: boolean;
    video: boolean;
    before_after: boolean;
    spotlight: boolean;
    brands: boolean;
    reviews: boolean;
    newsletter: boolean;
    secondary_collection: boolean;
  };
  announcements?: LaravelHomeAnnouncement[];
  hero: {
    media_type: string;
    media_url?: string | null;
    poster_url?: string | null;
    mobile_media_url?: string | null;
    heading?: string | null;
    highlight?: string | null;
    subtitle?: string | null;
    primary_cta_label?: string | null;
    primary_cta_url?: string | null;
    secondary_cta_label?: string | null;
    secondary_cta_url?: string | null;
    badges?: Array<{ icon?: string | null; label?: string | null }>;
  };
  categories?: LaravelCategory[];
  best_sellers?: LaravelProduct[];
  video: {
    eyebrow?: string | null;
    heading?: string | null;
    description?: string | null;
    cta_label?: string | null;
    media_url?: string | null;
    poster_url?: string | null;
    duration_label?: string | null;
    quality_label?: string | null;
  };
  before_after?: LaravelBeforeAfterEntry[];
  spotlight: {
    eyebrow?: string | null;
    heading?: string | null;
    subtitle?: string | null;
    cta_label?: string | null;
    product?: LaravelProduct | null;
  };
  brands?: LaravelBrand[];
  reviews: {
    items?: LaravelReview[];
    total: number;
  };
  newsletter: {
    eyebrow?: string | null;
    heading?: string | null;
    description?: string | null;
    placeholder?: string | null;
    button_label?: string | null;
    success_message?: string | null;
  };
  secondary_collection: {
    category?: LaravelCategory | null;
    products?: LaravelProduct[];
  };
  section_order?: string[];
  sections?: Record<string, LaravelHomeSection>;
};

type LaravelHomeResponse = {
  success: boolean;
  message?: string;
  data: LaravelHomeData;
};

type LaravelErrorResponse = {
  message?: string;
  error?: {
    message?: string;
  };
};

function toNumber(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function mapAnnouncement(
  announcement: LaravelHomeAnnouncement,
): HomeAnnouncement {
  return {
    id: String(announcement.id),
    message: announcement.message,
    icon: announcement.icon ?? null,
    linkUrl: announcement.link_url ?? null,
    linkLabel: announcement.link_label ?? null,
  };
}

function mapSection(section: LaravelHomeSection): HomeSection {
  return {
    key: section.key,
    eyebrow: section.eyebrow ?? null,
    title: section.title ?? null,
    subtitle: section.subtitle ?? null,
    ctaLabel: section.cta_label ?? null,
    ctaUrl: section.cta_url ?? null,
  };
}

function mapSections(
  sections: Record<string, LaravelHomeSection> | undefined,
): HomeSections {
  return Object.fromEntries(
    Object.entries(sections ?? {}).map(([key, section]) => [
      key,
      mapSection({ ...section, key: section.key ?? key }),
    ]),
  );
}

function mapHero(hero: LaravelHomeData["hero"]): HomeHero {
  return {
    mediaType: hero.media_type === "image" ? "image" : "video",
    mediaUrl: hero.media_url ?? null,
    posterUrl: hero.poster_url ?? null,
    mobileMediaUrl: hero.mobile_media_url ?? null,
    heading: hero.heading ?? null,
    highlight: hero.highlight ?? null,
    subtitle: hero.subtitle ?? null,
    primaryCtaLabel: hero.primary_cta_label ?? null,
    primaryCtaUrl: hero.primary_cta_url ?? null,
    secondaryCtaLabel: hero.secondary_cta_label ?? null,
    secondaryCtaUrl: hero.secondary_cta_url ?? null,
    badges: (hero.badges ?? [])
      .map((badge) => ({
        icon: badge.icon ?? "",
        label: badge.label ?? "",
      }))
      .filter((badge) => badge.icon !== "" || badge.label !== ""),
  };
}

function mapVideo(video: LaravelHomeData["video"]): HomeVideo {
  return {
    eyebrow: video.eyebrow ?? null,
    heading: video.heading ?? null,
    description: video.description ?? null,
    ctaLabel: video.cta_label ?? null,
    mediaUrl: video.media_url ?? null,
    posterUrl: video.poster_url ?? null,
    durationLabel: video.duration_label ?? null,
    qualityLabel: video.quality_label ?? null,
  };
}

function mapMetric(metric: {
  value?: string | null;
  label?: string | null;
}): HomeMetric {
  return {
    value: metric.value ?? "",
    label: metric.label ?? "",
  };
}

function mapBeforeAfterProduct(
  product: LaravelBeforeAfterProduct,
): HomeBeforeAfterProduct {
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    priceFrom: toNumber(product.price_from),
    compareAtPriceFrom: toNumber(product.compare_at_price_from),
    primaryImageUrl: product.primary_image_url ?? null,
  };
}

function mapBeforeAfterEntry(
  entry: LaravelBeforeAfterEntry,
): HomeBeforeAfterEntry {
  return {
    id: String(entry.id),
    title: entry.title ?? null,
    description: entry.description ?? null,
    beforeImageUrl: entry.before_image_url,
    afterImageUrl: entry.after_image_url,
    beforeLabel: entry.before_label ?? "قبل",
    afterLabel: entry.after_label ?? "بعد",
    metrics: (entry.metrics ?? [])
      .map(mapMetric)
      .filter((metric) => metric.value !== "" || metric.label !== ""),
    product: entry.product ? mapBeforeAfterProduct(entry.product) : null,
  };
}

function mapSpotlight(
  spotlight: LaravelHomeData["spotlight"],
): HomeSpotlight {
  return {
    eyebrow: spotlight.eyebrow ?? null,
    heading: spotlight.heading ?? null,
    subtitle: spotlight.subtitle ?? null,
    ctaLabel: spotlight.cta_label ?? null,
    product: spotlight.product ? mapLaravelProduct(spotlight.product) : null,
  };
}

function mapNewsletter(
  newsletter: LaravelHomeData["newsletter"],
): HomeNewsletter {
  return {
    eyebrow: newsletter.eyebrow ?? null,
    heading: newsletter.heading ?? null,
    description: newsletter.description ?? null,
    placeholder: newsletter.placeholder ?? null,
    buttonLabel: newsletter.button_label ?? null,
    successMessage: newsletter.success_message ?? null,
  };
}

export function mapHomeContent(data: LaravelHomeData): HomeContent {
  return {
    visibility: {
      announcements: Boolean(data.visibility.announcements),
      hero: Boolean(data.visibility.hero),
      categories: Boolean(data.visibility.categories),
      bestSellers: Boolean(data.visibility.best_sellers),
      video: Boolean(data.visibility.video),
      beforeAfter: Boolean(data.visibility.before_after),
      spotlight: Boolean(data.visibility.spotlight),
      brands: Boolean(data.visibility.brands),
      reviews: Boolean(data.visibility.reviews),
      newsletter: Boolean(data.visibility.newsletter),
      secondaryCollection: Boolean(data.visibility.secondary_collection),
    },
    announcements: (data.announcements ?? []).map(mapAnnouncement),
    hero: mapHero(data.hero),
    categories: (data.categories ?? []).map(mapCategory),
    bestSellers: (data.best_sellers ?? []).map(mapLaravelProduct),
    video: mapVideo(data.video),
    beforeAfter: (data.before_after ?? []).map(mapBeforeAfterEntry),
    spotlight: mapSpotlight(data.spotlight),
    brands: (data.brands ?? []).map(mapBrand),
    reviews: {
      items: (data.reviews.items ?? []).map(mapReview),
      total: data.reviews.total ?? 0,
    },
    newsletter: mapNewsletter(data.newsletter),
    secondaryCollection: {
      category: data.secondary_collection.category
        ? mapCategory(data.secondary_collection.category)
        : null,
      products: (data.secondary_collection.products ?? []).map(
        mapLaravelProduct,
      ),
    },
    sectionOrder: (data.section_order ?? []).filter(
      (key): key is string => typeof key === "string",
    ),
    sections: mapSections(data.sections),
  };
}

function errorMessage(payload: LaravelErrorResponse | null): string {
  return (
    payload?.error?.message ??
    payload?.message ??
    "تعذر الاتصال بالخادم. حاولي مرة أخرى."
  );
}

export async function getHomeContent(): Promise<HomeContent> {
  const response = await fetch(`${LARAVEL_API_BASE_URL}/home`, {
    headers: { Accept: "application/json" },
    cache: "force-cache",
    next: { revalidate: 60, tags: ["home"] },
  });

  const payload = (await response.json().catch(() => null)) as
    | LaravelHomeResponse
    | LaravelErrorResponse
    | null;

  if (!response.ok || !payload || !("data" in payload) || !payload.success) {
    throw new Error(errorMessage(payload as LaravelErrorResponse | null));
  }

  return mapHomeContent(payload.data);
}


