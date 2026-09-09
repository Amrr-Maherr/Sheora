import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import type { ResetPasswordFormValues } from "../types/auth";

type ResetPasswordPresenterProps = {
  values: ResetPasswordFormValues;
  errors: Partial<Record<keyof ResetPasswordFormValues, string>>;
  isSubmitting: boolean;
  handleChange: (field: keyof ResetPasswordFormValues, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ResetPasswordPresenter({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
}: ResetPasswordPresenterProps) {
  return (
    <AuthCard
      title="إعادة تعيين كلمة المرور"
      description="أدخل كلمة مرور جديدة لحسابك"
      footer={
        <p className="w-full text-center">
          تذكرت كلمة المرور؟{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            سجل الدخول
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <AuthFormField label="كلمة المرور الجديدة" htmlFor="password" error={errors.password}>
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
          {isSubmitting ? "جارٍ الحفظ..." : "إعادة تعيين كلمة المرور"}
        </Button>
      </form>
    </AuthCard>
  );
}