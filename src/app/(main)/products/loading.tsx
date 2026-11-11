export default function ProductsLoading() {
  return (
    <div className="my-4 flex items-start gap-4">
      {/* Filter skeleti */}
      <div className="hidden w-full max-w-[300px] shrink-0 animate-pulse rounded-lg border border-gray-100 bg-white p-4 md:block">
        <div className="h-5 w-24 rounded bg-gray-200" />
        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Kartalar skeleti */}
      <div className="w-full">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-100" />
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="aspect-square bg-gray-100" />
              <div className="flex flex-col gap-2 p-4">
                <div className="h-3 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="mt-2 h-10 w-full rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
