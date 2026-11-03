"use client";

import Link from "next/link";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Download,
  Hash,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/features/cart/lib/format";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  OrderTrackingTimeline,
  formatItemCount,
  formatOrderDate,
  formatOrderTime,
  type TrackedOrder,
} from "@/features/orders";
import { cn } from "@/lib/utils";

const CONFIRMATION_STEPS = [
  "تم تأكيد الطلب بنجاح!",
  "تأكيد الأوردر",
  "البيانات والتوصيل",
] as const;

type CheckoutSuccessPresenterProps = {
  order: TrackedOrder | null;
  isLoading: boolean;
  supportPhone: string | null;
  onTrackOrder: (order: TrackedOrder) => void;
  onDownloadInvoice: (order: TrackedOrder) => void;
};

function getDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 2) {
    return fullName.trim();
  }

  return parts.slice(0, 2).join(" ");
}

function getAddressParts(order: TrackedOrder): string[] {
  return [order.customer.governorate, order.customer.area, order.customer.address]
    .filter(Boolean)
    .filter((part, index, parts) => parts.indexOf(part) === index);
}

function Breadcrumb({ reference }: { reference?: string }) {
  return (
    <nav
      aria-label="مسار التنقل"
      className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-[#8C827A]"
    >
      <Link href="/" className="transition-colors hover:text-[#B88A44]">
        الرئيسية
      </Link>
      <span>/</span>
      <Link href="/account" className="transition-colors hover:text-[#B88A44]">
        حسابي
      </Link>
      <span>/</span>
      <span className="font-semibold text-[#151211]">تأكيد وتتبع الطلب</span>
      {reference && <span className="text-[#B88A44]">(#{reference})</span>}
    </nav>
  );
}

function ConfirmationSteps() {
  return (
    <ol className="flex items-start">
      {CONFIRMATION_STEPS.map((label, index) => (
        <li
          key={label}
          className={cn("flex items-start", index < 2 ? "flex-1" : "flex-none")}
        >
          <div className="flex min-w-[96px] flex-col items-center gap-2 sm:min-w-[150px]">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full border-2 text-[12px] font-bold",
                index === 0
                  ? "border-[#C59A52] bg-[#C59A52] text-white ring-4 ring-[#FBF5EC]"
                  : "border-[#E6DDCE] bg-white text-[#B9B1A7]",
              )}
            >
              {index === 0 ? <Check className="size-4" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-center text-[10px] leading-tight sm:text-[11px]",
                index === 0
                  ? "font-bold text-[#151211]"
                  : "font-medium text-[#8C827A]",
              )}
            >
              {label}
            </span>
          </div>
          {index < 2 && (
            <span className="mt-4 h-0.5 flex-1 rounded-full bg-[#D8C29A]" />
          )}
        </li>
      ))}
    </ol>
  );
}

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E9DFCF] bg-white/80 px-3 py-1.5 text-[11px] text-[#706E6B] shadow-[0_1px_2px_rgba(20,20,20,0.03)]">
      <span className="text-[#B88A44]">{icon}</span>
      <span>{label}</span>
      <span className="font-bold text-[#151211]">{value}</span>
    </span>
  );
}

function OrderItemRow({ order }: { order: TrackedOrder }) {
  return (
    <div className="space-y-3">
      {order.items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-[#EDE8E3] bg-[#FAF8F5]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-contain p-1.5"
                loading="lazy"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[#B9B1A7]">
                <Package className="size-5" />
              </span>
            )}
            <span className="absolute -bottom-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full bg-[#151211] text-[9px] font-bold text-white">
              {item.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-[#151211]">
              {item.name}
            </p>
            <p className="truncate text-[10px] text-[#8C827A]">
              {item.variantName ?? item.note ?? "منتج شيورا"}
            </p>
            {item.customization && (
              <span className="mt-1 inline-flex rounded-full bg-[#FBF5EC] px-2 py-0.5 text-[9px] font-semibold text-[#8C6426]">
                {item.customization}
              </span>
            )}
          </div>
          <span className="shrink-0 text-[12px] font-bold text-[#151211]">
            {formatCurrency(item.lineTotal)}
          </span>
        </div>
      ))}
    </div>
  );
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FBF5EC] text-[#B88A44]">
        {icon}
      </span>
      <div>
        <p className="text-[12px] font-bold text-[#151211]">{title}</p>
        <p className="mt-0.5 text-[10px] text-[#8C827A]">{description}</p>
      </div>
    </div>
  );
}

export function CheckoutSuccessPresenter({
  order,
  isLoading,
  supportPhone,
  onTrackOrder,
  onDownloadInvoice,
}: CheckoutSuccessPresenterProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-[#FAF9F7] py-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
          <div className="mb-4 h-4 w-64 animate-pulse rounded bg-[#EDE8E3]" />
          <div className="mb-5 h-24 animate-pulse rounded-2xl border border-[#EDE8E3] bg-white" />
          <div className="h-64 animate-pulse rounded-2xl border border-[#EDE8E3] bg-white" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full bg-[#FAF9F7] py-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
          <Breadcrumb />
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#EDE8E3] bg-white px-4 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#FBF5EC] text-[#B88A44]">
              <Package className="size-7" />
            </span>
            <div>
              <h1 className="font-alexandria text-[18px] font-bold text-[#151211]">
                لم نعثر على تفاصيل هذا الطلب
              </h1>
              <p className="mt-1 text-[12px] text-[#78716C]">
                قد يكون الطلب محفوظاً على جهاز آخر. يمكنكِ بدء طلب جديد أو تصفح
                منتجاتنا.
              </p>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/products"
                className="rounded-xl bg-[#141414] px-5 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#B88A44]"
              >
                تصفحي المنتجات
              </Link>
              <Link
                href="/account"
                className="rounded-xl border border-[#E4DDD3] bg-white px-5 py-2.5 text-[12px] font-bold text-[#151211] transition-colors hover:border-[#B88A44] hover:text-[#B88A44]"
              >
                العودة لحسابي
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = getDisplayName(order.customer.fullName);
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const addressParts = getAddressParts(order);
  const supportDigits = (supportPhone ?? order.supportPhone ?? "").replace(/\D/g, "");

  return (
    <div className="w-full bg-[#FAF9F7] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <Breadcrumb reference={order.reference} />

        <div className="mb-5 rounded-2xl border border-[#EDE8E1] bg-white px-4 py-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:px-8">
          <ConfirmationSteps />
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-[#EDE4D4] bg-gradient-to-l from-[#FBF5EC] via-[#FDFBF8] to-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:p-8">
          <span className="pointer-events-none absolute -left-10 -top-12 size-44 rounded-full bg-[#B88A44]/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-16 left-1/3 size-52 rounded-full bg-[#E8B577]/10 blur-3xl" />
          <Sparkles className="pointer-events-none absolute left-6 top-6 hidden size-10 text-[#D8B878]/40 sm:block" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E9D9BE] bg-white/80 px-3 py-1 text-[10px] font-bold text-[#8C6426]">
              <CheckCircle2 className="size-3.5" />
              تم استلام الأوردر بنجاح
            </span>
            <h1 className="mt-3 max-w-3xl font-alexandria text-[24px] font-bold leading-tight text-[#151211] sm:text-[30px]">
              شكراً لكِ {displayName}، تم تأكيد طلبك بنجاح!
            </h1>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[#706E6B]">
              أرسلنا تفاصيل الطلب والفاتورة إلى واتساب{" "}
              <span dir="ltr" className="font-semibold text-[#151211]">
                {order.customer.phone}
              </span>
              . يمكنكِ متابعة حالة الطلب من هنا في أي وقت.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <MetaChip
                icon={<Hash className="size-3.5" />}
                label="رقم الطلب"
                value={`#${order.reference}`}
              />
              <MetaChip
                icon={<CalendarDays className="size-3.5" />}
                label="تاريخ الطلب"
                value={formatOrderDate(order.createdAt)}
              />
              <MetaChip
                icon={<Wallet className="size-3.5" />}
                label="الإجمالي"
                value={formatCurrency(order.totals.total)}
              />
              <MetaChip
                icon={<ShoppingBag className="size-3.5" />}
                label="المنتجات"
                value={formatItemCount(order.itemCount)}
              />
            </div>
          </div>
        </section>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-alexandria text-[17px] font-bold text-[#151211]">
                  تتبع طلبك
                </h2>
                <p className="mt-1 text-[11px] text-[#8C827A]">
                  آخر تحديث: {formatOrderDate(order.createdAt)} -{" "}
                  {formatOrderTime(order.createdAt)}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold",
                  ORDER_STATUS_STYLES[order.status],
                )}
              >
                <Package className="size-3.5" />
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            {isCancelled ? (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[12px] leading-relaxed text-red-700">
                تم إلغاء هذا الطلب. إذا كان لديكِ أي استفسار، يرجى التواصل معنا
                عبر واتساب.
              </div>
            ) : (
              <OrderTrackingTimeline status={order.status} />
            )}

            <div className="mt-6 rounded-xl bg-[#FAF9F7] p-3.5">
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="font-semibold text-[#151211]">
                  {isDelivered
                    ? "تم توصيل طلبك بنجاح"
                    : "التوصيل المتوقع خلال 2 - 4 أيام عمل"}
                </span>
                <span className="text-[#8C827A]">
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-[#F0EBE5] pt-5">
              <h3 className="mb-3 text-[12px] font-bold text-[#151211]">
                منتجات الطلب
              </h3>
              <OrderItemRow order={order} />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onTrackOrder(order)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#151211] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#B88A44]"
              >
                <MessageCircle className="size-4" />
                متابعة التتبع عبر الواتساب
              </button>
              <button
                type="button"
                onClick={() => onDownloadInvoice(order)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4DDD3] bg-white px-4 text-[12px] font-bold text-[#151211] transition-colors hover:border-[#B88A44] hover:text-[#B88A44]"
              >
                <Download className="size-4" />
                تحميل الفاتورة
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-alexandria text-[15px] font-bold text-[#151211]">
                  ملخص الطلب
                </h2>
                <span className="rounded-full bg-[#FAF9F7] px-2.5 py-1 text-[10px] font-semibold text-[#8C827A]">
                  {formatItemCount(order.itemCount)}
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between text-[#706E6B]">
                  <span>مجموع المنتجات</span>
                  <span className="font-semibold text-[#151211]">
                    {formatCurrency(order.totals.subtotal)}
                  </span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex items-center justify-between text-[#706E6B]">
                    <span>
                      الخصم
                      {order.totals.couponCode
                        ? ` (${order.totals.couponCode})`
                        : ""}
                    </span>
                    <span className="font-semibold text-[#047857]">
                      -{formatCurrency(order.totals.discount)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#706E6B]">
                  <span>مصاريف الشحن</span>
                  <span className="font-semibold text-[#047857]">
                    {order.totals.shipping > 0
                      ? formatCurrency(order.totals.shipping)
                      : "مجاني"}
                  </span>
                </div>
                {order.totals.deposit > 0 && (
                  <div className="flex items-center justify-between text-[#706E6B]">
                    <span>العربون المدفوع</span>
                    <span className="font-semibold text-[#151211]">
                      {formatCurrency(order.totals.deposit)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-[#F0EBE5] pt-3">
                  <span className="text-[13px] font-bold text-[#151211]">
                    الإجمالي
                  </span>
                  <span className="font-alexandria text-[16px] font-bold text-[#151211]">
                    {formatCurrency(order.totals.total)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#FAF9F7] p-3 text-[11px]">
                <span className="text-[#8C827A]">طريقة الدفع</span>
                <span className="text-left font-semibold text-[#151211]">
                  {order.paymentMethod}
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#FBF5EC] text-[#B88A44]">
                  <MapPin className="size-4" />
                </span>
                <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
                  عنوان التوصيل
                </h2>
              </div>
              <p className="mt-3 text-[12px] font-bold text-[#151211]">
                {order.customer.fullName}
              </p>
              <p className="mt-0.5 text-[11px]" dir="ltr">
                <span className="text-[#706E6B]">{order.customer.phone}</span>
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-[#706E6B]">
                {addressParts.join(" - ")}
              </p>
              {order.customer.notes && (
                <p className="mt-2 rounded-lg bg-[#FAF9F7] p-2 text-[10px] leading-relaxed text-[#8C827A]">
                  {order.customer.notes}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
              <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
                هل تحتاجين مساعدة؟
              </h2>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#706E6B]">
                فريق شيورا جاهز لمساعدتك في متابعة الطلب أو تعديل العنوان.
              </p>
              <div className="mt-3 space-y-2 text-[11px]">
                {supportDigits && (
                  <a
                    href={`https://wa.me/${supportDigits}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#FAF9F7] px-3 py-2 text-[#151211] transition-colors hover:text-[#B88A44]"
                  >
                    <MessageCircle className="size-3.5 text-[#B88A44]" />
                    <span dir="ltr">{supportPhone ?? order.supportPhone}</span>
                  </a>
                )}
                <div className="flex items-center gap-2 rounded-lg bg-[#FAF9F7] px-3 py-2 text-[#706E6B]">
                  <Phone className="size-3.5 text-[#B88A44]" />
                  <span dir="ltr">{order.customer.phone}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-5 grid gap-4 rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:grid-cols-3">
          <TrustItem
            icon={<Truck className="size-4" />}
            title="شحن سريع"
            description="توصيل خلال 2 - 4 أيام عمل"
          />
          <TrustItem
            icon={<ShieldCheck className="size-4" />}
            title="دفع آمن عند الاستلام"
            description="افحصي طلبك قبل الدفع"
          />
          <TrustItem
            icon={<PackageCheck className="size-4" />}
            title="تغليف فاخر"
            description="كل طلب يصل بتغليف شيورا المميز"
          />
        </section>
      </div>
    </div>
  );
}
