import type { ReactNode } from "react";
import { Lato, Geist } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import AppProvider from "../providers/AppProvider";
import { siteConfig } from "../lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const lato = Lato({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "ecommerce",
  icons: {
    icon: [{ url: siteConfig.favicon, type: "image/x-icon", sizes: "any" }],
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="uz"
      className={cn("h-full", "antialiased", lato.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
