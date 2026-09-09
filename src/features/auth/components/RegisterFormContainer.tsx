"use client";

import { useAuthForm } from "../hooks/useAuthForm";
import { isEmail } from "../lib/validation";
import { RegisterFormPresenter } from "./RegisterFormPresenter";
import type { RegisterFormValues } from "../types/auth";

const PASSWORD_MIN_LENGTH = 8;

function validate(values: RegisterFormValues) {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

  if (!values.name.trim()) {
    errors.name = "الاسم الكامل مطلوب";
  }

  if (!values.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!isEmail(values.email)) {
    errors.email = "أدخل بريدا إلكترونيا صحيحا";
  }

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

export function RegisterFormContainer() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useAuthForm<RegisterFormValues>({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validate,
    });

  return (
    <RegisterFormPresenter
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}