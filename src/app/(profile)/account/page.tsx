import AccountOverview from "@/src/features/account/pages/AccountOverview";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Kabinet", "Shaxsiy kabinet: buyurtmalar, sevimlilar va sozlamalar.", "/account");

export default function Account() {
  return <AccountOverview />;
}
