import { CategoryProductsContainer } from "@/features/products";

type CategoryProductsPageProps = {
  params: Promise<{ slug: string }>;
}

export default async function CategoryProductsPage({
  params,
}: CategoryProductsPageProps) {
  const { slug } = await params;

  return <CategoryProductsContainer slug={slug} />;
}