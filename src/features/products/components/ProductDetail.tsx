
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Star,
  Zap,
  Sparkles,
} from "lucide-react";
import ProductActions from "./ProductActions";
import { getProduct } from "../services/getProducts";


const formatPrice = (price: number) =>
  price.toLocaleString("en-US").replace(/,/g, " ") + " so'm";




export default async function ProductDetail({ id }: { id: string }) {


  const product = await getProduct(id)

  if (!product || product.isActive === false) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#fafafa] px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf8ee]">
            <Package size={36} className="text-[#399765]" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Mahsulot topilmadi
          </h1>

          <p className="mt-3 text-gray-500">
            Bu mahsulot mavjud emas yoki manzili o'zgargan.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-[#4caf7d] px-6 py-3 font-semibold text-white transition hover:bg-[#399765]"
          >
            Barcha mahsulotlar
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    product.images?.find((image: any) => image.isMain) ??
    product.images?.[0];

  const gallery = product.images?.length
    ? product.images
    : [];

  const stock = product.availableStock ?? product.stock ?? 0;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto w-full max-w-310 px-4 py-6">
        {/* Breadcrumb */}
        {/* <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#399765]">
            Bosh sahifa
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#399765]">
            Mahsulotlar
          </Link>
          <span>/</span>
          <span className="max-w-56 truncate text-gray-900">
            {product.name}
          </span>
        </nav> */}

        {/* Product section */}
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image gallery */}
          <div>
            <div
              id="product-main-image"
              className="relative flex aspect-square max-h-155 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-10"
            >
              <div className="absolute left-5 top-5 z-10 flex flex-col items-start gap-2">
                {product.discountPercent ? (
                  <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 py-1.5 pl-3 pr-3.5 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-rose-500/40 ring-1 ring-white/40">
                    <Zap size={13} strokeWidth={2.5} className="fill-yellow-300 text-yellow-300" />
                    -{product.discountPercent}%
                  </span>
                ) : null}

                {product.isNew && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 py-1.5 pl-3 pr-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/40 ring-1 ring-white/40">
                    <Sparkles size={13} strokeWidth={2.5} />
                    Yangi
                  </span>
                )}
              </div>

              {mainImage?.url ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  Mahsulot rasmi mavjud emas
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((image: any) => (
                  <div
                    key={image.id}
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-white p-2 ${image.id === mainImage?.id
                      ? "border-[#4caf7d] ring-2 ring-green-100"
                      : "border-gray-100"
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#edf8ee] px-3 py-1 text-xs font-semibold text-[#399765]">
                {product.brand?.name || "Bizda"}
              </span>

              {product.category?.name && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {product.category.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <Star
                  size={18}
                  className="fill-amber-400 text-amber-400"
                />
                <span className="font-semibold text-gray-800">
                  {Number(product.averageRating || 0).toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-gray-400">
                {product.reviewsCount || 0} ta sharh
              </span>

              {product.sku && (
                <span className="text-sm text-gray-400">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {formatPrice(product.price)}
                </span>

                {product.oldPrice != null &&
                  product.oldPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
              </div>

              {product.oldPrice != null &&
                product.oldPrice > product.price && (
                  <p className="mt-2 text-sm font-medium text-[#399765]">
                    Siz{" "}
                    {formatPrice(product.oldPrice - product.price)}
                    {" "}tejaysiz
                  </p>
                )}
            </div>

            {/* Description */}
            <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base">
              {product.shortDescription ||
                product.description ||
                "Mahsulot haqida qo'shimcha ma'lumot tez orada kiritiladi."}
            </p>

            {/* Stock status */}
            <div className="mt-6 flex items-center gap-2">
              {stock > 0 ? (
                <>
                  <Check size={19} className="text-[#399765]" />
                  <span className="text-sm font-medium text-[#399765]">
                    Mavjud — {stock} ta
                  </span>
                </>
              ) : (
                <>
                  <Package size={19} className="text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    Hozircha sotuvda yo'q
                  </span>
                </>
              )}
            </div>

            {/* Quantity and cart */}
            <div className="mt-6">
              <ProductActions
                productId={product.id}
                stock={stock}
                price={product.price}
                imageUrl={mainImage?.url ?? null}
                variantId={product.variants?.[0]?.id}
              />
            </div>

            {/* Benefits */}
            <div className="mt-8 grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#edf8ee] p-2">
                  <Truck size={20} className="text-[#399765]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Yetkazib berish
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Yetkazish shartlarini tekshiring
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#edf8ee] p-2">
                  <ShieldCheck size={20} className="text-[#399765]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Ishonchli xarid
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Mahsulot ma'lumotlari ochiq
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#edf8ee] p-2">
                  <RotateCcw size={20} className="text-[#399765]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Qaytarish
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Do'kon shartlariga bog'liq
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#399765]"
            >
              <ArrowLeft size={17} />
              Mahsulotlarga qaytish
            </Link>
          </div>
        </section>

        {/* Details */}
        <section className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Mahsulot haqida
          </h2>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
              {product.description || product.shortDescription || "Tavsif mavjud emas."}
            </p>
          </div>

          <dl className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-500">Brend</dt>
              <dd className="text-right text-sm font-semibold text-gray-800">
                {product.brand?.name || "Ko'rsatilmagan"}
              </dd>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-500">Kategoriya</dt>
              <dd className="text-right text-sm font-semibold text-gray-800">
                {product.category?.name || "Ko'rsatilmagan"}
              </dd>
            </div>

            {product.sku && (
              <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                <dt className="text-sm text-gray-500">SKU kodi</dt>
                <dd className="text-right text-sm font-semibold text-gray-800">
                  {product.sku}
                </dd>
              </div>
            )}

            <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-500">Mavjud miqdor</dt>
              <dd className="text-right text-sm font-semibold text-gray-800">
                {stock} ta
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
