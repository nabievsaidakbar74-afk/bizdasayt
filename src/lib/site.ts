function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Bizda",
  tagline: "Texnologiya — bitta joyda",
  description:
    "Bizda — elektronika, gadget va texnika uchun onlayn do‘kon. Qulay narxlar, tez yetkazib berish va yetkazib berganda naqd to‘lov.",
  url: siteUrl(),
  ogImage: "/img/og-image.png",
  favicon: "/favicon.ico",
  locale: "uz_UZ",
  keywords: [
    "Bizda",
    "onlayn do‘kon",
    "elektronika",
    "smartfon",
    "noutbuk",
    "gadget",
    "O‘zbekiston",
    "yetkazib berish",
  ],
};

export const absoluteUrl = (path = "/") =>
  new URL(path, siteConfig.url).toString();
