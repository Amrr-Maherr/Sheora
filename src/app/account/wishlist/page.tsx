import { WishlistContainer } from "@/features/wishlist";
import { DEMO_USER_ID } from "@/constants";

export default function AccountWishlistPage() {
  return (
    <div>
      <h1>Account Wishlist Page</h1>
      <WishlistContainer userId={DEMO_USER_ID} />
    </div>
  );
}