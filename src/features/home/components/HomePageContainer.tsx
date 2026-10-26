"use client";

import type { HomeContent } from "../types";
import { HomePagePresenter } from "./HomePagePresenter";

type HomePageContainerProps = {
  home: HomeContent | null;
  hasError: boolean;
};

export function HomePageContainer({ home, hasError }: HomePageContainerProps) {
  return <HomePagePresenter home={home} hasError={hasError} />;
}
