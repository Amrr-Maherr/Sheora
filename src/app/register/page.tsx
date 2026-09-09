import type { Metadata } from "next";
import { AuthContainer } from "@/features/auth";

export const metadata: Metadata = {
  title: "إنشاء حساب | شيورا",
};

export default function RegisterPage() {
  return <AuthContainer mode="register" />;
}