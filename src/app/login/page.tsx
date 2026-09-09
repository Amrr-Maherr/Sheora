import type { Metadata } from "next";
import { AuthContainer } from "@/features/auth";

export const metadata: Metadata = {
  title: "تسجيل الدخول | شيورا",
};

export default function LoginPage() {
  return <AuthContainer mode="login" />;
}