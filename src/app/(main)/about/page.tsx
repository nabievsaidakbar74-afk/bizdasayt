import AboutPage from '@/src/features/about/components/AboutPage'
import { pageMeta } from '@/src/lib/seo'
import React from 'react'

export const metadata = pageMeta(
  "Biz haqimizda",
  "Bizda haqida: onlayn do‘kon, yetkazib berish va mijozlarga xizmat.",
  "/about",
)

export default function About() {
    return <AboutPage />
}
