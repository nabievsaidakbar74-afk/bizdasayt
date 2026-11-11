import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site";

export function pageMeta(
  title: string,
  description = siteConfig.description,
  path = "/",
  options?: { absolute?: boolean },
): Metadata {
  const url = absoluteUrl(path);
  return {
    title: options?.absolute ? { absolute: title } : title,
    description,
    icons: {
      icon: [{ url: siteConfig.favicon, type: "image/x-icon", sizes: "any" }],
      shortcut: siteConfig.favicon,
      apple: siteConfig.favicon,
    },
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
