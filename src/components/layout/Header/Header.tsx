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

const categories = [
  { name: "العناية بالبشرة", href: "/products?category=skincare", active: true },
  { name: "المكياج", href: "/products?category=makeup" },
  { name: "العناية بالشعر", href: "/products?category=hair" },
  { name: "العناية بالجسم", href: "/products?category=body" },
  { name: "العطور", href: "/products?category=perfumes" },
  { name: "أدوات التجميل", href: "/products?category=tools" },
  { name: "العناية الرجالية", href: "/products?category=men" },
  { name: "العروض الحصرية", href: "/products?deals=true", highlight: true },
];

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoCopied, setPromoCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCopyPromoCode = async () => {
    const code = "SHEORA25";

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#121110] text-[#E8B577] text-[11px] font-normal border-b border-[#262422]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B88A44] animate-pulse" />
            <p className="text-[#f5f0eb] tracking-wide font-light">
              استخدم الرمز الترويجي{" "}
              <button
                type="button"
                onClick={handleCopyPromoCode}
                title={promoCopied ? "تم نسخ الرمز" : "انقر لنسخ الرمز"}
                aria-label={promoCopied ? "تم نسخ الرمز SHEORA25" : "نسخ الرمز الترويجي SHEORA25"}
                className="inline-flex items-center rounded-sm border border-[#E8B577]/35 bg-[#B88A44]/20 px-2 py-0.5 font-semibold text-[#E8B577] transition-colors hover:border-[#E8B577]/55 hover:bg-[#B88A44]/30 hover:text-[#F5D99B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B88A44] cursor-pointer"
              >
                {promoCopied ? "تم النسخ ✓" : "SHEORA25"}
              </button>{" "}
              للحصول على خصم 25% مع شحن مجاني لكافة الطلبات
            </p>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[#d5cfc9]">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <MapPin className="size-3 text-[#B88A44]" />
              <span>فروعنا في القاهرة والإسكندرية</span>
            </span>
            <span className="text-[#423D3A]">|</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <PhoneCall className="size-3 text-[#B88A44]" />
              <span>خدمة العملاء والاستشارات</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="bg-white border-b border-[#F0EBE5]">
        <div className="mx-auto flex max-w-[1280px] h-[80px] items-center justify-between gap-4 px-4 sm:px-6">
          {/* Right side in RTL: Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            aria-label="دار شيورا للجمال والعطور الفاخرة"
          >
            <div className="flex flex-col">
              <span className="font-playfair text-2xl font-bold tracking-[0.18em] text-[#151211] group-hover:text-[#B88A44] transition-colors">
                SHEORA
              </span>
              <span className="text-[8px] font-medium tracking-[0.3em] text-[#B88A44] -mt-1 uppercase">
                Create Your Aura
              </span>
            </div>
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
              className="absolute left-1.5 h-[34px] px-4 rounded-full bg-[#151211] text-white hover:bg-[#B88A44] text-[12px] font-medium transition-colors cursor-pointer"
            >
              بحث
            </button>
          </form>

          {/* Left side in RTL: Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Custom Gift CTA */}
            <Link
              href="/products?collection=gifts"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#B88A44]/40 bg-[#FAF7F2] text-[#8C6426] hover:bg-[#B88A44] hover:text-white text-[12px] font-medium transition-all"
            >
              <Gift className="size-3.5 text-[#B88A44]" />
              <span>صمم هديتك</span>
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#151211] hover:text-[#B88A44] hover:bg-[#FAF8F5] transition-colors"
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
              className="relative p-2 rounded-lg text-[#151211] hover:text-[#B88A44] hover:bg-[#FAF8F5] transition-colors"
              aria-label="قائمة الرغبات"
            >
              <Heart className="size-5" />
            </Link>

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#151211] text-white hover:bg-[#B88A44] transition-all"
            >
              <div className="relative">
                <ShoppingBag className="size-4" />
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#B88A44] text-[9px] font-bold text-white">
                  2
                </span>
              </div>
              <span className="hidden sm:inline text-[12px] font-medium">
                سلة المشتريات
              </span>
              <span className="hidden md:inline text-[11px] text-[#D8A86C] border-r border-white/20 pr-2 mr-1">
                1,200 ج.م
              </span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#151211] hover:text-[#B88A44]"
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
      <nav className="bg-[#121110] border-b border-[#211F1D] hidden md:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 h-[46px]">
          <ul className="flex items-center gap-7 text-[13px] font-medium">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={cat.href}
                  className={`flex items-center gap-1.5 transition-colors py-1 ${
                    cat.highlight
                      ? "text-[#E8B577] hover:text-white font-semibold"
                      : cat.active
                      ? "text-white border-b-2 border-[#B88A44] pb-1"
                      : "text-[#D5CFC9] hover:text-[#E8B577]"
                  }`}
                >
                  {cat.highlight && <Sparkles className="size-3 text-[#E8B577]" />}
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            className="text-[11px] text-[#B88A44] hover:text-[#E8B577] transition-colors"
          >
            عرض كافة الأقسام ←
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121110] text-white border-t border-[#262422] py-4 px-6 space-y-3">
          <p className="text-[11px] text-[#B88A44] font-semibold uppercase tracking-wider mb-2">
            الأقسام الرئيسية
          </p>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md transition-colors ${
                  cat.highlight
                    ? "bg-[#B88A44]/20 text-[#E8B577] font-semibold"
                    : "text-[#D5CFC9] hover:bg-white/5"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-[#D5CFC9]">
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>حسابي</Link>
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>المفضلة</Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>السلة (2)</Link>
          </div>
        </div>
      )}
    </header>
  );
}
