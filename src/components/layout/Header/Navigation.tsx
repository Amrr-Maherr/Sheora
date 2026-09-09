"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "JEWELRY", href: "/products" },
  { label: "NEW RELEASES", href: "/products" },
  { label: "GIFTS", href: "/categories" },
] as const;

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-8">
        <li className="flex items-center text-foreground/70">
          <MapPin className="size-5" />
          <span className="sr-only">Locations</span>
        </li>
        {navLinks.map((link) => {
          const active = isActive(link.href, pathname);

          return (
            <li key={link.label}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-xs font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-foreground",
                  active && "text-foreground underline underline-offset-8",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}