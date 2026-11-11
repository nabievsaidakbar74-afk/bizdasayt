'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Segmentlarni o'zbekchaga tarjima qilish
const LABELS: Record<string, string> = {
  products: 'Mahsulotlar',
  categories: 'Kategoriyalar',
  cart: 'Savat',
  wishlist: 'Sevimlilar',
  profile: 'Profil',
}

// Ko'rinmasligi kerak bo'lgan texnik segmentlar
const HIDDEN = new Set(['all'])

// UUID kabi uzun identifikatorlarni aniqlash
const isId = (s: string) => /^[0-9a-f-]{20,}$/i.test(s)

export default function Breadcrumb() {
  const pathname = usePathname()
  const pathNames = pathname
    .split('/')
    .filter(Boolean)
    .filter((item) => !HIDDEN.has(item))

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Link
        href="/"
        className="flex items-center text-sm font-normal text-gray-400 transition hover:text-[#399765]"
      >
        <span>Bosh sahifa</span>
        {pathNames.length > 0 && <ChevronRight size={18} />}
      </Link>

      {pathNames.map((item, index) => {
        // Link asl pathname'dagi segmentlar bilan qurilishi kerak
        // ("all" yashirilgan bo'lsa ham yo'l to'g'ri ishlashi uchun)
        const rawSegments = pathname.split('/').filter(Boolean)
        const visibleIndex = rawSegments.indexOf(item)
        const href = `/${rawSegments.slice(0, visibleIndex + 1).join('/')}`
        const isLast = index === pathNames.length - 1

        const label =
          LABELS[item] ??
          (isId(item) ? 'Batafsil' : decodeURIComponent(item))

        return (
          <div key={href + index} className="flex items-center gap-1">
            <Link
              href={href}
              className={`text-sm font-normal capitalize transition ${
                isLast
                  ? 'pointer-events-none text-gray-900'
                  : 'text-gray-400 hover:text-[#399765]'
              }`}
            >
              {label}
            </Link>

            {!isLast && <ChevronRight size={18} />}
          </div>
        )
      })}
    </div>
  )
}
