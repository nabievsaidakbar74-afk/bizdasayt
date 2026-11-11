import { Suspense } from 'react'
import BestSelling from './BestSelling'
import HeroSection from './HeroSection'
import StartExpolingNow from './StartExpolingNow'
import TrendingProducts from './TrendingProducts'
import {
  BrandsSkeleton,
  HeroSkeleton,
  ProductsGridSkeleton,
} from './HomeSkeletons'

export default function HomePage() {
  return (
    <main>
      {/* Har bir bo'lim alohida stream bo'ladi — sahifa bir zumda
          ochiladi, ma'lumotlar tayyor bo'lishi bilan joyiga tushadi */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<ProductsGridSkeleton count={4} />}>
        <TrendingProducts />
      </Suspense>

      <Suspense fallback={<ProductsGridSkeleton count={4} />}>
        <BestSelling />
      </Suspense>

      <Suspense fallback={<BrandsSkeleton />}>
        <StartExpolingNow />
      </Suspense>
    </main>
  )
}
