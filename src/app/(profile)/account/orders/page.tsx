import OrdersPage from "@/src/features/account/pages/OrdersPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Buyurtmalar", "Buyurtmalar tarixi va holati.", "/account/orders");

export default function Orders() {
  return <OrdersPage />;
}
