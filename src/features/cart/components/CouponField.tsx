"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppliedCoupon, CouponResult } from "../types";

type CouponFieldProps = {
  coupon: AppliedCoupon | null;
  onApply: (code: string) => Promise<CouponResult> | CouponResult;
  onRemove: () => void;
};

export function CouponField({ coupon, onApply, onRemove }: CouponFieldProps) {
  const [code, setCode] = useState(coupon?.code ?? "");
  const [feedback, setFeedback] = useState<CouponResult | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      setFeedback({ ok: false, message: "أدخل كود الخصم أولاً" });
      return;
    }

    setIsApplying(true);
    try {
      const result = await onApply(code);
      setFeedback(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "كود الخصم غير صالح";
      setFeedback({ ok: false, message: msg });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <section aria-label="كود الخصم" className="pt-1">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex h-9 flex-1 items-center rounded-lg border border-[#EAE4DB] bg-[#FAF9F6] px-3 transition-colors focus-within:border-[#B88A44] focus-within:ring-2 focus-within:ring-[#B88A44]/15">
          <input
            type="text"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setFeedback(null);
            }}
            placeholder="أدخل كود الخصم"
            aria-label="كود الخصم"
            aria-invalid={feedback?.ok === false}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-[12px] font-bold tracking-[0.06em] text-[#292524] uppercase outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A8A19B]"
          />
        </div>

        <button
          type="submit"
          disabled={isApplying}
          className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1C1A18] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#B88A44] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44] focus-visible:ring-offset-2"
        >
          {isApplying ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            "تطبيق"
          )}
        </button>
      </form>

      {feedback && (
        <div
          aria-live="polite"
          className={cn(
            "mt-1.5 flex items-center gap-1.5 text-[10px] font-medium",
            feedback.ok ? "text-[#047857]" : "text-[#B94727]",
          )}
        >
          {feedback.ok ? (
            <CheckCircle2 className="size-3.5 shrink-0" />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#B94727]/10 text-[9px] font-bold"
            >
              !
            </span>
          )}
          <span className="flex-1">{feedback.message}</span>
          {feedback.ok && (
            <button
              type="button"
              onClick={() => {
                onRemove();
                setFeedback(null);
                setCode("");
              }}
              aria-label="إزالة كود الخصم"
              className="relative rounded p-0.5 text-[#78716C] transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-[#B94727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      )}

      {!feedback && coupon && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-[#047857]">
          <CheckCircle2 className="size-3.5 shrink-0" />
          <span className="flex-1">تم تطبيق كود الخصم ({coupon.label})</span>
          <button
            type="button"
            onClick={() => {
              onRemove();
              setCode("");
            }}
            aria-label="إزالة كود الخصم"
            className="relative rounded p-0.5 text-[#78716C] transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-[#B94727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A44]"
          >
            <X className="size-3" />
          </button>
        </p>
      )}
    </section>
  );
}
