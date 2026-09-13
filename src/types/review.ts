export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
  helpful?: number;
  createdAt: string;
};
