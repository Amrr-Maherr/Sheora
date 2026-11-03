"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Crown,
  Heart,
  LayoutGrid,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  TicketPercent,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { DEMO_USER_ID } from "@/constants";
import { useOrders } from "@/features/orders";
import { useWishlist } from "@/features/wishlist";
import { clearAuthToken } from "@/lib/authStorage";
import { cn } from "@/lib/utils";
import {
  useAccountAddresses,
  useAccountCoupons,
  useAccountProfile,
} from "../hooks";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: "default" | "success" | "gold";
};

type AccountSidebarProps = {
  className?: string;
};

export function AccountSidebar({ className }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useAccountProfile();
  const { data: orders = [] } = useOrders(DEMO_USER_ID);
  const { data: wishlists = [] } = useWishlist(DEMO_USER_ID);
  const { data: addresses = [] } = useAccountAddresses(DEMO_USER_ID);
  const { data: coupons = [] } = useAccountCoupons();

  const wishlist = wishlists[0];
  const wishlistCount =
    wishlist?.productIds?.length ?? wishlist?.items?.length ?? 0;

  const navItems: NavItem[] = [
    {
      href: "/account",
      label: "نظرة عامة",
      icon: LayoutGrid,
    },
    {
      href: "/account/orders",
      label: "طلباتي",
      icon: ShoppingBag,
      badge: orders.length > 0 ? String(orders.length) : undefined,
      badgeTone: "default",
    },
    {
      href: "/account/profile",
      label: "البيانات الشخصية",
      icon: UserRound,
      badge: "مكتمل",
      badgeTone: "success",
    },
    {
      href: "/account/addresses",
      label: "العناوين",
      icon: MapPin,
      badge:
        addresses.length > 0
          ? `${addresses.length} ${addresses.length === 1 ? "عنوان" : "عنوان"}`
          : undefined,
      badgeTone: "default",
    },
    {
      href: "/account/wishlist",
      label: "قائمة الرغبات والمفضلة",
      icon: Heart,
      badge:
        wishlistCount > 0
          ? `${wishlistCount} ${wishlistCount === 1 ? "منتج" : "منتجات"}`
          : undefined,
      badgeTone: "gold",
    },
    {
      href: "/account#coupons",
      label: "قسائم الخصم",
      icon: TicketPercent,
      badge: coupons.length > 0 ? `${coupons.length} نشطة` : undefined,
      badgeTone: "success",
    },
  ];

  const handleLogout = () => {
    clearAuthToken();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className={cn("space-y-4", className)}>
      <div className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <Link
          href="/account/profile"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#E9D9BE] bg-[#FBF5EC] font-alexandria text-[16px] font-bold text-[#B88A44]">
            {profile.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-alexandria text-[14px] font-bold text-[#151211]">
              {profile.name}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FBF5EC] px-2 py-0.5 text-[9px] font-bold text-[#8C6426]">
              <Crown className="size-3" />
              عضوية ذهبية VIP
            </span>
          </div>
        </Link>

        <div className="mt-4 space-y-2.5 border-t border-[#F0EBE5] pt-4 text-[11px] text-[#706E6B]">
          <p className="flex items-center gap-2">
            <Mail className="size-3.5 shrink-0 text-[#B88A44]" />
            <span className="truncate" dir="ltr">
              {profile.email}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-3.5 shrink-0 text-[#B88A44]" />
            <span dir="ltr">{profile.phone}</span>
          </p>
        </div>
      </div>

      <nav
        aria-label="قائمة الحساب"
        className="rounded-2xl border border-[#EDE8E3] bg-white p-2 shadow-[0_1px_2px_rgba(20,20,20,0.04)]"
      >
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href.includes("#")
              ? false
              : item.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(`${item.href}/`) ||
                  pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[12px] transition-colors",
                    isActive
                      ? "border-[#C59A52] bg-[#FBF8F2] font-bold text-[#151211]"
                      : "border-transparent text-[#4B5563] hover:bg-[#FAF9F7] hover:text-[#151211]",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "text-[#B88A44]" : "text-[#9CA3AF]",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold",
                        item.badgeTone === "success"
                          ? "bg-[#EEF6F0] text-[#047857]"
                          : item.badgeTone === "gold"
                            ? "bg-[#FBF5EC] text-[#8C6426]"
                            : "bg-[#F5F1EB] text-[#706E6B]",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
          <li className="pt-1">
            <div className="my-1 border-t border-[#F0EBE5]" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] text-[#DC2626] transition-colors hover:bg-red-50"
            >
              <LogOut className="size-4 shrink-0" />
              <span>تسجيل الخروج</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
