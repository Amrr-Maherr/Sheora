"use client";

import { useRouter } from "next/navigation";
import { useAuthForm } from "../hooks/useAuthForm";
import { isEmail } from "../lib/validation";
import { LoginFormPresenter } from "./LoginFormPresenter";
import type { LoginFormValues } from "../types/auth";
import { laravelApiClient } from "@/services/api/laravelClient";
import { setAuthToken, setAuthUser } from "@/lib/authStorage";
import { useCartDrawer } from "@/features/cart/context/CartProvider";

function validate(values: LoginFormValues) {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};

  if (!values.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!isEmail(values.email)) {
    errors.email = "أدخل بريدا إلكترونيا صحيحا";
  }

  if (!values.password) {
    errors.password = "كلمة المرور مطلوبة";
  }

  return errors;
}

export function LoginFormContainer() {
  const router = useRouter();
  const { mergeGuestCart } = useCartDrawer();

  const { values, errors, setErrors, isSubmitting, handleChange, handleSubmit } =
    useAuthForm<LoginFormValues>({
      initialValues: { email: "", password: "", rememberMe: true },
      validate,
      onSubmit: async (formValues) => {
        try {
          const response = await laravelApiClient.post<{
            token: string;
            user: Record<string, unknown>;
          }>("/auth/login", {
            identifier: formValues.email.trim(),
            password: formValues.password,
          });

          if (response?.token) {
            setAuthToken(response.token);
            if (response.user) {
              setAuthUser(response.user);
            }
            // Merge guest cart items into authenticated user cart
            await mergeGuestCart();

            router.push("/cart");
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : "فشل تسجيل الدخول، يرجى التحقق من البيانات المدخلة";
          setErrors({
            email: message,
          });
        }
      },
    });

  return (
    <LoginFormPresenter
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
