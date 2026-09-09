export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: string;
}
