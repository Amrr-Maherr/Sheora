import { SearchResultsContainer } from "@/features/search";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  return (
    <div>
      <h1>Search Page</h1>
      <SearchResultsContainer query={q} />
    </div>
  );
}