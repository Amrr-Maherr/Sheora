import type { Metadata } from "next";
import { Alexandria, Playfair_Display, Tajawal } from "next/font/google";
import { Providers } from "@/app/providers";
import { Footer, Header } from "@/components/layout";
import { CartDrawerContainer, CartProvider } from "@/features/cart";
import {
  generateThemeCssVariables,
  getStorefrontNavigation,
  getStorefrontSettings,
} from "@/features/storefront";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStorefrontSettings();
  return {
    title: "SHEORA | دار شِيورا للجمال والعطور الفاخرة",
    description: "دار شيورا للجمال والعطور الفاخرة - مستحضرات تجميل راقية وعطور نيش ملكية",
    ...(settings.brand.faviconUrl && {
      icons: { icon: settings.brand.faviconUrl },
    }),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navigation] = await Promise.all([
    getStorefrontSettings(),
    getStorefrontNavigation(),
  ]);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${alexandria.variable} ${playfair.variable} h-full antialiased`}
      style={generateThemeCssVariables(settings.theme)}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F7] text-[#151211] font-sans">
        <Providers>
          <CartProvider>
            <Header settings={settings} navigation={navigation} />
            <main className="flex-1">{children}</main>
            <Footer settings={settings} />
            <CartDrawerContainer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
