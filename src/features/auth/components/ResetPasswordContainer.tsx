"use client";

import { useAuthForm } from "../hooks/useAuthForm";
import { ResetPasswordPresenter } from "./ResetPasswordPresenter";
import type { ResetPasswordFormValues } from "../types/auth";

const PASSWORD_MIN_LENGTH = 8;

function validate(values: ResetPasswordFormValues) {
  const errors: Partial<Record<keyof ResetPasswordFormValues, string>> = {};

  if (!values.password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `كلمة المرور يجب أن تكون ${PASSWORD_MIN_LENGTH} أحرف على الأقل`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "كلمتا المرور غير متطابقتين";
  }

  return errors;
}

export function ResetPasswordContainer() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useAuthForm<ResetPasswordFormValues>({
      initialValues: { password: "", confirmPassword: "" },
      validate,
    });

  return (
    <ResetPasswordPresenter
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}