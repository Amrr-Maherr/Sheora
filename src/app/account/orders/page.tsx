import { OrdersContainer } from "@/features/orders";
import { DEMO_USER_ID } from "@/constants";

export default function AccountOrdersPage() {
  return (
    <div>
      <h1>Account Orders Page</h1>
      <OrdersContainer userId={DEMO_USER_ID} />
    </div>
  );
}