export type Question = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answer: string;
  answeredBy: string;
  helpful?: number;
  createdAt: string;
};
