import CheckoutPage from "@/src/features/cart/pages/CheckoutPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta(
  "Rasmiylashtirish",
  "Buyurtmani rasmiylashtirish: manzil, yetkazib berish va naqd to‘lov.",
  "/cart/checkout",
);

export default function Checkout() {
  return <CheckoutPage />;
}
