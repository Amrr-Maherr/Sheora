import { BrandProductsContainer } from "@/features/products";

type BrandProductsPageProps = {
  params: Promise<{ slug: string }>;
}

export default async function BrandProductsPage({
  params,
}: BrandProductsPageProps) {
  const { slug } = await params;

  return (
    <div>
      <h1>Brand Products Page</h1>
      <BrandProductsContainer slug={slug} />
    </div>
  );
}