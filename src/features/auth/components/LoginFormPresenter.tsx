import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import type { LoginFormValues } from "../types/auth";

type LoginFormPresenterProps = {
  values: LoginFormValues;
  errors: Partial<Record<keyof LoginFormValues, string>>;
  isSubmitting: boolean;
  handleChange: (field: keyof LoginFormValues, value: string | boolean) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginFormPresenter({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
}: LoginFormPresenterProps) {
  return (
    <AuthCard
      title="مرحبا بعودتك"
      description="سجل دخولك لمتابعة تسوقك من عالم شيورا"
      footer={
        <p className="w-full text-center">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            أنشئ حسابا جديدا
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

        <AuthFormField label="كلمة المرور" htmlFor="password" error={errors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(event) => handleChange("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </AuthFormField>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={values.rememberMe}
              onCheckedChange={(checked) => handleChange("rememberMe", Boolean(checked))}
            />
            تذكرني
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>
    </AuthCard>
  );
}