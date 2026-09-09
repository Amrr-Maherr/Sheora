import { ProductDetailContainer } from "@/features/products";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <div>
      <h1>Product Detail Page</h1>
      <ProductDetailContainer productId={id} />
    </div>
  );
}