import { Suspense } from "react";
import { ProductListContainer } from "@/features/products";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1280px] px-4 py-12">
          <div className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
        </div>
      }
    >
      <ProductListContainer />
    </Suspense>
  );
}