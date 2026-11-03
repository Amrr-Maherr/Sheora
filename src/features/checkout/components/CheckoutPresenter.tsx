"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Home,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  StickyNote,
  User,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/features/cart/lib/format";
import type {
  AppliedCoupon,
  BackendGovernorate,
  CartLine,
  CartTotals,
  CouponResult,
} from "@/features/cart/types";
import type { CheckoutFormErrors, CheckoutFormValues } from "../types";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutStepper } from "./CheckoutStepper";

type CheckoutPresenterProps = {
  form: CheckoutFormValues;
  errors: CheckoutFormErrors;
  governorates: BackendGovernorate[];
  lines: CartLine[];
  totals: CartTotals;
  coupon: AppliedCoupon | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  submitted: boolean;
  onFieldChange: (
    field: Exclude<keyof CheckoutFormValues, "paymentMethod">,
    value: string,
  ) => void;
  onSubmit: (event: React.FormEvent) => void;
  onApplyCoupon: (code: string) => Promise<CouponResult> | CouponResult;
  onRemoveCoupon: () => void;
};

const fieldClassName =
  "h-11 rounded-lg border-[#EAE4DB] bg-[#FAF9F6] text-[12px] text-[#151211] shadow-none placeholder:text-[#A8A19B] focus-visible:border-[#B88A44] focus-visible:ring-[#B88A44]/15";

export function CheckoutPresenter({
  form,
  errors,
  governorates,
  lines,
  totals,
  coupon,
  isLoading,
  isUpdating,
  error,
  submitted,
  onFieldChange,
  onSubmit,
  onApplyCoupon,
  onRemoveCoupon,
}: CheckoutPresenterProps) {
  const isEmpty = lines.length === 0;

  return (
    <div className="w-full bg-[#FAF9F7] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <nav
          aria-label="مسار التنقل"
          className="mb-4 flex items-center gap-2 text-[11px] text-[#8C827A]"
        >
          <Link href="/" className="transition-colors hover:text-[#B88A44]">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/cart" className="transition-colors hover:text-[#B88A44]">
            سلة المشتريات
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#151211]">إتمام الطلب</span>
        </nav>

        <div className="mb-6 rounded-2xl border border-[#EDE8E3] bg-white px-4 py-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:px-8">
          <CheckoutStepper currentStep={1} />
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-[12px] font-medium text-red-700">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading && isEmpty ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="h-[520px] animate-pulse rounded-2xl border border-[#EDE8E3] bg-white" />
            <div className="h-[420px] animate-pulse rounded-2xl border border-[#EDE8E3] bg-white" />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#EDE8E3] bg-white py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#FBF5EC] text-[#B88A44]">
              <ShoppingBag className="size-7" />
            </span>
            <div>
              <p className="font-alexandria text-[16px] font-bold text-[#151211]">
                لا يمكن إتمام الطلب
              </p>
              <p className="mt-1 text-[12px] text-[#78716C]">
                سلتك فارغة حالياً. أضيفي منتجاتك المفضلة أولاً.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-1 rounded-xl bg-[#141414] px-5 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#B88A44]"
            >
              تسوقي الآن
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:p-6">
                <SectionHeader
                  icon={<User className="size-4" />}
                  title="بيانات المشتري والتوصيل"
                  description="يرجى كتابة عنوان ورقم هاتف دقيق لضمان سرعة الوصول."
                />

                <div className="mt-5 space-y-4">
                  <FormField
                    label="الاسم بالكامل"
                    htmlFor="checkout-full-name"
                    required
                    error={errors.fullName}
                  >
                    <div className="relative">
                      <Input
                        id="checkout-full-name"
                        value={form.fullName}
                        onChange={(event) =>
                          onFieldChange("fullName", event.target.value)
                        }
                        placeholder="اسمك الثلاثي"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.fullName)}
                        className={`${fieldClassName} pr-10`}
                      />
                      <User className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#B88A44]" />
                    </div>
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="رقم الموبايل (لتأكيد الواتساب)"
                      htmlFor="checkout-phone"
                      required
                      error={errors.phone}
                    >
                      <div className="relative">
                        <Input
                          id="checkout-phone"
                          type="tel"
                          inputMode="tel"
                          dir="ltr"
                          value={form.phone}
                          onChange={(event) =>
                            onFieldChange("phone", event.target.value)
                          }
                          placeholder="01xxxxxxxxx"
                          autoComplete="tel"
                          aria-invalid={Boolean(errors.phone)}
                          className={`${fieldClassName} pr-10 text-right`}
                        />
                        <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#B88A44]" />
                      </div>
                    </FormField>

                    <FormField
                      label="رقم موبايل إضافي للطوارئ (اختياري)"
                      htmlFor="checkout-alt-phone"
                      error={errors.altPhone}
                    >
                      <div className="relative">
                        <Input
                          id="checkout-alt-phone"
                          type="tel"
                          inputMode="tel"
                          dir="ltr"
                          value={form.altPhone}
                          onChange={(event) =>
                            onFieldChange("altPhone", event.target.value)
                          }
                          placeholder="01xxxxxxxxx"
                          autoComplete="tel"
                          aria-invalid={Boolean(errors.altPhone)}
                          className={`${fieldClassName} pr-10 text-right`}
                        />
                        <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#B88A44]" />
                      </div>
                    </FormField>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="المحافظة"
                      htmlFor="checkout-governorate"
                      required
                      error={errors.governorateSlug}
                    >
                      <div className="relative">
                        <select
                          id="checkout-governorate"
                          value={form.governorateSlug}
                          onChange={(event) =>
                            onFieldChange(
                              "governorateSlug",
                              event.target.value,
                            )
                          }
                          aria-invalid={Boolean(errors.governorateSlug)}
                          className={`${fieldClassName} w-full appearance-none rounded-lg border bg-[#FAF9F6] px-3 pr-10 text-[12px] outline-none transition-colors focus:border-[#B88A44] focus:ring-2 focus:ring-[#B88A44]/15`}
                        >
                          <option value="">اختاري المحافظة</option>
                          {governorates.map((governorate) => (
                            <option
                              key={governorate.slug}
                              value={governorate.slug}
                            >
                              {governorate.name_ar} ({governorate.name_en})
                            </option>
                          ))}
                        </select>
                        <MapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#B88A44]" />
                        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#8C827A]" />
                      </div>
                    </FormField>

                    <FormField
                      label="المنطقة / الحي"
                      htmlFor="checkout-area"
                      required
                      error={errors.area}
                    >
                      <div className="relative">
                        <Input
                          id="checkout-area"
                          value={form.area}
                          onChange={(event) =>
                            onFieldChange("area", event.target.value)
                          }
                          placeholder="مثال: التجمع الخامس"
                          autoComplete="address-level2"
                          aria-invalid={Boolean(errors.area)}
                          className={`${fieldClassName} pr-10`}
                        />
                        <Home className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#B88A44]" />
                      </div>
                    </FormField>
                  </div>

                  <FormField
                    label="العنوان بالتفصيل (رقم العمارة، رقم الشقة أو الفيلا)"
                    htmlFor="checkout-address"
                    required
                    error={errors.address}
                  >
                    <div className="relative">
                      <Textarea
                        id="checkout-address"
                        value={form.address}
                        onChange={(event) =>
                          onFieldChange("address", event.target.value)
                        }
                        placeholder="مثال: شارع التسعين الجنوبي، عمارة 15، الدور الثالث، شقة 6"
                        autoComplete="street-address"
                        aria-invalid={Boolean(errors.address)}
                        className="min-h-[76px] rounded-lg border-[#EAE4DB] bg-[#FAF9F6] px-3 py-2.5 pr-10 text-[12px] text-[#151211] shadow-none placeholder:text-[#A8A19B] focus-visible:border-[#B88A44] focus-visible:ring-[#B88A44]/15"
                      />
                      <MapPin className="pointer-events-none absolute right-3 top-3.5 size-4 text-[#B88A44]" />
                    </div>
                  </FormField>

                  <FormField
                    label="ملاحظات خاصة بمندوب الشحن (اختياري)"
                    htmlFor="checkout-notes"
                    error={errors.notes}
                  >
                    <div className="relative">
                      <Textarea
                        id="checkout-notes"
                        value={form.notes}
                        onChange={(event) =>
                          onFieldChange("notes", event.target.value)
                        }
                        placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة أو ترك الشحنة مع الأمن."
                        className="min-h-[64px] rounded-lg border-[#EAE4DB] bg-[#FAF9F6] px-3 py-2.5 pr-10 text-[12px] text-[#151211] shadow-none placeholder:text-[#A8A19B] focus-visible:border-[#B88A44] focus-visible:ring-[#B88A44]/15"
                      />
                      <StickyNote className="pointer-events-none absolute right-3 top-3.5 size-4 text-[#B88A44]" />
                    </div>
                  </FormField>
                </div>
              </section>

              <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:p-6">
                <SectionHeader
                  icon={<Wallet className="size-4" />}
                  title="طريقة الدفع والتأكيد"
                  description="الدفع الآمن عند استلام طلبك ومعاينته."
                />

                <div className="mt-5 rounded-xl border-2 border-[#B88A44] bg-[#FBF5EC]/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#B88A44]">
                      <span className="size-2.5 rounded-full bg-[#B88A44]" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Wallet className="size-4 text-[#B88A44]" />
                        <p className="text-[13px] font-bold text-[#151211]">
                          الدفع عند الاستلام - COD
                        </p>
                        <span className="rounded bg-[#151211] px-1.5 py-0.5 text-[9px] font-bold text-[#E8B577]">
                          مفضل
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#78716C]">
                        متاح السداد نقداً أو بالبطاقة البنكية مع مندوب الشحن
                        مباشرة عند وصول الشحنة بعد معاينة التغليف الفاخر.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#EADFD0] bg-[#FBF5EC] p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#B88A44]" />
                    <div>
                      <p className="text-[12px] font-bold text-[#8C6426]">
                        تنبيه خاص ببعض الطلبات تحتاج لدفع مبلغ جدية:{" "}
                        <span className="underline">deposit</span>
                      </p>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#8C7A60]">
                        في حال اختيارك لطلب آخر أو رسالة خاصة أو بطاقة إهداء
                        مخصصة، يتم دفع عربون لتأكيد جدية الطلب وبعد التنفيذ يتم
                        إتمام الطلب بسهولة عبر إحدى الوسائل المتاحة أو
                        المحافظ الإلكترونية.
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {[
                          "InstaPay",
                          "Vodafone Cash",
                          "Orange Money",
                          "Etsalat Cash",
                        ].map((method, index) => (
                          <span
                            key={`${method}-${index}`}
                            className="inline-flex items-center gap-1 rounded-md border border-[#E7DCCB] bg-white px-2 py-1 text-[9.5px] font-semibold text-[#57534E]"
                          >
                            <CheckCircle2 className="size-3 text-[#B88A44]" />
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#151211] text-[14px] font-bold text-white shadow-[0_10px_28px_rgba(20,20,20,0.16)] transition-colors hover:bg-[#B88A44] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44] focus-visible:ring-offset-2"
                >
                  {isUpdating ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <MessageCircle className="size-5 fill-white" />
                  )}
                  <span>تأكيد الطلب والمتابعة عبر واتساب</span>
                </button>

                {submitted && (
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#047857]">
                    <CheckCircle2 className="size-4" />
                    تم تجهيز طلبك، أكمل التأكيد في نافذة واتساب.
                  </p>
                )}

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#8C827A]">
                  <ShieldCheck className="size-3.5 text-[#B88A44]" />
                  بياناتك مؤمنة ومشفرة تماماً ولن يتم مشاركتها مع أي طرف ثالث.
                </p>
              </div>
            </form>

            <CheckoutOrderSummary
              lines={lines}
              totals={totals}
              coupon={coupon}
              isUpdating={isUpdating}
              onApplyCoupon={onApplyCoupon}
              onRemoveCoupon={onRemoveCoupon}
            />
          </div>
        )}

        {!isEmpty && !isLoading && (
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[10px] text-[#8C827A]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[#B88A44]" />
              منتجات أصلية 100%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#B88A44]" />
              دفع آمن ومشفّر
            </span>
            <span>الإجمالي المستحق: {formatCurrency(totals.total)}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#F0EBE5] pb-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FBF5EC] text-[#B88A44]">
        {icon}
      </span>
      <div>
        <h2 className="font-alexandria text-[15px] font-bold text-[#151211]">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] text-[#8C827A]">{description}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[11px] font-medium text-[#57534E]"
      >
        {label}
        {required && <span className="text-[#B94727]">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-[10px] font-medium text-[#B94727]">{error}</p>
      )}
    </div>
  );
}
