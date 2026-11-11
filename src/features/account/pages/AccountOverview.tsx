"use client";

import Link from "next/link";
import { ArrowRight, Heart, MapPin, Package, Wallet } from "lucide-react";
import { useCustomerMe } from "@/src/hooks/useCustomerMe";
import { formatDate, formatPrice, mediaUrl } from "@/src/lib/format";
import StatusBadge from "../components/StatusBadge";

export default function AccountOverview() {
  const { profile, isLoading } = useCustomerMe();

  if (isLoading || !profile) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
        <div className="h-48 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
      </div>
    );
  }

  const wishlist = profile.wishlist?.items ?? [];
  const addresses = profile.addresses ?? [];
  const lastOrder = profile.lastOrder;

  const stats = [
    { label: "Buyurtmalar", value: profile.totalOrders ?? 0, icon: Package },
    { label: "Yetkazilgan", value: profile.deliveredOrders ?? 0, icon: Package },
    { label: "Jami xarajat", value: formatPrice(profile.totalSpent), icon: Wallet },
    { label: "Sevimlilar", value: wishlist.length, icon: Heart },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Shaxsiy kabinet
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Buyurtmalar, sevimlilar va manzillaringiz bir joyda.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl bg-white p-5 shadow-[0_12px_40px_-28px_rgba(47,138,88,0.45)] ring-1 ring-[#e7f3ea]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf8ee] text-[#2f8a58]">
              <item.icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-extrabold text-gray-900">{item.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Oxirgi buyurtma</h2>
            <Link href="/account/orders" className="text-sm font-semibold text-[#399765]">
              Barchasi
            </Link>
          </div>
          {lastOrder ? (
            <Link
              href={`/account/orders/${lastOrder.id}`}
              className="block rounded-2xl bg-[#f4f7f5] p-4 transition hover:bg-[#edf8ee]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-gray-900">№ {lastOrder.orderNumber}</p>
                <StatusBadge status={lastOrder.status} />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {formatDate(lastOrder.createdAt)}
              </p>
              <p className="mt-1 text-lg font-extrabold text-[#2f8a58]">
                {formatPrice(lastOrder.total)}
              </p>
            </Link>
          ) : (
            <p className="text-sm text-gray-500">Hali buyurtma yo'q.</p>
          )}
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Manzillar</h2>
            <Link href="/account/addresses" className="text-sm font-semibold text-[#399765]">
              Boshqarish
            </Link>
          </div>
          {addresses.length ? (
            <ul className="space-y-3">
              {addresses.slice(0, 2).map((address: any) => (
                <li key={address.id} className="flex gap-3 rounded-2xl bg-[#f4f7f5] p-3">
                  <MapPin size={16} className="mt-0.5 text-[#399765]" />
                  <div>
                    <p className="text-sm font-bold">{address.title || "Uy"}</p>
                    <p className="text-xs leading-5 text-gray-500">
                      {address.district}, {address.street} {address.house}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Saqlangan manzil yo'q.</p>
          )}
        </section>
      </div>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Sevimlilar</h2>
          <Link
            href="/account/wishlist"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#399765]"
          >
            Barchasi <ArrowRight size={14} />
          </Link>
        </div>
        {wishlist.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {wishlist.slice(0, 4).map((item: any) => (
              <Link
                key={item.id}
                href={`/products/all/${item.product?.id}`}
                className="rounded-2xl bg-[#f4f7f5] p-3 transition hover:bg-[#edf8ee]"
              >
                {mediaUrl(item.product?.image) ? (
                  <img
                    src={mediaUrl(item.product.image)}
                    alt=""
                    className="mx-auto h-16 w-16 object-contain"
                  />
                ) : (
                  <div className="flex h-16 items-center justify-center text-xs text-gray-400">
                    Rasm yo'q
                  </div>
                )}
                <p className="mt-2 line-clamp-2 text-xs font-semibold text-gray-800">
                  {item.product?.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sevimlilar bo'sh.</p>
        )}
      </section>
    </div>
  );
}
