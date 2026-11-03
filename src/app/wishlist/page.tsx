import { DEMO_USER_ID } from "@/constants";
import { WishlistContainer } from "@/features/wishlist";

export default function WishlistPage() {
  return (
    <div className="w-full bg-[#FAF9F7] py-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <WishlistContainer userId={DEMO_USER_ID} />
      </div>
    </div>
  );
}
