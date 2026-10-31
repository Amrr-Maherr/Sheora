"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Gift,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  MapPin,
} from "lucide-react";
import { useCartDrawer } from "@/features/cart/context";
import { formatPrice } from "@/features/cart/lib/format";
import {
  DEFAULT_STOREFRONT_SETTINGS,
  type HeaderNavigationItem,
  type StorefrontSettings,
} from "@/features/storefront";
import { BrandLogoImage } from "@/components/layout/BrandLogoImage";

interface HeaderProps {
  settings?: StorefrontSettings;
  navigation?: HeaderNavigationItem[];
}

export function Header({
  settings = DEFAULT_STOREFRONT_SETTINGS,
  navigation = [],
}: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoCopied, setPromoCopied] = useState(false);
  const { totals, isOpen, openCart } = useCartDrawer();

  const brand = settings.brand;
  const announcement = settings.announcement;
  const liveNavigation = navigation.filter((item) => item.label && item.url);
  const highlightItem = settings.navigation.find(
    (item) =>
      item.highlight &&
      !liveNavigation.some((liveItem) => liveItem.url === item.url),
  );
  const navItems =
    liveNavigation.length > 0
      ? [...liveNavigation, ...(highlightItem ? [highlightItem] : [])]
      : settings.navigation;

  const handleOpenCart = () => {
    setMobileMenuOpen(false);
    openCart();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCopyPromoCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setPromoCopied(true);
    window.setTimeout(() => setPromoCopied(false), 2000);
  };

  /** Typography fallback shown when no logo image is configured or image fails */
  const typographyLogo = (
    <div className="flex flex-col">
      <span className="font-playfair text-2xl font-bold tracking-[0.18em] text-foreground group-hover:text-gold transition-colors">
        {brand.name}
      </span>
      {brand.slogan && (
        <span className="text-[8px] font-medium tracking-[0.3em] text-gold -mt-1 uppercase">
          {brand.slogan}
        </span>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* 1. Top Announcement Bar */}
      {announcement.isVisible && (
        <div className="bg-obsidian text-gold-light text-[11px] font-normal border-b border-[#262422]">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <p className="text-[#f5f0eb] tracking-wide font-light">
                {announcement.promoCode ? (
                  <>
                    استخدم الرمز الترويجي{" "}
                    <button
                      type="button"
                      onClick={() => handleCopyPromoCode(announcement.promoCode!)}
                      title={promoCopied ? "تم نسخ الرمز" : "انقر لنسخ الرمز"}
                      aria-label={
                        promoCopied
                          ? `تم نسخ الرمز ${announcement.promoCode}`
                          : `نسخ الرمز الترويجي ${announcement.promoCode}`
                      }
                      className="inline-flex items-center rounded-sm border border-gold-light/35 bg-gold/20 px-2 py-0.5 font-semibold text-gold-light transition-colors hover:border-gold-light/55 hover:bg-gold/30 hover:text-[#F5D99B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold cursor-pointer"
                    >
                      {promoCopied ? "تم النسخ ✓" : announcement.promoCode}
                    </button>{" "}
                  </>
                ) : null}
                {announcement.text}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-5 text-[#d5cfc9]">
              {announcement.branches?.label && (
                <Link
                  href={announcement.branches.url || "/stores"}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <MapPin className="size-3 text-gold" />
                  <span>{announcement.branches.label}</span>
                </Link>
              )}
              {announcement.branches?.label && announcement.contact?.label && (
                <span className="text-[#423D3A]">|</span>
              )}
              {announcement.contact?.label && (
                <a
                  href={
                    announcement.contact.phone
                      ? `tel:${announcement.contact.phone}`
                      : "#"
                  }
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <PhoneCall className="size-3 text-gold" />
                  <span>{announcement.contact.label}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="bg-white border-b border-[#F0EBE5]">
        <div className="mx-auto flex max-w-[1280px] h-[80px] items-center justify-between gap-4 px-4 sm:px-6">
          {/* Right side in RTL: Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            aria-label={`${brand.name} - ${brand.slogan || "دار العطور والجمال الفاخرة"}`}
          >
            {brand.logoType === "image" && brand.logoUrl ? (
              <BrandLogoImage
                src={brand.logoUrl}
                alt={brand.name}
                className="h-10 w-auto object-contain"
                fallback={typographyLogo}
              />
            ) : (
              typographyLogo
            )}
          </Link>

          {/* Center: Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-[560px] mx-6 relative items-center"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عما تريد... سيروم، إكسير، عطور عناية فاخرة..."
              className="w-full h-[44px] pr-11 pl-24 text-[13px] bg-[#FAF8F5] border border-[#E8E2DA] rounded-full text-[#151211] placeholder:text-[#8C827A] focus:outline-none focus:border-[#B88A44] focus:bg-white focus:ring-2 focus:ring-[#B88A44]/15 transition-all"
            />
            <Search className="absolute right-4 size-4 text-[#8C827A] pointer-events-none" />
            <button
              type="submit"
              className="absolute left-1.5 h-[34px] px-4 rounded-full bg-foreground text-white hover:bg-gold text-[12px] font-medium transition-colors cursor-pointer"
            >
              بحث
            </button>
          </form>

          {/* Left side in RTL: Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Custom Gift CTA */}
            <Link
              href="/products"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/40 bg-[#FAF7F2] text-gold-dark hover:bg-gold hover:text-white text-[12px] font-medium transition-all"
            >
              <Gift className="size-3.5 text-gold" />
              <span>صمم هديتك</span>
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-foreground hover:text-gold hover:bg-[#FAF8F5] transition-colors"
            >
              <User className="size-5" />
              <div className="hidden xl:flex flex-col text-right leading-tight">
                <span className="text-[10px] text-[#8C827A]">مرحباً بك</span>
                <span className="text-[12px] font-medium">تسجيل دخول</span>
              </div>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-foreground hover:text-gold hover:bg-[#FAF8F5] transition-colors"
              aria-label="قائمة الرغبات"
            >
              <Heart className="size-5" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={handleOpenCart}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-label={`فتح سلة المشتريات (${totals.itemCount} منتجات)`}
              className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-foreground text-white hover:bg-gold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              <div className="relative">
                <ShoppingBag className="size-4" />
                {totals.itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-white">
                    {totals.itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-[12px] font-medium">
                سلة المشتريات
              </span>
              {totals.total > 0 && (
                <span className="hidden md:inline text-[11px] text-gold-light border-r border-white/20 pr-2 mr-1">
                  {formatPrice(totals.total)} ج.م
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-gold"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن عطور، سيروم، مكياج..."
              className="w-full h-[40px] pr-10 pl-4 text-[13px] bg-[#FAF8F5] border border-[#E8E2DA] rounded-full text-[#151211] placeholder:text-[#8C827A] focus:outline-none focus:border-[#B88A44]"
            />
            <Search className="absolute right-3.5 size-4 text-[#8C827A] pointer-events-none" />
          </form>
        </div>
      </div>

      {/* 3. Category Bar - Deep Obsidian with Golden Accents */}
      {navItems.length > 0 && (
        <nav className="bg-obsidian border-b border-[#211F1D] hidden md:block">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 h-[46px]">
            <ul className="flex items-center gap-7 text-[13px] font-medium">
              {navItems.map((cat, idx) => (
                <li key={`${cat.label}-${idx}`}>
                  <Link
                    href={cat.url}
                    className={`flex items-center gap-1.5 transition-colors py-1 ${
                      cat.highlight
                        ? "text-gold-light hover:text-white font-semibold"
                        : idx === 0
                        ? "text-white border-b-2 border-gold pb-1"
                        : "text-[#D5CFC9] hover:text-gold-light"
                    }`}
                  >
                    {cat.highlight && <Sparkles className="size-3 text-gold-light" />}
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="text-[11px] text-gold hover:text-gold-light transition-colors"
            >
              عرض كافة الأقسام ←
            </Link>
          </div>
        </nav>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian text-white border-t border-[#262422] py-4 px-6 space-y-3">
          <p className="text-[11px] text-gold font-semibold uppercase tracking-wider mb-2">
            الأقسام الرئيسية
          </p>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            {navItems.map((cat, idx) => (
              <Link
                key={`${cat.label}-${idx}`}
                href={cat.url}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md transition-colors ${
                  cat.highlight
                    ? "bg-gold/20 text-gold-light font-semibold"
                    : "text-[#D5CFC9] hover:bg-white/5"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-[#D5CFC9]">
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>حسابي</Link>
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>المفضلة</Link>
            <button type="button" onClick={handleOpenCart} aria-haspopup="dialog">
              السلة
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
