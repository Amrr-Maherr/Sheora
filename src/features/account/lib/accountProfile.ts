import type { User } from "@/types";

export type AccountProfile = {
  name: string;
  email: string;
  phone: string;
  initials: string;
};

export const DEMO_ACCOUNT_PROFILE: AccountProfile = {
  name: "د. ياسمين الشريف",
  email: "yasmine.elsharif@example.com",
  phone: "+20 102 345 6789",
  initials: "دي",
};

export const ACCOUNT_LOYALTY_POINTS = 1200;

function getInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);

  const initials = words
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("");

  return initials.toUpperCase() || "SH";
}

export function buildAccountProfile(user: User): AccountProfile {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    initials: getInitials(user.name),
  };
}
