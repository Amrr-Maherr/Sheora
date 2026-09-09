"use client";

import { useReviews } from "../hooks";
import { ReviewsPresenter } from "./ReviewsPresenter";

type ReviewsContainerProps = {
  productId?: string;
}

export function ReviewsContainer({ productId }: ReviewsContainerProps) {
  const { data: reviews = [], isLoading, isError } = useReviews(productId);

  return (
    <ReviewsPresenter
      reviews={reviews}
      isLoading={isLoading}
      isError={isError}
    />
  );
}