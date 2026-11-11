import ContactPage from '@/src/features/contact/components/ContactPage'
import { pageMeta } from '@/src/lib/seo'
import React from 'react'

export const metadata = pageMeta(
  "Aloqa",
  "Bizda bilan bog‘laning: savollar, buyurtma va yordam.",
  "/contact",
)

export default function Contact() {
    return <ContactPage />
}
