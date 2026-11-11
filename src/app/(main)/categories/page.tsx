import { allCategoryes } from '@/src/services/categoryes'
import { Category } from '@/src/features/categories/types/categoryes'
import { pageMeta } from '@/src/lib/seo'
import Link from 'next/link'
import { Grid2x2 } from 'lucide-react'

export const metadata = pageMeta(
  "Kategoriyalar",
  "Bizda mahsulot kategoriyalari: smartfon, noutbuk, audio va boshqalar.",
  "/categories",
)

export default async function Categories() {
  const categories = await allCategoryes()

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-310 px-4 py-8 lg:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Grid2x2 className="h-6 w-6 text-[#4caf7d]" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Kategoriyalar
          </h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Kerakli kategoriyani tanlang va mahsulotlarni ko'ring.
        </p>
      </div>

      {categories?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((item: Category) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="group flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-gray-200/60"
            >
              <span className="font-semibold text-gray-800 transition group-hover:text-[#399765]">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-gray-400">Kategoriyalar topilmadi</p>
      )}
    </main>
  )
}
