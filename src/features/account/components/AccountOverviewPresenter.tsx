"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Copy,
  Crown,
  Heart,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/features/cart/lib/format";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  OrderTrackingTimeline,
  formatItemCount,
  formatOrderDate,
  type TrackedOrder,
} from "@/features/orders";
import { ProductCard } from "@/features/products";
import { cn } from "@/lib/utils";
import type { Address, Coupon, Product } from "@/types";
import { ACCOUNT_LOYALTY_POINTS, type AccountProfile } from "../lib/accountProfile";

type AccountOverviewPresenterProps = {
  profile: AccountProfile;
  orders: TrackedOrder[];
  latestOrder: TrackedOrder | null;
  deliveryAddress: Address | null;
  coupons: Coupon[];
  wishlistCount: number;
  recommendations: Product[];
  isLoadingOrders: boolean;
  isLoadingAddresses: boolean;
  isLoadingRecommendations: boolean;
  onTrackOrder: (order: TrackedOrder) => void;
  onOpenInvoice: (order: TrackedOrder) => void;
};

const QUICK_ACTIONS = [
  {
    href: "/account/orders",
    label: "تتبع طلباتي",
    description: "تابعي حالة شحناتك",
    icon: Truck,
  },
  {
    href: "/account/wishlist",
    label: "قائمة الرغبات",
    description: "منتجاتك المفضلة",
    icon: Heart,
  },
  {
    href: "/account/addresses",
    label: "عناوين التوصيل",
    description: "إدارة عناوينك",
    icon: MapPin,
  },
  {
    href: "/account#coupons",
    label: "قسائم الخصم",
    description: "وفري في مشترياتك",
    icon: TicketPercent,
  },
] as const;

function getCouponValue(coupon: Coupon): string {
  if (coupon.type === "free_shipping") {
    return "شحن مجاني";
  }

  const value = coupon.value ?? coupon.discountPercent;

  if (coupon.type === "fixed") {
    return formatCurrency(value ?? 0);
  }

  return `${value ?? 0}%`;
}

function getCouponMinOrder(coupon: Coupon): number | null {
  const value = coupon.minOrder ?? coupon.minimumOrder;

  return typeof value === "number" && value > 0 ? value : null;
}

function StatusBadge({ order }: { order: TrackedOrder }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        ORDER_STATUS_STYLES[order.status],
      )}
    >
      {ORDER_STATUS_LABELS[order.status]}
    </span>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof ShoppingBag;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-[#EDE8E3] bg-white px-3 py-3 text-center">
      <Icon className="mx-auto size-4 text-[#B88A44]" />
      <p className="mt-1.5 font-alexandria text-[16px] font-bold text-[#151211]">
        {value.toLocaleString("en-US")}
      </p>
      <p className="text-[10px] text-[#8C827A]">{label}</p>
    </div>
  );
}

function CouponRow({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);
  const minOrder = getCouponMinOrder(coupon);

  const handleCopy = () => {
    const result = navigator.clipboard?.writeText(coupon.code);

    if (result) {
      result
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        })
        .catch(() => undefined);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#D8C29A] bg-[#FBF8F2] px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate font-alexandria text-[13px] font-bold text-[#8C6426]">
          {coupon.code}
        </p>
        <p className="mt-0.5 text-[10px] text-[#8C827A]">
          {getCouponValue(coupon)}
          {minOrder ? ` · حد أدنى ${formatCurrency(minOrder)}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`نسخ كود ${coupon.code}`}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#E9D9BE] bg-white px-2 py-1.5 text-[10px] font-semibold text-[#8C6426] transition-colors hover:bg-[#FBF5EC]"
      >
        {copied ? (
          <>
            <Check className="size-3" />
            تم النسخ
          </>
        ) : (
          <>
            <Copy className="size-3" />
            نسخ
          </>
        )}
      </button>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E4DDD3] bg-[#FAF9F7] px-4 py-6 text-center text-[11px] text-[#8C827A]">
      {message}
    </div>
  );
}

export function AccountOverviewPresenter({
  profile,
  orders,
  latestOrder,
  deliveryAddress,
  coupons,
  wishlistCount,
  recommendations,
  isLoadingOrders,
  isLoadingAddresses,
  isLoadingRecommendations,
  onTrackOrder,
  onOpenInvoice,
}: AccountOverviewPresenterProps) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-[#EDE8E3] bg-white shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="relative bg-gradient-to-l from-[#FBF5EC] via-[#FAF9F7] to-white px-5 py-5 sm:px-6">
          <Sparkles className="absolute left-5 top-5 size-10 text-[#E9D9BE]" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#E9D9BE] bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-[#8C6426]">
                <Crown className="size-3" />
                عضوية ذهبية VIP
              </span>
              <h1 className="mt-2 font-alexandria text-[20px] font-bold text-[#151211] sm:text-[23px]">
                أهلاً بكِ، {profile.name}
              </h1>
              <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-[#706E6B] sm:text-[12px]">
                يسعدنا عودتكِ. تابغي طلباتك، اكتشفي أحدث المجموعات، واستفيدي من
                مزايا عضويتك الذهبية.
              </p>
            </div>
            <Link
              href="/account/profile"
              className="inline-flex items-center gap-1 rounded-xl border border-[#E9D9BE] bg-white px-3 py-2 text-[11px] font-semibold text-[#8C6426] transition-colors hover:bg-[#FBF5EC]"
            >
              إدارة الحساب
              <ChevronLeft className="size-3.5" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-[#F0EBE5] p-4">
          <StatCard icon={ShoppingBag} value={orders.length} label="إجمالي الطلبات" />
          <StatCard icon={Heart} value={wishlistCount} label="منتجات مفضلة" />
          <StatCard
            icon={Crown}
            value={ACCOUNT_LOYALTY_POINTS}
            label="نقاط الولاء"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#FBF5EC]">
              <Package className="size-4 text-[#B88A44]" />
            </span>
            <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
              تتبع طلبك الحالي
            </h2>
          </div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6426] hover:text-[#B88A44]"
          >
            كل الطلبات
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        {latestOrder ? (
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF9F7] px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-alexandria text-[13px] font-bold text-[#151211]">
                    #{latestOrder.reference}
                  </p>
                  <StatusBadge order={latestOrder} />
                </div>
                <p className="mt-1 text-[10px] text-[#8C827A]">
                  {formatOrderDate(latestOrder.createdAt)} ·{" "}
                  {formatItemCount(latestOrder.itemCount)} ·{" "}
                  {formatCurrency(latestOrder.totals.total)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenInvoice(latestOrder)}
                  className="rounded-lg border border-[#E4DDD3] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#554F49] transition-colors hover:border-[#B88A44] hover:text-[#8C6426]"
                >
                  الفاتورة
                </button>
                <button
                  type="button"
                  onClick={() => onTrackOrder(latestOrder)}
                  className="rounded-lg bg-[#151211] px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#B88A44]"
                >
                  تتبع عبر واتساب
                </button>
              </div>
            </div>

            <OrderTrackingTimeline status={latestOrder.status} />

            {deliveryAddress && (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#F0EBE5] px-3 py-2.5 text-[10px] leading-relaxed text-[#706E6B]">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#B88A44]" />
                <span>
                  التوصيل إلى: {deliveryAddress.street}، {deliveryAddress.city}
                </span>
              </div>
            )}
          </div>
        ) : isLoadingOrders ? (
          <div className="mt-4 h-36 animate-pulse rounded-xl bg-[#FAF9F7]" />
        ) : (
          <div className="mt-4">
            <EmptyBlock message="لا يوجد طلب نشط حالياً. ابدئي التسوق واكتشفي مجموعاتنا الجديدة." />
            <Link
              href="/products"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6426] hover:text-[#B88A44]"
            >
              تصفح المنتجات
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-[#EDE8E3] bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-[#D8C29A] hover:shadow-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-[#FBF5EC] transition-colors group-hover:bg-[#B88A44]">
                <Icon className="size-4 text-[#B88A44] transition-colors group-hover:text-white" />
              </span>
              <p className="mt-2.5 text-[11px] font-bold text-[#151211]">
                {action.label}
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-[#8C827A]">
                {action.description}
              </p>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
              آخر الطلبات
            </h2>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6426] hover:text-[#B88A44]"
            >
              عرض الكل
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>

          {isLoadingOrders && orders.length === 0 ? (
            <div className="mt-4 space-y-2">
              <div className="h-14 animate-pulse rounded-xl bg-[#FAF9F7]" />
              <div className="h-14 animate-pulse rounded-xl bg-[#FAF9F7]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-4">
              <EmptyBlock message="لم تقومي بأي طلب بعد." />
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-[#F0EBE5]">
              {orders.slice(0, 3).map((order) => (
                <li
                  key={order.reference}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FAF9F7]">
                      <ShoppingBag className="size-4 text-[#B88A44]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-[#151211]">
                        #{order.reference}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-[#8C827A]">
                        {formatOrderDate(order.createdAt)} ·{" "}
                        {formatItemCount(order.itemCount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#151211]">
                      {formatCurrency(order.totals.total)}
                    </span>
                    <StatusBadge order={order} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-[#B88A44]" />
                <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
                  عنوان التوصيل الافتراضي
                </h2>
              </div>
              <Link
                href="/account/addresses"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6426] hover:text-[#B88A44]"
              >
                إدارة
                <ChevronLeft className="size-3.5" />
              </Link>
            </div>

            {isLoadingAddresses ? (
              <div className="mt-4 h-24 animate-pulse rounded-xl bg-[#FAF9F7]" />
            ) : deliveryAddress ? (
              <div className="mt-3 rounded-xl bg-[#FAF9F7] p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-bold text-[#151211]">
                    {deliveryAddress.fullName}
                  </p>
                  {deliveryAddress.isDefault && (
                    <span className="rounded-full bg-[#EEF6F0] px-2 py-0.5 text-[9px] font-semibold text-[#047857]">
                      افتراضي
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-[#706E6B]">
                  {deliveryAddress.street}
                  <br />
                  {deliveryAddress.city}، {deliveryAddress.state}
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#8C827A]">
                  <Phone className="size-3" />
                  <span dir="ltr">{deliveryAddress.phone}</span>
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyBlock message="لم تضيفي عنوان توصيل بعد." />
              </div>
            )}
          </section>

          <section
            id="coupons"
            className="scroll-mt-24 rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]"
          >
            <div className="flex items-center gap-2">
              <TicketPercent className="size-4 text-[#B88A44]" />
              <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
                قسائم الخصم
              </h2>
            </div>

            {coupons.length === 0 ? (
              <div className="mt-4">
                <EmptyBlock message="لا توجد قسائم نشطة حالياً." />
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {coupons.slice(0, 2).map((coupon) => (
                  <CouponRow key={coupon.id} coupon={coupon} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-[#EDE8E3] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-alexandria text-[14px] font-bold text-[#151211]">
              مختارات لكِ
            </h2>
            <p className="mt-0.5 text-[10px] text-[#8C827A]">
              منتجات اخترناها بعناية لتناسب ذوقك
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6426] hover:text-[#B88A44]"
          >
            تصفح كل المجموعات
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        {isLoadingRecommendations ? (
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-[#FAF9F7]"
              />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="mt-4">
            <EmptyBlock message="لا توجد منتجات مقترحة حالياً." />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} variant="home" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
