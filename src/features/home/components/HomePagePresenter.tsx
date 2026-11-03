"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  X,
  ShoppingBag,
  Star,
  Quote,
  BadgeCheck,
  Building2,
  Flame,
  Package,
  Truck,
  Gift,
  ShieldCheck,
  Leaf,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { ProductCard } from "@/features/products/components/ProductCard";
import { laravelProductHref } from "@/features/products/lib/laravelProductHref";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { subscribeToNewsletter } from "../api/newsletterApi";
import { homeSectionOrderStyle } from "../lib/sectionOrder";
import type {
  HomeBeforeAfterEntry,
  HomeContent,
  HomeSection,
} from "../types";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

const announcementIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  gift: Gift,
  truck: Truck,
  package: Package,
  flame: Flame,
  star: Star,
  leaf: Leaf,
  "badge-check": BadgeCheck,
  shield: ShieldCheck,
};

const heroBadgeIcons: Record<string, LucideIcon> = {
  ...announcementIcons,
  "shield-check": ShieldCheck,
};

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function sectionCopy(
  sections: Record<string, HomeSection>,
  key: string,
  fallback: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    ctaLabel?: string;
    ctaUrl?: string;
  },
) {
  const section = sections[key];
  const text = (value: string | null | undefined, defaultValue: string) =>
    value?.trim() ? value : defaultValue;

  return {
    eyebrow: text(section?.eyebrow, fallback.eyebrow ?? ""),
    title: text(section?.title, fallback.title),
    subtitle: text(section?.subtitle, fallback.subtitle),
    ctaLabel: text(section?.ctaLabel, fallback.ctaLabel ?? ""),
    ctaUrl: section?.ctaUrl?.trim() || fallback.ctaUrl || "",
  };
}

function BeforeAfterCard({ entry }: { entry: HomeBeforeAfterEntry }) {
  const product = entry.product;
  const productHref = product ? laravelProductHref(product) : null;
  const hasDiscount =
    product?.priceFrom != null &&
    product.compareAtPriceFrom != null &&
    product.compareAtPriceFrom > product.priceFrom;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F7] rounded-3xl p-6 sm:p-8 border border-[#EDE8E3]">
      <div className="lg:col-span-7">
        <BeforeAfterSlider
          beforeImage={entry.beforeImageUrl}
          afterImage={entry.afterImageUrl}
          beforeLabel={entry.beforeLabel}
          afterLabel={entry.afterLabel}
          ariaLabel={`مقارنة ${entry.beforeLabel} و${entry.afterLabel} — ${entry.title ?? "نتائج العناية"}`}
        />
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-16 rounded-xl bg-white border border-[#EDE8E3] p-1 shrink-0 flex items-center justify-center">
            {product?.primaryImageUrl ? (
              <img
                src={product.primaryImageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Sparkles className="size-6 text-[#B88A44]" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#B88A44] block">
              {entry.title ?? "العناية المتطورة"}
            </span>
            <h3 className="font-alexandria text-base font-bold text-[#151211]">
              {product?.name ?? "نتيجة موثقة"}
            </h3>
            {product ? (
              <span className="text-[11px] text-[#8C827A]">
                {productHref ? "تركيبة عناية فاخرة" : ""}
              </span>
            ) : null}
          </div>
        </div>

        {entry.description ? (
          <p className="text-[13px] text-[#6E6761] leading-relaxed">
            {entry.description}
          </p>
        ) : null}

        {entry.metrics.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {entry.metrics.slice(0, 3).map((metric, index) => (
              <div
                key={`${metric.value}-${metric.label}-${index}`}
                className="p-3 rounded-xl bg-white border border-[#EDE8E3] text-center"
              >
                <span
                  className={`font-alexandria text-xl font-extrabold block ${
                    index === 2 ? "text-[#2A7A4D]" : "text-[#B88A44]"
                  }`}
                >
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#78716C] mt-0.5 block">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="pt-2">
          {product?.priceFrom != null && product.priceFrom > 0 ? (
            <div className="flex flex-wrap items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#151211]">
                {formatPrice(product.priceFrom)} ج.م
              </span>
              {hasDiscount && product.compareAtPriceFrom != null ? (
                <>
                  <span className="text-[13px] text-[#A8A19B] line-through">
                    {formatPrice(product.compareAtPriceFrom)} ج.م
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#B94727]/10 text-[#B94727] text-[11px] font-bold">
                    وفر {formatPrice(product.compareAtPriceFrom - product.priceFrom)} ج.م
                  </span>
                </>
              ) : null}
            </div>
          ) : null}

          {productHref ? (
            <Link
              href={productHref}
              className="w-full h-11 rounded-xl bg-[#B88A44] hover:bg-[#A57835] text-white font-medium text-[13px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag className="size-4" />
              <span>عرض المنتج</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type HomePagePresenterProps = {
  home: HomeContent | null;
  hasError: boolean;
};

export function HomePagePresenter({ home, hasError }: HomePagePresenterProps) {
  const isMobileViewport = useIsMobileViewport();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  if (hasError || !home) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#FAF9F7] px-4 text-center">
        <div className="mb-8 flex flex-col items-center">
          <span className="font-playfair text-3xl font-bold tracking-[0.18em] text-[#151211]">
            SHEORA
          </span>
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-[#B88A44]">
            Create Your Aura
          </span>
        </div>
        <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-white text-[#B88A44] shadow-sm">
          <RefreshCw className="size-6" />
        </span>
        <h1 className="font-alexandria text-2xl font-bold text-[#151211]">
          تعذر تحميل الصفحة الرئيسية
        </h1>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[#78716C]">
          حدث خطأ أثناء جلب محتوى المتجر. حاولي تحديث الصفحة بعد لحظات.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#B88A44] px-7 text-[13px] font-medium text-white transition-colors hover:bg-[#A57835]"
        >
          إعادة المحاولة
        </Link>
      </div>
    );
  }

  const content = home;
  const { visibility } = content;
  const sectionStyle = (key: string) =>
    homeSectionOrderStyle(content.sectionOrder, key);
  const heroMediaUrl =
    isMobileViewport && content.hero.mobileMediaUrl
      ? content.hero.mobileMediaUrl
      : content.hero.mediaUrl;

  const heroHeading = content.hero.heading ?? "عطور وأزياء.";
  const heroHighlight = content.hero.highlight ?? "لأناقةٍ لا تُنسى.";
  const heroSubtitle =
    content.hero.subtitle ??
    "عطور فاخرة وقمصان وبناطيل مختارة بعناية — جودة عالية وتفاصيل عصرية تناسب كل يوم.";
  const heroBadges =
    content.hero.badges.length > 0
      ? content.hero.badges
      : [
          { icon: "badge-check", label: "منتجات أصلية" },
          { icon: "package", label: "تغليف أنيق مجاني" },
          { icon: "truck", label: "شحن سريع وآمن" },
        ];

  const categoriesSection = sectionCopy(content.sections, "curated_categories", {
    title: "المجموعات المختارة بعناية",
    subtitle: `طقوس جمال متكاملة من أرقى المكونات الطبيعية النادرة — ${content.categories.length} مجموعة فاخرة`,
    ctaLabel: "عرض كل التصنيفات",
    ctaUrl: "/categories",
  });
  const bestSellersSection = sectionCopy(content.sections, "best_sellers", {
    title: "الأكثر طلباً الآن",
    subtitle: "إبداعات شِيورا الأكثر تميزاً وإقبالاً هذا الموسم",
    ctaLabel: "عرض كافة المنتجات",
    ctaUrl: "/products",
  });
  const beforeAfterSection = sectionCopy(content.sections, "before_after", {
    eyebrow: "فعالية مثبتة سريرياً",
    title: "نتائج استثنائية ملحوظة — قبل وبعد",
    subtitle:
      "شاهد التحول الحقيقي في نضارة البشرة ومرونتها بفضل تركيبة إكسير الشباب المركزة",
  });
  const brandsSection = sectionCopy(content.sections, "featured_brands", {
    eyebrow: "دور العطور العالمية",
    title: "أرقى الدور العالمية",
    subtitle: `شركاؤنا من بيوت العطور الفاخرة — ${content.brands.length} داراً عالمية`,
    ctaLabel: "استكشف كل الماركات",
    ctaUrl: "/brands",
  });
  const reviewsSection = sectionCopy(content.sections, "reviews", {
    eyebrow: "آراء عملائنا",
    title: "ماذا يقول عشاق شِيورا",
    subtitle: `تجارب حقيقية من عملاء وثقوا بجودة منتجاتنا — ${content.reviews.total} تقييم`,
    ctaLabel: "تصفح كل التقييمات",
    ctaUrl: "/products",
  });
  const secondarySection = sectionCopy(content.sections, "secondary_collection", {
    title: "العناية بالوجه والجسم",
    subtitle:
      "كل ما تحتاجينه لبشرة مفعمة بالحيوية والنعومة الفائقة",
    ctaLabel: "استكشف الطقوس كاملة",
    ctaUrl: content.secondaryCollection.category
      ? `/categories/${content.secondaryCollection.category.slug}`
      : "/products",
  });

  const displayCategories = content.categories;
  const displayBrands = content.brands;
  const spotlightProduct = content.spotlight.product;
  const spotlightHref = spotlightProduct
    ? laravelProductHref(spotlightProduct)
    : null;
  const spotlightPrice = spotlightProduct?.priceFrom ?? spotlightProduct?.price;
  const spotlightCompareAt =
    spotlightProduct?.compareAtPriceFrom ?? spotlightProduct?.oldPrice;
  const spotlightHasPrice =
    spotlightPrice !== null &&
    spotlightPrice !== undefined &&
    spotlightPrice > 0;
  const spotlightHasDiscount =
    spotlightHasPrice &&
    spotlightCompareAt != null &&
    spotlightCompareAt > spotlightPrice;

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || newsletterStatus === "loading") {
      return;
    }

    setNewsletterStatus("loading");
    setNewsletterMessage("");

    try {
      const result = await subscribeToNewsletter(email.trim());
      setNewsletterStatus("success");
      setNewsletterMessage(
        result.alreadySubscribed
          ? "بريدك مسجل بالفعل في قائمة النخبة."
          : content.newsletter.successMessage ??
              "تم تسجيل اشتراكك بنجاح في نادي النخبة. تفقد بريدك لتفعيل المزايا!",
      );
      setEmail("");
    } catch (error) {
      setNewsletterStatus("error");
      setNewsletterMessage(
        error instanceof Error
          ? error.message
          : "تعذر إتمام الاشتراك. حاولي مرة أخرى.",
      );
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#FAF9F7] overflow-hidden">
      {visibility.announcements && content.announcements.length > 0 ? (
        <section
          className="overflow-hidden border-b border-[#EDE7DF] bg-[#FAF7F2] py-2.5"
          style={sectionStyle("announcements")}
          aria-label="شريط إعلانات المتجر"
        >
          <div className="flex w-full overflow-hidden" dir="ltr">
            <div className="animate-sheora-marquee flex items-center whitespace-nowrap px-4 text-[12px] font-medium text-[#8C6426] md:text-[13px]">
              {[0, 1].map((copy) => (
                <p
                  key={copy}
                  className="flex shrink-0 items-center gap-10 pe-10"
                  dir="rtl"
                  aria-hidden={copy === 1}
                >
                  {content.announcements.map((announcement) => {
                    const Icon =
                      announcementIcons[announcement.icon ?? ""] ?? Sparkles;

                    return (
                      <span
                        key={`${copy}-${announcement.id}`}
                        className="flex shrink-0 items-center gap-10"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="size-3.5 shrink-0 text-[#B88A44]" />
                          {announcement.linkUrl ? (
                            <Link
                              href={announcement.linkUrl}
                              className="transition-colors hover:text-[#B88A44]"
                            >
                              {announcement.message}
                            </Link>
                          ) : (
                            announcement.message
                          )}
                        </span>
                        <span className="text-[#D4C4B0]" aria-hidden>
                          ✦
                        </span>
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visibility.hero ? (
        <section
          className="relative w-full h-[520px] md:h-[580px] overflow-hidden flex items-center border-b border-[#d2c3c4]/10 bg-black"
          style={sectionStyle("hero")}
          dir="rtl"
        >
          {heroMediaUrl ? (
            content.hero.mediaType === "image" ? (
              <img
                src={heroMediaUrl}
                alt={heroHeading}
                className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
              />
            ) : (
              <video
                key={heroMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                poster={content.hero.posterUrl ?? undefined}
                className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
                src={heroMediaUrl}
              />
            )
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-l from-[#2B2118] via-[#151211] to-black" />
          )}

          <div className="absolute inset-0 z-10 bg-gradient-to-l from-black/70 via-black/40 to-black/10 pointer-events-none" />

          <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <h1 className="font-alexandria text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
                {heroHeading}
                <br />
                <span className="text-[#e8b577] drop-shadow-sm">
                  {heroHighlight}
                </span>
              </h1>

              <p className="text-white/90 text-sm md:text-lg leading-relaxed mt-6 mb-8 max-w-xl font-sans">
                {heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                {content.hero.primaryCtaLabel && content.hero.primaryCtaUrl ? (
                  <Link
                    href={content.hero.primaryCtaUrl}
                    className="inline-flex items-center justify-center gap-2 bg-[#b88a44] hover:bg-[#a67b3b] text-white font-medium text-sm md:text-base px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span>{content.hero.primaryCtaLabel}</span>
                    <ArrowLeft className="size-4" />
                  </Link>
                ) : null}

                {content.hero.secondaryCtaLabel &&
                content.hero.secondaryCtaUrl ? (
                  <Link
                    href={content.hero.secondaryCtaUrl}
                    className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm md:text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span>{content.hero.secondaryCtaLabel}</span>
                    <Flame className="size-4 text-[#e8b577]" />
                  </Link>
                ) : null}
              </div>

              {heroBadges.length > 0 ? (
                <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-white/80 pt-4 border-t border-white/20">
                  {heroBadges.map((badge, index) => {
                    const Icon = heroBadgeIcons[badge.icon] ?? Sparkles;

                    return (
                      <div
                        key={`${badge.icon}-${badge.label}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <Icon className="size-4 text-[#e8b577]" />
                        <span>{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {visibility.categories ? (
        <section
          className="py-16 md:py-20 bg-white border-y border-[#F0EBE5]"
          style={sectionStyle("curated_categories")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                {categoriesSection.title}
              </h2>
              <p className="text-[14px] text-[#78716C]">
                {categoriesSection.subtitle}
              </p>
            </div>

            {displayCategories.length === 0 ? (
              <p className="text-center text-[14px] text-[#78716C] py-12">
                لا توجد مجموعات متاحة حالياً
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {displayCategories.map((category, idx) => {
                  const spanClass =
                    idx === 0 ? "md:col-span-6" : "md:col-span-3";
                  const imgSrc = category.image;
                  const isLarge = idx === 0;

                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className={`${spanClass} group relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all`}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#EDE8E3]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151211]/85 via-[#151211]/20 to-transparent" />
                      <div
                        className={`absolute bottom-6 right-6 left-6 space-y-1 text-white ${
                          isLarge ? "text-right" : "text-center"
                        }`}
                      >
                        <span
                          className="text-[11px] font-semibold text-[#E8B577] tracking-wider uppercase flex items-center gap-1.5 justify-center data-[large=true]:justify-start [&[data-large=true]]:justify-start"
                          data-large={isLarge}
                        >
                          <Sparkles className="size-3 text-[#E8B577]" />
                          {category.productCount} منتج • {category.slug}
                        </span>
                        <h3
                          className={`font-alexandria font-bold group-hover:text-[#E8B577] transition-colors ${
                            isLarge ? "text-xl sm:text-2xl" : "text-lg"
                          }`}
                        >
                          {category.name}
                        </h3>
                        <p
                          className={`text-[12px] text-white/80 line-clamp-2 leading-relaxed ${
                            isLarge ? "max-w-[420px]" : ""
                          }`}
                        >
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {categoriesSection.ctaLabel && categoriesSection.ctaUrl ? (
              <div className="text-center mt-8">
                <Link
                  href={categoriesSection.ctaUrl}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] transition-colors"
                >
                  <span>{categoriesSection.ctaLabel}</span>
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {visibility.bestSellers ? (
        <section
          className="py-16 md:py-20"
          style={sectionStyle("best_sellers")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EDE8E3]">
              <div>
                <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                  {bestSellersSection.title}
                </h2>
                <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">
                  {bestSellersSection.subtitle}
                </p>
              </div>
              {bestSellersSection.ctaLabel && bestSellersSection.ctaUrl ? (
                <Link
                  href={bestSellersSection.ctaUrl}
                  className="text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] flex items-center gap-1.5 transition-colors"
                >
                  <span>{bestSellersSection.ctaLabel}</span>
                  <ArrowLeft className="size-4" />
                </Link>
              ) : null}
            </div>

            {content.bestSellers.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-[#78716C]">
                لا توجد منتجات متاحة حالياً.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {content.bestSellers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="home"
                    detailHref={laravelProductHref(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {visibility.video ? (
        <section
          className="relative w-full py-20 bg-[#0E0D0C] text-white overflow-hidden"
          style={sectionStyle("video")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              {content.video.eyebrow ? (
                <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-widest block">
                  {content.video.eyebrow}
                </span>
              ) : null}
              <h2 className="font-alexandria text-3xl sm:text-4xl font-extrabold text-white">
                {content.video.heading ??
                  "The Essence of SHEORA — الفخامة الاستثنائية"}
              </h2>
              {content.video.description ? (
                <p className="text-[13px] sm:text-[14px] text-[#9E9791]">
                  {content.video.description}
                </p>
              ) : null}
            </div>

            <div className="relative max-w-[1040px] mx-auto aspect-video rounded-3xl overflow-hidden border border-[#2B2825] shadow-2xl group">
              <img
                src={content.video.posterUrl ?? "/images/figma/video_poster.png"}
                alt="SHEORA Cinematic Luxury Commercial"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {content.video.mediaUrl ? (
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    aria-label={content.video.ctaLabel ?? "تشغيل الفيلم"}
                    className="flex size-20 sm:size-24 items-center justify-center rounded-full bg-[#B88A44] hover:bg-[#D8A86C] text-white shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Play className="size-8 sm:size-10 fill-white ml-1 text-white" />
                  </button>
                ) : null}
                <span className="text-[14px] font-medium tracking-wide text-white drop-shadow-md">
                  {content.video.ctaLabel ?? "شاهد مجموعة خريف 2026"}
                </span>
              </div>

              <div className="absolute bottom-5 left-6 flex items-center gap-2 text-[11px] text-[#D5CFC9]">
                {content.video.durationLabel ? (
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/15">
                    {content.video.durationLabel}
                  </span>
                ) : null}
                {content.video.qualityLabel ? (
                  <span className="px-2.5 py-1 rounded bg-[#B88A44] text-white font-bold">
                    {content.video.qualityLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isVideoModalOpen && content.video.mediaUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#333]">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 left-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="size-5" />
            </button>
            <video
              className="w-full h-full"
              src={content.video.mediaUrl}
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      ) : null}

      {visibility.beforeAfter && content.beforeAfter.length > 0 ? (
        <section
          className="py-20 bg-white border-b border-[#EDE8E3]"
          style={sectionStyle("before_after")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              {beforeAfterSection.eyebrow ? (
                <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-wider block">
                  {beforeAfterSection.eyebrow}
                </span>
              ) : null}
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                {beforeAfterSection.title}
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#78716C]">
                {beforeAfterSection.subtitle}
              </p>
            </div>

            <div className="space-y-8">
              {content.beforeAfter.map((entry) => (
                <BeforeAfterCard key={entry.id} entry={entry} />
              ))}
            </div>

            {beforeAfterSection.ctaLabel && beforeAfterSection.ctaUrl ? (
              <div className="text-center mt-8">
                <Link
                  href={beforeAfterSection.ctaUrl}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] transition-colors"
                >
                  <span>{beforeAfterSection.ctaLabel}</span>
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {visibility.spotlight && spotlightProduct ? (
        <section
          className="py-20 bg-white border-b border-[#EDE8E3]"
          style={sectionStyle("spotlight")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              {content.spotlight.eyebrow ? (
                <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-wider block">
                  {content.spotlight.eyebrow}
                </span>
              ) : null}
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                {content.spotlight.heading ?? "اختيار شِيورا لهذا الأسبوع"}
              </h2>
              {content.spotlight.subtitle ? (
                <p className="text-[13px] sm:text-[14px] text-[#78716C]">
                  {content.spotlight.subtitle}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F7] rounded-3xl p-6 sm:p-8 border border-[#EDE8E3]">
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#EDE8E3] bg-white">
                  {spotlightProduct.images?.[0] ? (
                    <img
                      src={spotlightProduct.images[0]}
                      alt={spotlightProduct.name}
                      className="h-full w-full object-contain p-8"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[13px] text-[#8C827A]">
                      لا توجد صورة متاحة
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-[11px] font-semibold text-[#B88A44] block">
                    {spotlightProduct.brandName ?? "شِيورا"}
                  </span>
                  <h3 className="font-alexandria text-xl sm:text-2xl font-bold text-[#151211]">
                    {spotlightProduct.name}
                  </h3>
                  {spotlightProduct.size ? (
                    <span className="text-[11px] text-[#8C827A]">
                      {spotlightProduct.size}
                    </span>
                  ) : null}
                </div>

                {spotlightProduct.shortDescription ||
                spotlightProduct.description ? (
                  <p className="text-[13px] text-[#6E6761] leading-relaxed">
                    {spotlightProduct.shortDescription ??
                      spotlightProduct.description}
                  </p>
                ) : null}

                <div className="pt-2">
                  {spotlightHasPrice ? (
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-[#151211]">
                        {formatPrice(spotlightPrice ?? 0)} ج.م
                      </span>
                      {spotlightHasDiscount ? (
                        <>
                          <span className="text-[13px] text-[#A8A19B] line-through">
                            {formatPrice(spotlightCompareAt ?? 0)} ج.م
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#B94727]/10 text-[#B94727] text-[11px] font-bold">
                            خصم{" "}
                            {Math.round(
                              (((spotlightCompareAt ?? 0) -
                                (spotlightPrice ?? 0)) /
                                (spotlightCompareAt ?? 1)) *
                                100,
                            )}
                            %
                          </span>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mb-3 text-[13px] text-[#8C827A]">
                      السعر غير متوفر حالياً
                    </p>
                  )}

                  {spotlightHref ? (
                    <Link
                      href={spotlightHref}
                      className="w-full h-11 rounded-xl bg-[#B88A44] hover:bg-[#A57835] text-white font-medium text-[13px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <ShoppingBag className="size-4" />
                      <span>
                        {content.spotlight.ctaLabel ?? "عرض المنتج"}
                      </span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {visibility.secondaryCollection &&
      content.secondaryCollection.category &&
      content.secondaryCollection.products.length > 0 ? (
        <section
          className="py-16 md:py-20"
          style={sectionStyle("secondary_collection")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EDE8E3]">
              <div>
                <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                  {secondarySection.title}
                </h2>
                <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">
                  {secondarySection.subtitle}
                </p>
              </div>
              {secondarySection.ctaLabel && secondarySection.ctaUrl ? (
                <Link
                  href={secondarySection.ctaUrl}
                  className="text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] flex items-center gap-1.5 transition-colors"
                >
                  <span>{secondarySection.ctaLabel}</span>
                  <ArrowLeft className="size-4" />
                </Link>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.secondaryCollection.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="home"
                  detailHref={laravelProductHref(product)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visibility.brands ? (
        <section
          className="py-16 md:py-20 bg-white border-y border-[#F0EBE5]"
          style={sectionStyle("featured_brands")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EDE8E3]">
              <div>
                {brandsSection.eyebrow ? (
                  <div className="inline-flex items-center gap-2 text-[#B88A44] text-[11px] font-semibold tracking-widest uppercase mb-2">
                    <Building2 className="size-3.5" />
                    <span>{brandsSection.eyebrow}</span>
                  </div>
                ) : null}
                <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                  {brandsSection.title}
                </h2>
                <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">
                  {brandsSection.subtitle}
                </p>
              </div>
              {brandsSection.ctaLabel && brandsSection.ctaUrl ? (
                <Link
                  href={brandsSection.ctaUrl}
                  className="text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] flex items-center gap-1.5 transition-colors"
                >
                  <span>{brandsSection.ctaLabel}</span>
                  <ArrowLeft className="size-4" />
                </Link>
              ) : null}
            </div>

            {displayBrands.length === 0 ? (
              <p className="text-center text-[14px] text-[#78716C] py-12">
                لا توجد ماركات متاحة
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {displayBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-[#FAF9F7] border border-[#EDE8E3] hover:bg-white hover:border-[#B88A44]/30 hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    {brand.featured ? (
                      <span className="absolute top-3 right-3 px-1.5 py-0.5 rounded-full bg-[#B88A44] text-white text-[9px] font-bold">
                        مميز
                      </span>
                    ) : null}
                    <div className="size-16 rounded-xl bg-white border border-[#EDE8E3] p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:border-[#B88A44]/20 transition-colors">
                      {brand.image ? (
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[11px] text-[#A8A19B]">
                          {brand.name.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-alexandria text-[13px] font-bold text-[#151211] group-hover:text-[#B88A44] transition-colors line-clamp-1">
                      {brand.name}
                    </h3>
                    {brand.country || brand.founded ? (
                      <span className="text-[11px] text-[#8C827A] flex items-center gap-1 mt-0.5">
                        {[brand.country, brand.founded || null]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    ) : null}
                    {brand.description ? (
                      <span className="text-[10px] text-[#78716C] line-clamp-2 mt-1 leading-relaxed">
                        {brand.description.slice(0, 60)}
                        {brand.description.length > 60 ? "..." : ""}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {visibility.reviews ? (
        <section
          className="py-16 md:py-20 bg-[#FAF9F7]"
          style={sectionStyle("reviews")}
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              {reviewsSection.eyebrow ? (
                <span className="text-[11px] font-semibold text-[#B88A44] uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Star className="size-3.5 fill-[#B88A44] text-[#B88A44]" />
                  {reviewsSection.eyebrow}
                </span>
              ) : null}
              <h2 className="font-alexandria text-2xl sm:text-3xl font-bold text-[#151211]">
                {reviewsSection.title}
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#78716C]">
                {reviewsSection.subtitle}
              </p>
            </div>

            {content.reviews.items.length === 0 ? (
              <p className="text-center text-[14px] text-[#78716C] py-12">
                لا توجد تقييمات بعد — كن أول من يقيّم
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.reviews.items.map((review) => (
                  <div
                    key={review.id}
                    className="relative p-6 rounded-2xl bg-white border border-[#EDE8E3] hover:border-[#B88A44]/20 hover:shadow-lg transition-all flex flex-col"
                  >
                    <Quote className="absolute top-5 left-5 size-6 text-[#B88A44]/15" />
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`size-4 ${
                            index < review.rating
                              ? "fill-[#B88A44] text-[#B88A44]"
                              : "text-[#EDE8E3]"
                          }`}
                        />
                      ))}
                      <span className="text-[11px] font-medium text-[#8C6426] mr-1">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="font-alexandria text-[14px] font-bold text-[#151211] mb-1.5 line-clamp-1">
                      {review.title}
                    </h3>
                    <p className="text-[13px] text-[#6E6761] leading-relaxed line-clamp-3 flex-1">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0EBE5]">
                      <div>
                        <span className="text-[13px] font-semibold text-[#151211] block">
                          {review.userName}
                        </span>
                        <span className="text-[11px] text-[#8C827A]">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(
                                "ar-EG",
                              )
                            : ""}
                        </span>
                      </div>
                      {review.verifiedPurchase ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#2A7A4D]/10 text-[#2A7A4D] text-[10px] font-semibold">
                          <BadgeCheck className="size-3" />
                          شراء موثّق
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewsSection.ctaLabel && reviewsSection.ctaUrl ? (
              <div className="text-center mt-8">
                <Link
                  href={reviewsSection.ctaUrl}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A44] hover:text-[#8C6426] transition-colors"
                >
                  <span>{reviewsSection.ctaLabel}</span>
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {visibility.newsletter ? (
        <section
          className="py-16 bg-[#171615] text-white border-t border-[#262422]"
          style={sectionStyle("newsletter")}
        >
          <div className="mx-auto max-w-[960px] px-4 sm:px-6 text-center space-y-6">
            {content.newsletter.eyebrow ? (
              <span className="text-[11px] font-semibold text-[#B88A44] tracking-widest uppercase">
                {content.newsletter.eyebrow}
              </span>
            ) : null}

            <h2 className="font-alexandria text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug">
              {content.newsletter.heading ??
                "انضم إلى قائمة النخبة واحصل على مزايا خاصة"}
            </h2>

            {content.newsletter.description ? (
              <p className="text-[13px] sm:text-[14px] text-[#A8A19B] max-w-xl mx-auto leading-relaxed">
                {content.newsletter.description}
              </p>
            ) : null}

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (newsletterStatus !== "idle") {
                    setNewsletterStatus("idle");
                    setNewsletterMessage("");
                  }
                }}
                placeholder={
                  content.newsletter.placeholder ??
                  "أدخل بريدك الإلكتروني..."
                }
                disabled={newsletterStatus === "loading"}
                className="w-full sm:flex-1 h-12 px-5 rounded-full bg-white/5 border border-white/15 text-[13px] text-white placeholder:text-[#78716C] focus:outline-none focus:border-[#B88A44] focus:ring-1 focus:ring-[#B88A44] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                aria-busy={newsletterStatus === "loading"}
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#B88A44] hover:bg-[#A57835] text-white font-medium text-[13px] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {newsletterStatus === "loading"
                  ? "جارٍ الاشتراك..."
                  : content.newsletter.buttonLabel ?? "اشتراك"}
              </button>
            </form>

            {newsletterStatus === "success" && newsletterMessage ? (
              <p className="text-[12px] text-[#2A7A4D] flex items-center justify-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4" />
                <span>{newsletterMessage}</span>
              </p>
            ) : null}

            {newsletterStatus === "error" && newsletterMessage ? (
              <p className="text-[12px] text-[#E0A090] flex items-center justify-center gap-1.5 font-medium">
                <X className="size-4" />
                <span>{newsletterMessage}</span>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
