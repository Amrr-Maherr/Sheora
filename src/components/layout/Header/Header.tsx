import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";

const navItems = [
  { label: "JEWELRY", href: "/products" },
  { label: "NEW RELEASES", href: "/products" },
  { label: "GIFTS", href: "/categories" },
] as const;

export function Header() {
  return (
    <header className="border-b border-[#d8d3d0] bg-[#f5f1ee]">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10">
        <div className="hidden items-center gap-4 lg:flex">
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4b4643]">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[#181514]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link
          href="/"
          aria-label="Sheora home"
          className="relative inline-flex items-center justify-center"
        >
          <img
            src="/assets/logo.png"
            alt="Sheora logo"
            className="h-[54px] w-auto object-contain sm:h-[72px]"
          />
        </Link>

        <div className="flex items-center justify-end gap-3 sm:gap-5">
          <div className="hidden h-9 w-[200px] items-center border border-[#d5d0cd] bg-white/60 px-3 sm:flex">
            <Search className="mr-2 size-4 text-[#6b6563]" />
            <input
              aria-label="Search"
              type="search"
              placeholder="Search"
              className="w-full border-0 bg-transparent text-[13px] text-[#6b6563] placeholder:text-[#6b6563] outline-none"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/account"
              aria-label="Account"
              className="text-[#2e2928] transition-opacity hover:opacity-75"
            >
              <User className="size-5" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="text-[#2e2928] transition-opacity hover:opacity-75"
            >
              <Heart className="size-5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="text-[#2e2928] transition-opacity hover:opacity-75"
            >
              <ShoppingBag className="size-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e4dfdc] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3 rounded-full border border-[#d5d0cd] bg-white/60 px-3 py-2">
          <Search className="size-4 text-[#6b6563]" />
          <input
            aria-label="Search"
            type="search"
            placeholder="Search"
            className="w-full border-0 bg-transparent text-[13px] text-[#6b6563] placeholder:text-[#6b6563] outline-none"
          />
        </div>
      </div>
    </header>
  );
}
