import { CartContainer } from "@/features/cart";
import { DEMO_USER_ID } from "@/constants";

export default function CartPage() {
  return (
    <div>
      <h1>Cart Page</h1>
      <CartContainer userId={DEMO_USER_ID} />
    </div>
  );
}