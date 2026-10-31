import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Lock,
  Sparkles,
  Heart,
  Gift,
  Package,
  Share2,
} from "lucide-react";
import { DEFAULT_STOREFRONT_SETTINGS, type StorefrontSettings } from "@/features/storefront";
import { BrandLogoImage } from "@/components/layout/BrandLogoImage";

interface FooterProps {
  settings?: StorefrontSettings;
}

const pillarIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "shield-check": ShieldCheck,
  truck: Truck,
  lock: Lock,
  sparkles: Sparkles,
  heart: Heart,
  gift: Gift,
  package: Package,
};

export function Footer({ settings = DEFAULT_STOREFRONT_SETTINGS }: FooterProps) {
  const brand = settings.brand;
  const footer = settings.footer;

  /** Typography fallback shown when no logo image is configured or image fails */
  const typographyLogo = (
    <span className="font-playfair text-3xl font-bold tracking-[0.2em] text-gold-light">
      {brand.name}
    </span>
  );

  return (
    <footer className="bg-obsidian text-[#D5CFC9] border-t border-[#262422]">
      {/* 1. Value Propositions Strip */}
      {footer.pillarsVisible && footer.pillars.length > 0 && (
        <div className="border-b border-[#211F1D] py-8 bg-[#171615]">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {footer.pillars.map((pillar, idx) => {
                const IconComponent = pillarIconMap[pillar.icon] || Sparkles;
                return (
                  <div
                    key={`${pillar.title}-${idx}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/30 text-gold-light">
                      <IconComponent className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-white">
                        {pillar.title}
                      </h4>
                      <p className="text-[11px] text-[#9E9791] mt-0.5 leading-snug">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Footer Content */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 columns wide) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block" aria-label={brand.name}>
              {brand.logoType === "image" && (brand.logoDarkUrl || brand.logoUrl) ? (
                <BrandLogoImage
                  src={brand.logoDarkUrl || brand.logoUrl!}
                  alt={brand.name}
                  className="h-10 w-auto object-contain"
                  fallback={typographyLogo}
                />
              ) : (
                typographyLogo
              )}
            </Link>
            {footer.aboutText && (
              <p className="text-[13px] leading-relaxed text-[#A8A19B] max-w-[380px]">
                {footer.aboutText}
              </p>
            )}

            {/* Social Media Links */}
            {footer.socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {footer.socialLinks.map((social) => {
                  const platform = social.platform.toLowerCase();
                  return (
                    <a
                      key={`${social.platform}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-full bg-white/5 hover:bg-gold hover:text-white text-[#D5CFC9] transition-all"
                      aria-label={social.platform}
                    >
                      {platform === "instagram" ? (
                        <svg className="size-4 fill-currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ) : platform === "facebook" ? (
                        <svg className="size-4 fill-currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ) : (
                        <Share2 className="size-4" />
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Footer Link Columns */}
          {footer.columns.map((column, cIdx) => (
            <div key={`${column.title}-${cIdx}`} className="space-y-3">
              <h4 className="text-[14px] font-semibold text-white tracking-wide border-b border-[#262422] pb-2 inline-block">
                {column.title}
              </h4>
              <ul className="space-y-2.5 text-[13px] text-[#A8A19B]">
                {column.links.map((link, lIdx) => (
                  <li key={`${link.label}-${lIdx}`}>
                    <Link
                      href={link.url}
                      className="hover:text-gold-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Payment Strip & Copyright */}
      {footer.paymentStripVisible && (
        <div className="border-t border-[#211F1D] bg-[#0E0D0C] py-6">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#8C847E]">
            {footer.copyright && <p>{footer.copyright}</p>}
            {footer.paymentMethods.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-[11px] text-[#A8A19B]">
                  وسائل الدفع المعتمدة:
                </span>
                {footer.paymentMethods.map((method, idx) => (
                  <span
                    key={`${method}-${idx}`}
                    className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
