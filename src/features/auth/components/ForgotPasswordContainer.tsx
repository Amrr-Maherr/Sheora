"use client";

import { useAuthForm } from "../hooks/useAuthForm";
import { isEmail } from "../lib/validation";
import { ForgotPasswordPresenter } from "./ForgotPasswordPresenter";
import type { ForgotPasswordFormValues } from "../types/auth";

function validate(values: ForgotPasswordFormValues) {
  const errors: Partial<Record<keyof ForgotPasswordFormValues, string>> = {};

  if (!values.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!isEmail(values.email)) {
    errors.email = "أدخل بريدا إلكترونيا صحيحا";
  }

  return errors;
}

export function ForgotPasswordContainer() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useAuthForm<ForgotPasswordFormValues>({
      initialValues: { email: "" },
      validate,
    });

  return (
    <ForgotPasswordPresenter
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}