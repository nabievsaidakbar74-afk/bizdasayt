import CartPage from "@/src/features/cart/pages/CartPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta(
  "Savat",
  "Tanlangan mahsulotlar savati. Buyurtmani rasmiylashtirish va yetkazib berganda to‘lov.",
  "/cart",
);


export default function Cart() {
  return <CartPage />;
}
