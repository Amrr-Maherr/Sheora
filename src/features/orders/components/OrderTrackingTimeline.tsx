import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_STEP,
  ORDER_TRACKING_STEPS,
} from "../lib/orderStatus";
import type { TrackedOrderStatus } from "../lib/orderStorage";

type OrderTrackingTimelineProps = {
  status: TrackedOrderStatus;
  className?: string;
};

export function OrderTrackingTimeline({
  status,
  className,
}: OrderTrackingTimelineProps) {
  const currentStep = Math.max(0, ORDER_STATUS_STEP[status]);
  const progress =
    ORDER_TRACKING_STEPS.length > 1
      ? (currentStep / (ORDER_TRACKING_STEPS.length - 1)) * 100
      : 0;

  return (
    <div className={cn("relative mt-6", className)}>
      <span className="absolute inset-x-0 top-4 h-0.5 rounded-full bg-[#EDE8E3]" />
      <span
        className="absolute right-0 top-4 h-0.5 rounded-full bg-[#B88A44]"
        style={{ width: `${progress}%` }}
      />
      <ol className="relative grid grid-cols-4 gap-2">
        {ORDER_TRACKING_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li
              key={step.title}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                  isDone
                    ? "border-[#B88A44] bg-[#B88A44] text-white"
                    : isActive
                      ? "border-[#C59A52] bg-white text-[#B88A44] ring-4 ring-[#FBF5EC]"
                      : "border-[#E4DDD3] bg-white text-[#B9B1A7]",
                )}
              >
                {isDone ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold leading-tight sm:text-[11px]",
                  isDone || isActive ? "text-[#151211]" : "text-[#8C827A]",
                )}
              >
                {step.title}
              </span>
              <span className="hidden text-[10px] leading-relaxed text-[#A8A19B] sm:block">
                {step.description}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
