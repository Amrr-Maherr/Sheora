import { LaravelProductDetailContainer } from "@/features/products";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  return <LaravelProductDetailContainer slug={slug} />;
}
