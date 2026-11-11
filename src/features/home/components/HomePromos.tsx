import { getHomePromos } from '@/src/services/getHomePromos'
import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'

type PromoProduct = {
  id: string
  name: string
  slug: string
  price: number
  oldPrice: number
  discountPercent: number
  discountAmount: number
  inStock: boolean
  image: string | null
}

type HomePromo = {
  id: string
  type: 'PROMO' | 'CATEGORY' | 'BANNER' | 'DEAL'
  title: string
  subtitle: string | null
  image: string | null
  buttonText: string
  link: string
  badgeText: string | null
  sortOrder: number
  position?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  products?: PromoProduct[]
  product?: PromoProduct
}

export default async function HomePromos() {
  const data: HomePromo[] = await getHomePromos()

  if (!data?.length) return null

  const sortedData = [...data].sort((a, b) => a.sortOrder - b.sortOrder)
  const banners = sortedData.filter((item) => item.type === 'BANNER')

  if (!banners.length) return null

  return (
    <section className="mx-auto w-full max-w-310 px-4 pb-14">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link || '/products'}
            className="group relative h-36 overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundPosition: banner.position,
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition group-hover:from-black/80" />

            {/* Badge */}
            {banner.badgeText && (
              <span className="absolute left-3 top-3 rounded-full bg-[#4caf7d] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                {banner.badgeText}
              </span>
            )}

            {/* Banner content */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white">
              <div className="min-w-0">
                <h3 className="truncate text-base font-extrabold tracking-wide drop-shadow">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="mt-0.5 truncate text-xs text-white/80">
                    {banner.subtitle}
                  </p>
                )}
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/30 transition-all duration-300 group-hover:bg-[#4caf7d] group-hover:ring-[#4caf7d]">
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
