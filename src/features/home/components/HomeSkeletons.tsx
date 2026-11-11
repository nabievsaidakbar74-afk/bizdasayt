/**
 * Bosh sahifa skeletlari — ma'lumot yuklanayotganda spinner o'rniga
 * sahifaning "shakli" ko'rinadi. Bu sahifa tezroq yuklanayotgandek
 * taassurot beradi va layout sakramaydi.
 */

export function HeroSkeleton() {
  return (
    <div className="mb-10 pt-4">
      <div className="mx-auto w-full max-w-310 px-4">
        <div className="relative h-64 w-full animate-pulse overflow-hidden rounded-3xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 sm:h-80 lg:h-100">
          {/* Matn o'rni */}
          <div className="absolute inset-0 flex items-center">
            <div className="flex flex-col gap-4 px-8 sm:px-14">
              <div className="h-9 w-64 rounded-xl bg-white/60 sm:h-12 sm:w-96" />
              <div className="h-5 w-48 rounded-lg bg-white/50 sm:w-72" />
              <div className="mt-2 h-11 w-36 rounded-xl bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="mx-auto flex w-full max-w-310 flex-col gap-8 px-4 pb-25">
      {/* Sarlavha o'rni */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-1.5 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
      </div>

      {/* Kartochkalar o'rni */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
          >
            <div className="aspect-square animate-pulse bg-gray-100" />
            <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-1 h-5 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-auto h-11 w-full animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BrandsSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-310 flex-col gap-8 px-4 pb-25">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-1.5 animate-pulse rounded-full bg-gray-200" />
        <div className="h-8 w-44 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="scrollbar-hide flex gap-5 overflow-x-auto">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex w-36 shrink-0 flex-col items-center rounded-2xl border border-gray-100 bg-white p-4"
          >
            <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
