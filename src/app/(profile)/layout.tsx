import Footer from '@/src/components/Footer'
import Header from '@/src/components/Header'
import ProtectedProvider from '@/src/providers/ProtectedProvider'
import React, { ReactNode } from 'react'
import type { Metadata } from 'next'
import { siteConfig } from '@/src/lib/site'

export const metadata: Metadata = {
  title: {
    default: "Kabinet",
    template: "%s | Bizda",
  },
  icons: {
    icon: [{ url: siteConfig.favicon, type: "image/x-icon", sizes: "any" }],
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
  robots: { index: false, follow: false },
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-1">
                <ProtectedProvider>{children}</ProtectedProvider>
            </main>
            <Footer />
        </>
    )
}
