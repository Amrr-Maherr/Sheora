import { WishlistContainer } from "@/features/wishlist";
import { DEMO_USER_ID } from "@/constants";

export default function WishlistPage() {
  return (
    <div>
      <h1>Wishlist Page</h1>
      <WishlistContainer userId={DEMO_USER_ID} />
    </div>
  );
}