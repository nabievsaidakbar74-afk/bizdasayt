
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-2xl text-center">

        {/* 404 illustration */}
        <div className="relative mx-auto mb-8 flex h-44 w-64 items-center justify-center">
          <span className="text-[140px] font-black leading-none tracking-tighter text-[#eaf6eb]">
            404
          </span>

          <div className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[#4caf7d] text-white shadow-lg shadow-green-100">
            <Search size={36} strokeWidth={2} />
          </div>
        </div>

        {/* Content */}
        <span className="mb-4 inline-block rounded-full bg-[#edf8ee] px-4 py-2 text-sm font-semibold text-[#42a574]">
          Sahifa topilmadi
        </span>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Oops! Bu sahifa yo‘q
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-500">
          Siz qidirayotgan sahifa o‘chirilgan, manzili
          o‘zgargan yoki vaqtincha mavjud emas.
          Keling, kerakli mahsulotni birgalikda topamiz!
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4caf7d] px-6 py-3.5 font-semibold text-white transition hover:bg-[#399765] hover:shadow-lg hover:shadow-green-100"
          >
            <Home size={19} />
            Bosh sahifaga
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-[#4caf7d] hover:text-[#399765]"
          >
            <ArrowLeft size={18} />
            Mahsulotlarni ko‘rish
          </Link>
        </div>

        {/* Bottom note */}
        <div className="mt-12 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-400">
            <span className="font-bold text-[#4caf7d]">BIZDA</span>
            {" "}— Xarid qilishning qulay manzili
          </p>
        </div>
      </div>
    </main>
  );
}
