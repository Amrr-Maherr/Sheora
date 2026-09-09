import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import type { ForgotPasswordFormValues } from "../types/auth";

type ForgotPasswordPresenterProps = {
  values: ForgotPasswordFormValues;
  errors: Partial<Record<keyof ForgotPasswordFormValues, string>>;
  isSubmitting: boolean;
  handleChange: (field: keyof ForgotPasswordFormValues, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ForgotPasswordPresenter({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
}: ForgotPasswordPresenterProps) {
  return (
    <AuthCard
      title="نسيت كلمة المرور"
      description="أدخل بريدك الإلكتروني وسنرسل لك رابطا لإعادة تعيين كلمة المرور"
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

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
        </Button>
      </form>
    </AuthCard>
  );
}