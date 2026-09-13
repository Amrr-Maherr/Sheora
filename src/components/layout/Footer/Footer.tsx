import Link from "next/link";
import { ShieldCheck, Truck, Lock, Sparkles, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#121110] text-[#D5CFC9] border-t border-[#262422]">
      {/* 1. Value Propositions Strip */}
      <div className="border-b border-[#211F1D] py-8 bg-[#171615]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/15 border border-[#B88A44]/30 text-[#E8B577]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-white">أصالة مضمونة 100%</h4>
                <p className="text-[11px] text-[#9E9791] mt-0.5 leading-snug">
                  جميع المنتجات أصلية ومستوردة مباشرة من كبرى دور التجميل
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/15 border border-[#B88A44]/30 text-[#E8B577]">
                <Truck className="size-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-white">توصيل سريع وفخم</h4>
                <p className="text-[11px] text-[#9E9791] mt-0.5 leading-snug">
                  تغليف هدايا ملكي مجاني وشحن سريع لجميع المحافظات
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/15 border border-[#B88A44]/30 text-[#E8B577]">
                <Lock className="size-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-white">دفع إلكتروني محمي</h4>
                <p className="text-[11px] text-[#9E9791] mt-0.5 leading-snug">
                  بوابات دفع مشفرة ودعم كامل لوسائل الدفع المصرية
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#B88A44]/15 border border-[#B88A44]/30 text-[#E8B577]">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-white">استشارات تجميلية</h4>
                <p className="text-[11px] text-[#9E9791] mt-0.5 leading-snug">
                  تواصل مباشر ومجاني مع خبيرات العناية بالبشرة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 columns wide) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-playfair text-3xl font-bold tracking-[0.2em] text-[#E8B577]">
                SHEORA
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-[#A8A19B] max-w-[380px]">
              دار شِيورا هي وجهتك الأولى في مصر والشرق الأوسط للعناية الراقية بالبشرة، العطور النيش النادرة، ومستحضرات التجميل المختارة بعناية فائقة لتعكس أناقتك المتفردة.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 hover:bg-[#B88A44] hover:text-white text-[#D5CFC9] transition-all"
                aria-label="Instagram"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 hover:bg-[#B88A44] hover:text-white text-[#D5CFC9] transition-all"
                aria-label="Facebook"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 hover:bg-[#B88A44] hover:text-white text-[#D5CFC9] transition-all"
                aria-label="TikTok"
              >
                <Share2 className="size-4" />
              </a>
            </div>
          </div>

          {/* Links 1: خدمة العملاء */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-white tracking-wide border-b border-[#262422] pb-2 inline-block">
              خدمة العملاء
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A19B]">
              <li><Link href="/orders" className="hover:text-[#E8B577] transition-colors">تتبع مسار شحنتك</Link></li>
              <li><Link href="/returns" className="hover:text-[#E8B577] transition-colors">سياسة الإرجاع والاستبدال</Link></li>
              <li><Link href="/faq" className="hover:text-[#E8B577] transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/consultation" className="hover:text-[#E8B577] transition-colors">استشارة خبير التجميل</Link></li>
              <li><Link href="/stores" className="hover:text-[#E8B577] transition-colors">فروعنا ونقاط البيع</Link></li>
            </ul>
          </div>

          {/* Links 2: عن دار شيورا */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-white tracking-wide border-b border-[#262422] pb-2 inline-block">
              عن دار شِيورا
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A19B]">
              <li><Link href="/about" className="hover:text-[#E8B577] transition-colors">قصتنا وفلسفتنا</Link></li>
              <li><Link href="/authenticity" className="hover:text-[#E8B577] transition-colors">معايير الأصالة والجودة</Link></li>
              <li><Link href="/loyalty" className="hover:text-[#E8B577] transition-colors">برنامج ولاء عملاء شِيورا</Link></li>
              <li><Link href="/terms" className="hover:text-[#E8B577] transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/privacy" className="hover:text-[#E8B577] transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* Links 3: التسوق الحصري */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-white tracking-wide border-b border-[#262422] pb-2 inline-block">
              التسوق الحصري
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A19B]">
              <li><Link href="/products?category=skincare" className="hover:text-[#E8B577] transition-colors">سيروم وإكسير النضارة</Link></li>
              <li><Link href="/products?category=perfumes" className="hover:text-[#E8B577] transition-colors">عطور نيش محدودة الإصدار</Link></li>
              <li><Link href="/products?category=treatments" className="hover:text-[#E8B577] transition-colors">علاجات إصلاح البشرة</Link></li>
              <li><Link href="/products?category=gifts" className="hover:text-[#E8B577] transition-colors">مجموعات الهدايا الملكية</Link></li>
              <li><Link href="/products?deals=true" className="hover:text-[#E8B577] transition-colors text-[#E8B577]">العروض والتخفيضات الحصرية</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Payment Strip & Copyright */}
      <div className="border-t border-[#211F1D] bg-[#0E0D0C] py-6">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#8C847E]">
          <p>
            جميع الحقوق محفوظة © 2026 دار شِيورا للعطور الفاخرة ومستحضرات التجميل SHEORA. صُنعت بكل فخر وإتقان.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#A8A19B]">وسائل الدفع المعتمدة:</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Instapay</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">فودافون كاش</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Visa / MasterCard</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">الدفع عند الاستلام</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
