"use client";

import { useAuthForm } from "../hooks/useAuthForm";
import { isEmail } from "../lib/validation";
import { LoginFormPresenter } from "./LoginFormPresenter";
import type { LoginFormValues } from "../types/auth";

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
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useAuthForm<LoginFormValues>({
      initialValues: { email: "", password: "", rememberMe: true },
      validate,
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