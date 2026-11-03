import { cn } from "@/lib/utils";

const STEPS = [
  "البيانات والتوصيل",
  "تأكيد الأوردر والواتساب",
  "الاستلام والدفع",
] as const;

type CheckoutStepperProps = {
  currentStep?: 1 | 2 | 3;
  labels?: readonly string[];
};

export function CheckoutStepper({
  currentStep = 1,
  labels = STEPS,
}: CheckoutStepperProps) {
  return (
    <ol className="flex items-start">
      {labels.slice(0, STEPS.length).map((step, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <li
            key={step}
            className={cn(
              "flex items-start",
              index < labels.length - 1 ? "flex-1" : "flex-none",
            )}
          >
            <div className="flex min-w-[92px] flex-col items-center gap-2 sm:min-w-[140px]">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-[12px] font-bold transition-colors",
                  isActive
                    ? "border-[#151211] bg-[#151211] text-white"
                    : isCompleted
                      ? "border-[#B88A44] bg-[#B88A44] text-white"
                      : "border-[#DDD5CB] bg-white text-[#8C827A]",
                )}
              >
                {stepNumber}
              </span>
              <span
                className={cn(
                  "text-center text-[10px] leading-tight sm:text-[11px]",
                  isActive
                    ? "font-bold text-[#151211]"
                    : "font-medium text-[#8C827A]",
                )}
              >
                {step}
              </span>
            </div>
            {index < labels.length - 1 && (
              <span
                className={cn(
                  "mt-4 h-0.5 flex-1 rounded-full",
                  index < currentStep ? "bg-[#B88A44]" : "bg-[#EDE8E3]",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
