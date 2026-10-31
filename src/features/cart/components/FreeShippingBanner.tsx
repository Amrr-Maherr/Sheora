import { Sparkles, MapPin } from "lucide-react";
import { formatCurrency } from "../lib/format";

type FreeShippingBannerProps = {
  subtotal: number;
  threshold?: number | null;
  isFreeShipping?: boolean;
  shippingFee?: number;
  governorateName?: string | null;
};

export function FreeShippingBanner({
  subtotal,
  threshold,
  isFreeShipping = false,
  shippingFee = 0,
  governorateName,
}: FreeShippingBannerProps) {
  // If no governorate is selected or no threshold configured
  if (!threshold) {
    return (
      <div className="rounded-lg border border-[#E2D2BC] bg-gradient-to-b from-[#FCF8F1] to-[#FAF5EC] px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold leading-5 text-[#2C2419]">
          <MapPin className="size-3 shrink-0 text-[#B88B4A]" />
          <span>حددي المحافظة في الملخص بالأسفل لحساب الشحن بدقة</span>
        </div>
        <p className="mt-1 text-[10px] leading-4 text-[#78716C]">
          تتوفر ميزة الشحن المجاني وفقاً للحد الأدنى المحدد لكل محافظة
        </p>
      </div>
    );
  }

  const qualified = isFreeShipping || subtotal >= threshold;
  const percent = Math.min(
    100,
    Math.round((subtotal / threshold) * 100),
  );
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <div className="rounded-lg border border-[#E2D2BC] bg-gradient-to-b from-[#FCF8F1] to-[#FAF5EC] px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold leading-5 text-[#2C2419]">
          <Sparkles className="size-3 shrink-0 text-[#B88B4A]" />
          {qualified
            ? `مبروك! حصلتِ على شحن مجاني${governorateName ? ` إلى ${governorateName}` : ""}`
            : `أضيفي ${formatCurrency(remaining)} للحصول على شحن مجاني`}
        </p>
        <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#8C672B]">
          {percent}% مكتمل
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="تقدم الشحن المجاني"
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5DACE]"
      >
        <div
          className="h-full rounded-full bg-[#B88B4A] transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-1.5 text-center text-[10px] leading-4 text-[#78716C]">
        {qualified
          ? `طلبك مؤهل للشحن المجاني${governorateName ? ` إلى ${governorateName}` : ""}`
          : shippingFee > 0
            ? `الشحن ${formatCurrency(shippingFee)} — مجاني للطلبات فوق ${formatCurrency(threshold)}`
            : `شحن مجاني للطلبات فوق ${formatCurrency(threshold)}`}
      </p>
    </div>
  );
}
