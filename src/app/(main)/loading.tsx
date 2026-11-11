import {
  BrandsSkeleton,
  HeroSkeleton,
  ProductsGridSkeleton,
} from "@/src/features/home/components/HomeSkeletons";

/**
 * Sahifa o'tish jarayonida spinner o'rniga sahifa "shakli" ko'rinadi —
 * foydalanuvchiga kontent deyarli bir zumda ochilgandek tuyuladi.
 */
export default function Loading() {
  return (
    <main>
      <HeroSkeleton />
      <ProductsGridSkeleton count={4} />
      <ProductsGridSkeleton count={4} />
      <BrandsSkeleton />
    </main>
  );
}
