import ProductCard from "@/src/components/Card";
import { Product } from "../types/products";
import Filter from "./Filter";
import LoadMore from "./LoadMore";
import SyncPagination from "./SyncPagination";
import { allCategoryes } from "@/src/services/categoryes";
import { getBrands } from "@/src/services/getBrands";
import { PackageSearch } from "lucide-react";
import { Suspense } from "react";
import type { ProductsMeta } from "@/src/lib/productsQuery";

function FilterFallback() {
  return (
    <div className="w-full max-w-[300px] rounded-lg border border-gray-200 bg-white px-3 py-4">
      <div className="h-6 w-24 animate-pulse rounded-md bg-gray-100" />
      <div className="mt-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default async function Products({
  data,
  slug,
  meta,
}: {
  data: Product[];
  slug: string;
  meta: ProductsMeta;
}) {
  const [categories, brands] = await Promise.all([allCategoryes(), getBrands()]);
  const items = data ?? [];
  const total = meta?.total ?? items.length;

  return (
    <section className="my-4 flex items-start gap-4">
      <SyncPagination />
      <div className="hidden shrink-0 md:block">
        <Suspense fallback={<FilterFallback />}>
          <Filter
            categories={(categories ?? []).map((item: { name: string; slug: string }) => {
              return { label: item.name, value: item?.slug };
            })}
            brands={(brands ?? []).map((item: { name: string; slug: string }) => {
              return { label: item.name, value: item?.slug };
            })}
          />
        </Suspense>
      </div>
      <div className="w-full min-w-0">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold uppercase">
            {slug ? decodeURIComponent(slug) : "Mahsulotlar"}
          </h3>
          <p className="text-sm text-gray-500">
            {items.length}
            {total > items.length ? ` / ${total}` : ""} ta mahsulot sotuvda bor
          </p>
        </div>

        {items.length ? (
          <>
            <div className="mt-4 grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((item: Product) => (
                <ProductCard key={item?.id} product={item} />
              ))}
            </div>
            <LoadMore loaded={items.length} total={total} />
          </>
        ) : (
          <div className="mt-4 flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 text-center">
            <PackageSearch className="h-12 w-12 text-gray-300" />
            <p className="mt-4 font-semibold text-gray-700">Mahsulot topilmadi</p>
            <p className="mt-1 text-sm text-gray-400">Boshqa filtr yoki kategoriyani sinab ko'ring</p>
          </div>
        )}
      </div>
    </section>
  );
}
