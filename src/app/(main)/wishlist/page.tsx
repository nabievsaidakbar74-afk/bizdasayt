"use client";

import { useGetWishlist } from "@/src/hooks/useGetWishlist";
import { useMounted } from "@/src/hooks/useMounted";
import ProductCard from "@/src/components/Card";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  LoaderCircle,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function Wishlist() {
  const { data, isLoading, isError } = useGetWishlist();
  const mounted = useMounted();

  const wishlist = data?.data;
  const items = wishlist?.items ?? [];

  // !mounted — server va client birinchi renderini bir xil qiladi (hydration fix)
  if (!mounted || isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-310 items-center justify-center px-4">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#4caf7d]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-310 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf8ee]">
          <LogIn className="h-8 w-8 text-[#399765]" />
        </div>
        <p className="mt-5 text-lg font-semibold text-gray-900">
          Sevimlilarni ko'rish uchun kiring
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Hisobingizga kirganingizdan so'ng ro'yxat shu yerda ko'rinadi.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-310 px-4 py-8 lg:py-12">
      {/* Sarlavha */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Sevimlilar
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            O'zingiz yoqtirgan mahsulotlar bir joyda.
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          {items.length} ta mahsulot
        </span>
      </div>

      {/* Bo'sh holat */}
      {items.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
            <Heart className="h-10 w-10 text-rose-400" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Sevimlilar hozircha bo'sh
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
            Siz hali sevimli mahsulotlaringizni qo'shmagansiz.
            Mahsulotlarni ko'rib chiqing va yoqtirganlaringizni saqlang.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#4caf7d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#399765]"
          >
            <ShoppingBag className="h-4 w-4" />
            Mahsulotlarni ko'rish
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Mahsulotlar ro'yxati — asosiy karta komponenti bilan bir xil */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item: any) => (
            <ProductCard
              key={item.id}
              product={{ ...item.product, inWishlist: true }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
