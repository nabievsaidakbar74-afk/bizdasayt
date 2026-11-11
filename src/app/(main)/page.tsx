import HomePage from "@/src/features/home/components/HomePage";
import { pageMeta } from "@/src/lib/seo";
import { siteConfig } from "@/src/lib/site";

export const metadata = pageMeta(
  `${siteConfig.name} — ${siteConfig.tagline}`,
  siteConfig.description,
  "/",
  { absolute: true },
);

// ISR — sahifa 60 soniyada qayta generatsiya qilinadi.
// Shuning uchun foydalanuvchiga doim tayyor (keshlangan) HTML
// darhol qaytadi — loading spinner ko'rinmaydi.
export const revalidate = 60;

export default function Home() {
  return <HomePage />
}
