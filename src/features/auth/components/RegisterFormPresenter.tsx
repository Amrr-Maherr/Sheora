import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import type { RegisterFormValues } from "../types/auth";

type RegisterFormPresenterProps = {
  values: RegisterFormValues;
  errors: Partial<Record<keyof RegisterFormValues, string>>;
  isSubmitting: boolean;
  handleChange: (field: keyof RegisterFormValues, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function RegisterFormPresenter({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
}: RegisterFormPresenterProps) {
  return (
    <AuthCard
      title="أنشئ حسابك"
      description="انضم إلى عالم شيورا واسعد باقة عطور مميزة"
      footer={
        <p className="w-full text-center">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            سجل الدخول
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <AuthFormField label="الاسم الكامل" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="اسمك الكامل"
            value={values.name}
            onChange={(event) => handleChange("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </AuthFormField>

        <AuthFormField label="البريد الإلكتروني" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={(event) => handleChange("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </AuthFormField>

        <AuthFormField label="كلمة المرور" htmlFor="password" error={errors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(event) => handleChange("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </AuthFormField>

        <AuthFormField
          label="تأكيد كلمة المرور"
          htmlFor="confirmPassword"
          error={errors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={(event) => handleChange("confirmPassword", event.target.value)}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
        </AuthFormField>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
        </Button>
      </form>
    </AuthCard>
  );
}