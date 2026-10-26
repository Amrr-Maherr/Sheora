const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  men: "/images/figma/prod_perfume.png",
  women: "/images/figma/prod_bottle.png",
  unisex: "/images/figma/brand_serum.png",
  perfume: "/images/figma/prod_perfume.png",
  perfumes: "/images/figma/prod_perfume.png",
  "eau-de-parfum": "/images/figma/prod_perfume.png",
  "eau-de-toilette": "/images/figma/prod_bottle.png",
  luxury: "/images/figma/prod_extra.png",
  "new-arrivals": "/images/figma/prod_vitaminc.png",
  "best-sellers": "/images/figma/prod_serum.png",
  woody: "/images/figma/brand_amber.png",
  floral: "/images/figma/prod_lipgloss.png",
  fresh: "/images/figma/prod_cleanser.png",
  oriental: "/images/figma/brand_balm.png",
  skincare: "/images/figma/cat_skincare.png",
  "face-care": "/images/figma/cat_skincare.png",
  "body-care": "/images/figma/prod_bodymilk.png",
  makeup: "/images/figma/cat_makeup.png",
  eyes: "/images/figma/cat_eyes.png",
  lips: "/images/figma/prod_lipstick.png",
  hair: "/images/figma/prod_cream.png",
};

export const DEFAULT_CATEGORY_IMAGE = "/images/figma/cat_skincare.png";

export function categoryImageFallback(slug: string): string {
  return CATEGORY_IMAGE_FALLBACKS[slug] ?? DEFAULT_CATEGORY_IMAGE;
}
