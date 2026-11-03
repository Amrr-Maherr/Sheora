"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/features/cart/api";
import { useCartDrawer } from "@/features/cart/context";
import {
  buildTrackedOrder,
  createOrderReference,
  saveTrackedOrder,
} from "@/features/orders";
import { queryKeys } from "@/constants";
import { buildCheckoutWhatsAppUrl } from "../lib/whatsapp";
import { CheckoutPresenter } from "./CheckoutPresenter";
import type {
  CheckoutFormErrors,
  CheckoutFormValues,
} from "../types";

const EMPTY_FORM: CheckoutFormValues = {
  fullName: "",
  phone: "",
  altPhone: "",
  governorateSlug: "",
  area: "",
  address: "",
  notes: "",
  paymentMethod: "cod",
};

function validateCheckoutForm(
  form: CheckoutFormValues,
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};
  const phoneDigits = form.phone.replace(/\D/g, "");
  const altPhoneDigits = form.altPhone.replace(/\D/g, "");

  if (form.fullName.trim().length < 3) {
    errors.fullName = "يرجى إدخال الاسم بالكامل.";
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "يرجى إدخال رقم موبايل صحيح.";
  }
  if (form.altPhone.trim() && altPhoneDigits.length < 10) {
    errors.altPhone = "رقم الموبايل الإضافي غير صحيح.";
  }
  if (!form.governorateSlug) {
    errors.governorateSlug = "يرجى اختيار المحافظة.";
  }
  if (form.area.trim().length < 2) {
    errors.area = "يرجى إدخال المنطقة أو الحي.";
  }
  if (form.address.trim().length < 10) {
    errors.address = "يرجى إدخال العنوان بالتفصيل.";
  }

  return errors;
}

type CheckoutContainerProps = {
  whatsappNumber?: string | null;
};

export function CheckoutContainer({ whatsappNumber }: CheckoutContainerProps) {
  const router = useRouter();
  const {
    lines,
    totals,
    coupon,
    governorateSlug,
    isLoading,
    isUpdating,
    error,
    setGovernorate,
    applyCoupon,
    removeCoupon,
  } = useCartDrawer();

  const [form, setForm] = useState<CheckoutFormValues>(() => ({
    ...EMPTY_FORM,
    governorateSlug: governorateSlug ?? "",
  }));
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: governorates = [] } = useQuery({
    queryKey: [...queryKeys.cart.all, "governorates"],
    queryFn: cartApi.getGovernorates,
  });

  const handleFieldChange = (
    field: Exclude<keyof CheckoutFormValues, "paymentMethod">,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);

    if (field === "governorateSlug") {
      void setGovernorate(value || null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    const governorateName =
      governorates.find(
        (governorate) => governorate.slug === form.governorateSlug,
      )?.name_ar ?? totals.governorate?.nameAr;

    const reference = createOrderReference();
    const order = buildTrackedOrder({
      reference,
      form,
      lines,
      totals,
      couponCode: coupon?.code,
      governorateName,
      supportPhone: whatsappNumber,
    });

    saveTrackedOrder(order);

    const url = buildCheckoutWhatsAppUrl({
      form,
      lines,
      totals,
      coupon,
      governorateName,
      whatsappNumber,
      reference,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    router.push(`/checkout/success?order=${encodeURIComponent(reference)}`);
  };

  return (
    <CheckoutPresenter
      form={form}
      errors={errors}
      governorates={governorates}
      lines={lines}
      totals={totals}
      coupon={coupon}
      isLoading={isLoading}
      isUpdating={isUpdating}
      error={error}
      submitted={submitted}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onApplyCoupon={applyCoupon}
      onRemoveCoupon={removeCoupon}
    />
  );
}
