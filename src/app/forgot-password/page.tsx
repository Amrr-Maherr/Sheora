import type { Metadata } from "next";
import { ForgotPasswordContainer } from "@/features/auth";

export const metadata: Metadata = {
  title: "نسيت كلمة المرور | شيورا",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContainer />;
}