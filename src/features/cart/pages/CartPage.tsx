"use client";

import useDeleteCart from "@/src/hooks/useDeleteCart";
import useDeleteCartId from "@/src/hooks/useDeleteCartId";
import { useGetCart } from "@/src/hooks/useGetCart";
import usePatchCart from "@/src/hooks/usePatchCart";
import { useMounted } from "@/src/hooks/useMounted";
import { useAuthModal } from "@/src/providers/AuthModalProvider";

import {
  ShoppingCart,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShoppingBag,
  LoaderCircle,
  LogIn,
  Package,
  BadgeCheck,
  Receipt,
  ChevronRight,
  Banknote,
} from "lucide-react";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const formatPrice = (price: number) =>
  Number(price || 0).toLocaleString("en-US").replace(/,/g, " ") + " so'm";

const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem("bizdaAccessTokin");

const benefits = [
  {
    icon: Truck,
    title: "Biz yetkazamiz",
    text: "Buyurtmani manzilingizga olib boramiz",
  },
  {
    icon: Banknote,
    title: "Yetkazilganda to'lov",
    text: "Onlayn to'lov yo'q",
  },
  {
    icon: BadgeCheck,
    title: "Original mahsulot",
    text: "Sifat kafolati bilan",
  },
];

function CartSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-310">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-7 w-52 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-5 rounded-3xl bg-white p-5 ring-1 ring-gray-100"
              >
                <div className="h-28 w-28 shrink-0 animate-pulse rounded-2xl bg-gray-100" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-9 w-28 animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
        </div>
      </div>
    </main>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: typeof ShoppingCart;
  title: string;
  text: string;
  action: ReactNode;
}) {
  return (
    <main className="bg-[#f4f7f5] px-4 py-16">
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center rounded-[28px] border border-white bg-white px-6 py-16 text-center shadow-[0_20px_60px_-30px_rgba(57,151,101,0.45)] ring-1 ring-[#e7f3ea]">
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-full bg-[#4caf7d]/15 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] text-white shadow-lg shadow-[#4caf7d]/30">
            <Icon className="h-11 w-11" />
          </div>
        </div>
        <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">{text}</p>
        <div className="mt-7">{action}</div>
      </div>
    </main>
  );
}

export default function CartPage() {
  const { data, isLoading } = useGetCart();
  const { mutate: patchCart } = usePatchCart();
  const { CartDelete, isPending: cartDeletePending } = useDeleteCart();
  const { CartDeleteId } = useDeleteCartId();

  const mounted = useMounted();
  const { openAuth } = useAuthModal();

  const [pendingQuantityId, setPendingQuantityId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const items = data?.data?.items || [];

  const totalPrice = items.reduce(
    (total: number, item: any) =>
      total + (item.lineTotal ?? item.price * item.quantity),
    0
  );

  const totalQuantity = items.reduce(
    (total: number, item: any) => total + (item.quantity ?? 1),
    0
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1 || pendingQuantityId) return;
    setPendingQuantityId(id);
    patchCart(
      { id, quantity },
      { onSettled: () => setPendingQuantityId(null) }
    );
  };

  const handleDeleteItem = (id: string) => {
    if (pendingDeleteId) return;
    setPendingDeleteId(id);
    CartDeleteId(id, {
      onSettled: () => setPendingDeleteId(null),
    });
  };

  const handleDeleteAll = () => {
    if (cartDeletePending) return;
    CartDelete();
  };

  if (!mounted || isLoading) {
    return <CartSkeleton />;
  }

  if (!hasToken()) {
    return (
      <EmptyState
        icon={LogIn}
        title="Savatni ko'rish uchun kiring"
        text="Savatingizdagi mahsulotlarni ko'rish va buyurtma berish uchun hisobingizga kiring yoki ro'yxatdan o'ting."
        action={
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4caf7d] to-[#399765] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4caf7d]/30 transition hover:shadow-xl"
          >
            Kirish / Ro'yxatdan o'tish
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        }
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Savatingiz hozircha bo'sh"
        text="Mahsulotlarni ko'rib chiqing va yoqtirganlaringizni savatga qo'shing."
        action={
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4caf7d] to-[#399765] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4caf7d]/30 transition hover:shadow-xl"
          >
            Xaridni boshlash
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-310">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-400">
              <Link href="/" className="transition hover:text-[#399765]">
                Bosh sahifa
              </Link>
              <ChevronRight size={14} />
              <span className="font-medium text-gray-600">Savat</span>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] text-white shadow-lg shadow-[#4caf7d]/25">
                <ShoppingCart size={24} />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Mening savatim
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {items.length} ta mahsulot
                  <span className="mx-1.5 text-gray-300">·</span>
                  {totalQuantity} dona
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDeleteAll}
            disabled={cartDeletePending}
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cartDeletePending ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            {cartDeletePending ? "O'chirilmoqda..." : "Barchasini o'chirish"}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            {items.map((item: any) => {
              const isQuantityLoading = pendingQuantityId === item.id;
              const isDeleteLoading = pendingDeleteId === item.id;

              const productImage =
                typeof item.product?.image === "string"
                  ? item.product.image
                  : (item.product?.images?.find((i: any) => i.isMain) ??
                    item.product?.images?.[0])?.url;

              const productHref = `/products/${item.product?.category?.slug ?? "all"}/${item.product?.id}`;

              const brandName =
                typeof item.product?.brand === "string"
                  ? item.product.brand
                  : item.product?.brand?.name;

              const linePrice = item.lineTotal ?? item.price * item.quantity;

              return (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-gray-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-22px_rgba(57,151,101,0.35)] hover:ring-[#cfe8d6] sm:p-5 ${
                    isDeleteLoading ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href={productHref}
                      className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f7fbf8] to-[#eef6f0] ring-1 ring-[#e7f0ea] sm:h-32 sm:w-32"
                    >
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={item.product?.name}
                          className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ShoppingBag className="text-gray-300" size={30} />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      {brandName && (
                        <span className="inline-flex rounded-full bg-[#edf8ee] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#2f8a58]">
                          {brandName}
                        </span>
                      )}

                      <Link
                        href={productHref}
                        className="mt-2 line-clamp-2 block text-[16px] font-bold leading-6 text-gray-900 transition hover:text-[#399765]"
                      >
                        {item.product?.name}
                      </Link>

                      {item.product?.sku && (
                        <p className="mt-1 text-xs text-gray-400">
                          SKU: {item.product.sku}
                        </p>
                      )}

                      <p className="mt-2 text-lg font-extrabold tracking-tight text-gray-900 sm:hidden">
                        {formatPrice(linePrice)}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex items-center rounded-full bg-[#f3f6f4] p-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || !!pendingQuantityId}
                            type="button"
                            aria-label="Kamaytirish"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-[#399765] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="flex w-9 items-center justify-center text-sm font-bold text-gray-900">
                            {isQuantityLoading ? (
                              <LoaderCircle className="animate-spin text-[#4caf7d]" size={15} />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={!!pendingQuantityId}
                            type="button"
                            aria-label="Oshirish"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-[#399765] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={!!pendingDeleteId || !!pendingQuantityId}
                          type="button"
                          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleteLoading ? (
                            <LoaderCircle className="animate-spin" size={14} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          {isDeleteLoading ? "O'chirilmoqda..." : "O'chirish"}
                        </button>
                      </div>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block sm:min-w-40">
                      <p className="text-xs text-gray-400">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight text-gray-900">
                        {formatPrice(linePrice)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="grid grid-cols-1 overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100 sm:grid-cols-3">
              {benefits.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    index > 0 ? "border-t border-gray-100 sm:border-t-0 sm:border-l" : ""
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#edf8ee] to-[#d7f0de] text-[#2f8a58]">
                    <item.icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="sticky top-24 overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.4)] ring-1 ring-gray-100">
            <div className="h-1.5 bg-gradient-to-r from-[#4caf7d] via-[#7ed3a4] to-[#2f8a58]" />

            <div className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf8ee] text-[#399765]">
                  <Receipt size={16} />
                </span>
                Buyurtma xulosasi
              </h2>

              <ul className="mt-5 space-y-3 border-b border-dashed border-gray-200 pb-5">
                {items.map((item: any) => {
                  const thumb =
                    typeof item.product?.image === "string"
                      ? item.product.image
                      : (item.product?.images?.find((i: any) => i.isMain) ??
                        item.product?.images?.[0])?.url;
                  const linePrice = item.lineTotal ?? item.price * item.quantity;

                  return (
                    <li key={item.id} className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f4f7f5]">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt=""
                            className="h-9 w-9 object-contain"
                          />
                        ) : (
                          <Package size={16} className="text-gray-300" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 block text-sm font-semibold text-gray-800">
                          {item.product?.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.quantity} dona
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-gray-900">
                        {formatPrice(linePrice)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-3 py-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Mahsulotlar ({totalQuantity} dona)</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} />
                    Yetkazib berish
                  </span>
                  <span className="font-semibold text-[#399765]">Biz yetkazamiz</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Banknote size={14} />
                    To'lov
                  </span>
                  <span className="font-semibold text-[#399765]">Yetkazilganda</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f3faf5] px-4 py-4">
                <span className="text-sm font-semibold text-gray-600">Jami</span>
                <span className="text-xl font-extrabold tracking-tight text-[#2f8a58]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-[#f3faf5] px-4 py-3 text-sm leading-5 text-[#2f8a58]">
                Onlayn to'lov yo'q. Buyurtmani rasmiylashtirasiz, biz yetkazib
                beramiz, to'lov mahsulot yetib borgach amalga oshadi.
              </div>

              <Link
                href="/cart/checkout"
                className="group mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4caf7d] to-[#2f8a58] text-sm font-bold text-white shadow-lg shadow-[#4caf7d]/30 transition hover:shadow-xl active:scale-[0.98]"
              >
                Buyurtmani rasmiylashtirish
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:border-[#4caf7d]/40 hover:bg-[#f4faf5] hover:text-[#399765]"
              >
                <ShoppingBag size={16} />
                Xaridni davom ettirish
              </Link>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
