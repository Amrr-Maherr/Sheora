import { Suspense } from "react";
import { CheckoutSuccessContainer } from "@/features/checkout";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContainer />
    </Suspense>
  );
}
