import AddressesPage from "@/src/features/account/pages/AddressesPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Manzillar", "Yetkazib berish manzillari.", "/account/addresses");

export default function Addresses() {
  return <AddressesPage />;
}
