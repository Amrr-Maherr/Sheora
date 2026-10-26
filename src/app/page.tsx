import { getHomeContent } from "@/features/home/api/homeApi";
import { HomePageContainer } from "@/features/home";
import type { HomeContent } from "@/features/home/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let home: HomeContent | null = null;
  let hasError = false;

  try {
    home = await getHomeContent();
  } catch (error) {
    hasError = true;
    console.error("Unable to load homepage content", error);
  }

  return <HomePageContainer home={home} hasError={hasError} />;
}
