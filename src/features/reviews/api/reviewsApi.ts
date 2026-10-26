import { laravelApiClient } from "@/services/api";
import type { Review } from "@/types";

export type LaravelReview = {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  title?: string | null;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at?: string | null;
};

export function mapReview(review: LaravelReview): Review {
  return {
    id: String(review.id),
    productId: String(review.product_id),
    userId: "",
    userName: review.user_name,
    rating: review.rating,
    title: review.title ?? "",
    comment: review.comment,
    verifiedPurchase: review.verified_purchase,
    helpful: review.helpful_count,
    createdAt: review.created_at ?? "",
  };
}

export const reviewsApi = {
  getReviews: async (productId?: string): Promise<Review[]> => {
    const response = await laravelApiClient.getCollection<LaravelReview>(
      "/reviews",
      {
        params: {
          per_page: 50,
          ...(productId ? { product_id: productId } : {}),
        },
      },
    );

    return response.data.map(mapReview);
  },

  getHomeReviews: async (
    perPage = 3,
  ): Promise<{ reviews: Review[]; total: number }> => {
    const response = await laravelApiClient.getCollection<LaravelReview>(
      "/reviews",
      { params: { per_page: perPage } },
    );

    return {
      reviews: response.data.map(mapReview),
      total: response.meta.total,
    };
  },
};
