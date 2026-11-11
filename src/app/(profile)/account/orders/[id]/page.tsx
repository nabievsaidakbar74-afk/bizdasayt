import OrderDetailPage from "@/src/features/account/pages/OrderDetailPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Buyurtma", "Buyurtma tafsilotlari.", "/account/orders");

export default function OrderDetail() {
  return <OrderDetailPage />;
}
