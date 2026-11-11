import ReviewsPage from "@/src/features/account/pages/ReviewsPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Reviewlar", "Mahsulotlarga qoldirilgan baholar.", "/account/reviews");

export default function Reviews() {
  return <ReviewsPage />;
}
