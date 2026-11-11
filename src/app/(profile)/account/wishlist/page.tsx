import AccountWishlistPage from "@/src/features/account/pages/AccountWishlistPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Sevimlilar", "Kabinetdagi sevimli mahsulotlar.", "/account/wishlist");

export default function AccountWishlist() {
  return <AccountWishlistPage />;
}
