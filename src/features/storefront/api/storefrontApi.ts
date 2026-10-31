import { LARAVEL_API_BASE_URL } from "@/constants/api";
import { DEFAULT_STOREFRONT_SETTINGS } from "../lib/defaults";
import type { HeaderNavigationItem, StorefrontSettings } from "../types";

type BackendStorefrontResponse = {
  success: boolean;
  data: {
    brand: {
      name?: string | null;
      slogan?: string | null;
      logo_type?: "typography" | "image" | null;
      logo_url?: string | null;
      logo_dark_url?: string | null;
      favicon_url?: string | null;
    };
    announcement: {
      is_visible?: boolean | null;
      text?: string | null;
      promo_code?: string | null;
      promo_badge?: string | null;
      link_url?: string | null;
      contact?: {
        phone?: string | null;
        label?: string | null;
      } | null;
      branches?: {
        label?: string | null;
        url?: string | null;
      } | null;
    };
    navigation?: Array<{
      label?: string | null;
      url?: string | null;
      highlight?: boolean | null;
    }> | null;
    footer: {
      pillars_visible?: boolean | null;
      pillars?: Array<{
        icon?: string | null;
        title?: string | null;
        description?: string | null;
      }> | null;
      about_text?: string | null;
      columns?: Array<{
        title?: string | null;
        links?: Array<{
          label?: string | null;
          url?: string | null;
        }> | null;
      }> | null;
      social_links?: Array<{
        platform?: string | null;
        url?: string | null;
      }> | null;
      payment_strip_visible?: boolean | null;
      payment_methods?: string[] | null;
      copyright?: string | null;
    };
    theme?: {
      gold?: string | null;
      gold_hover?: string | null;
      gold_light?: string | null;
      gold_pale?: string | null;
      gold_dark?: string | null;
      obsidian?: string | null;
      obsidian_surface?: string | null;
      background?: string | null;
      foreground?: string | null;
    } | null;
  };
};

export function mapStorefrontSettings(data: BackendStorefrontResponse["data"]): StorefrontSettings {
  const d = DEFAULT_STOREFRONT_SETTINGS;

  return {
    brand: {
      name: data.brand?.name?.trim() || d.brand.name,
      slogan: data.brand?.slogan !== undefined ? data.brand.slogan : d.brand.slogan,
      logoType: data.brand?.logo_type === "image" ? "image" : "typography",
      logoUrl: data.brand?.logo_url || null,
      logoDarkUrl: data.brand?.logo_dark_url || null,
      faviconUrl: data.brand?.favicon_url || null,
    },
    announcement: {
      isVisible: data.announcement?.is_visible ?? d.announcement.isVisible,
      text: data.announcement?.text !== undefined ? data.announcement.text : d.announcement.text,
      promoCode: data.announcement?.promo_code !== undefined ? data.announcement.promo_code : d.announcement.promoCode,
      promoBadge: data.announcement?.promo_badge !== undefined ? data.announcement.promo_badge : d.announcement.promoBadge,
      linkUrl: data.announcement?.link_url !== undefined ? data.announcement.link_url : d.announcement.linkUrl,
      contact: {
        phone: data.announcement?.contact?.phone !== undefined ? data.announcement.contact.phone : d.announcement.contact.phone,
        label: data.announcement?.contact?.label || d.announcement.contact.label,
      },
      branches: {
        label: data.announcement?.branches?.label || d.announcement.branches.label,
        url: data.announcement?.branches?.url || d.announcement.branches.url,
      },
    },
    navigation: Array.isArray(data.navigation) && data.navigation.length > 0
      ? data.navigation
          .filter((item): item is { label: string; url: string; highlight?: boolean | null } => Boolean(item?.label && item?.url))
          .map((item) => ({
            label: item.label,
            url: item.url,
            highlight: Boolean(item.highlight),
          }))
      : d.navigation,
    footer: {
      pillarsVisible: data.footer?.pillars_visible ?? d.footer.pillarsVisible,
      pillars: Array.isArray(data.footer?.pillars) && data.footer.pillars.length > 0
        ? data.footer.pillars
            .filter((p): p is { icon: string; title: string; description: string } => Boolean(p?.title && p?.icon))
            .map((p) => ({
              icon: p.icon,
              title: p.title,
              description: p.description || "",
            }))
        : d.footer.pillars,
      aboutText: data.footer?.about_text !== undefined ? data.footer.about_text : d.footer.aboutText,
      columns: Array.isArray(data.footer?.columns) && data.footer.columns.length > 0
        ? data.footer.columns
            .filter((col): col is { title: string; links?: Array<{ label?: string | null; url?: string | null }> | null } => Boolean(col?.title))
            .map((col) => ({
              title: col.title,
              links: Array.isArray(col.links)
                ? col.links
                    .filter((link): link is { label: string; url: string } => Boolean(link?.label && link?.url))
                    .map((link) => ({ label: link.label, url: link.url }))
                : [],
            }))
        : d.footer.columns,
      socialLinks: Array.isArray(data.footer?.social_links) && data.footer.social_links.length > 0
        ? data.footer.social_links
            .filter((s): s is { platform: string; url: string } => Boolean(s?.platform && s?.url))
            .map((s) => ({ platform: s.platform, url: s.url }))
        : d.footer.socialLinks,
      paymentStripVisible: data.footer?.payment_strip_visible ?? d.footer.paymentStripVisible,
      paymentMethods: Array.isArray(data.footer?.payment_methods) && data.footer.payment_methods.length > 0
        ? data.footer.payment_methods.filter(Boolean)
        : d.footer.paymentMethods,
      copyright: data.footer?.copyright !== undefined ? data.footer.copyright : d.footer.copyright,
    },
    theme: {
      gold: data.theme?.gold || d.theme.gold,
      goldHover: data.theme?.gold_hover || d.theme.goldHover,
      goldLight: data.theme?.gold_light || d.theme.goldLight,
      goldPale: data.theme?.gold_pale || d.theme.goldPale,
      goldDark: data.theme?.gold_dark || d.theme.goldDark,
      obsidian: data.theme?.obsidian || d.theme.obsidian,
      obsidianSurface: data.theme?.obsidian_surface || d.theme.obsidianSurface,
      background: data.theme?.background || d.theme.background,
      foreground: data.theme?.foreground || d.theme.foreground,
    },
  };
}

type NavigationCategory = {
  name?: string | null;
  slug?: string | null;
  product_count?: number | null;
};

export async function getStorefrontNavigation(): Promise<HeaderNavigationItem[]> {
  try {
    const response = await fetch(
      `${LARAVEL_API_BASE_URL}/categories?has_products=1&per_page=20`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60, tags: ["categories"] },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as {
      data?: NavigationCategory[];
    };

    return (Array.isArray(payload.data) ? payload.data : [])
      .filter(
        (category): category is { name: string; slug: string } =>
          Boolean(category.name?.trim() && category.slug?.trim()),
      )
      .slice(0, 10)
      .map((category) => ({
        label: category.name,
        url: `/products?category=${encodeURIComponent(category.slug)}`,
      }));
  } catch (error) {
    console.warn("[Storefront API] Failed to load navigation categories:", error);

    return [];
  }
}

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const response = await fetch(`${LARAVEL_API_BASE_URL}/storefront/settings`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["storefront-settings"] },
    });

    if (!response.ok) {
      console.warn(`[Storefront API] Failed to fetch settings (${response.status}), using defaults.`);
      return DEFAULT_STOREFRONT_SETTINGS;
    }

    const payload = (await response.json()) as BackendStorefrontResponse;

    if (!payload?.success || !payload.data) {
      return DEFAULT_STOREFRONT_SETTINGS;
    }

    return mapStorefrontSettings(payload.data);
  } catch (error) {
    console.warn("[Storefront API] Error fetching settings, falling back to defaults:", error);
    return DEFAULT_STOREFRONT_SETTINGS;
  }
}
