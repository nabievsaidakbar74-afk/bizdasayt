import SettingsPage from "@/src/features/account/pages/SettingsPage";
import { pageMeta } from "@/src/lib/seo";

export const metadata = pageMeta("Sozlamalar", "Profil, parol va hisob sozlamalari.", "/account/settings");

export default function Settings() {
  return <SettingsPage />;
}
