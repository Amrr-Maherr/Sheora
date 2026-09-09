import type { Metadata } from "next";
import { ResetPasswordContainer } from "@/features/auth";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور | شيورا",
};

export default function ResetPasswordPage() {
  return <ResetPasswordContainer />;
}