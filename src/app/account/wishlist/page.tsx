import { DEMO_USER_ID } from "@/constants";
import { WishlistContainer } from "@/features/wishlist";

export default function AccountWishlistPage() {
  return <WishlistContainer userId={DEMO_USER_ID} />;
}
