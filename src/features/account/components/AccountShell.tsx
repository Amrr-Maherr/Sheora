"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AccountSidebar } from "./AccountSidebar";

function getBreadcrumbLabel(pathname: string): string {
  if (pathname === "/account") {
    return "نظرة عامة على الحساب";
  }
  if (pathname === "/account/profile") {
    return "البيانات الشخصية";
  }
  if (pathname === "/account/orders") {
    return "طلباتي";
  }
  if (pathname.startsWith("/account/orders/")) {
    return "تفاصيل الطلب";
  }
  if (pathname === "/account/addresses") {
    return "العناوين";
  }
  if (pathname === "/account/wishlist") {
    return "قائمة الرغبات والمفضلة";
  }

  return "حسابي";
}

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const label = getBreadcrumbLabel(pathname);

  return (
    <div className="w-full bg-[#FAF9F7] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <nav
          aria-label="مسار التنقل"
          className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-[#8C827A]"
        >
          <Link href="/" className="transition-colors hover:text-[#B88A44]">
            الرئيسية
          </Link>
          <span>/</span>
          <Link
            href="/account"
            className="transition-colors hover:text-[#B88A44]"
          >
            حسابي
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#151211]">{label}</span>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-6">
          <AccountSidebar className="order-2 lg:order-1" />
          <div className="order-1 min-w-0 lg:order-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
