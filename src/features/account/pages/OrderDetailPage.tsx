
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Banknote,
  ChevronLeft,
  MapPin,
  Package,
  Truck,
  Clock3,
  MessageSquare,
  CalendarDays,
  ShoppingBag,
  CircleCheck,
} from "lucide-react";

import {
  useCancelOrder,
  useOrder,
  useReturnOrder,
} from "@/src/hooks/useOrders";

import {
  formatDate,
  formatPrice,
  mediaUrl,
} from "@/src/lib/format";

import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  canCancel,
  canReturn,
  STATUS_LABEL,
} from "../lib/orderStatus";

export default function OrderDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");

  const { order, isLoading } = useOrder(id);

  const { cancelOrder, isPending: canceling } = useCancelOrder();
  const { returnOrder, isPending: returning } = useReturnOrder();

  const [confirm, setConfirm] = useState<"cancel" | "return" | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="h-96 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
        <div className="h-80 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center ring-1 ring-gray-100">
        <Package size={40} className="mb-3 text-gray-300" />
        <h2 className="text-lg font-bold text-gray-900">
          Buyurtma topilmadi
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ushbu buyurtma mavjud emas yoki o'chirilgan.
        </p>
        <Link
          href="/account/orders"
          className="mt-5 rounded-xl bg-[#399765] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f8055]"
        >
          Buyurtmalarga qaytish
        </Link>
      </div>
    );
  }

  const address = order.addressSnapshot || {};
  const items = order.items || [];
  const history = [...(order.statusHistory || [])].reverse();

  return (
    <div className="space-y-5 pb-8">

      {/* Back */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-[#399765]"
      >
        <ChevronLeft size={17} />
        Buyurtmalar
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              № {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-400">
            <CalendarDays size={14} />
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-[#f1f8f4] px-4 py-3">
          <ShoppingBag size={18} className="text-[#399765]" />
          <div>
            <p className="text-xs text-gray-400">Mahsulotlar</p>
            <p className="text-sm font-bold text-gray-900">
              {items.length} ta
            </p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">

        {/* LEFT */}
        <div className="min-w-0 space-y-5">

          {/* Products */}
          <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="font-bold text-gray-900">
                  Buyurtma tarkibi
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  {items.length} ta mahsulot
                </p>
              </div>

              <Package size={20} className="text-[#399765]" />
            </div>

            <div className="divide-y divide-gray-50 px-5">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4"
                >
                  {/* Product image */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5f8f6]">
                    {item.productImage ? (
                      <img
                        src={mediaUrl(item.productImage)}
                        alt={item.productName || "Mahsulot"}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Package size={25} className="text-gray-300" />
                    )}
                  </div>

                  {/* Product info */}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-900">
                      {item.productName}
                    </p>

                    <p className="mt-1.5 text-xs text-gray-400">
                      {formatPrice(item.price)} / dona
                    </p>

                    <span className="mt-2 inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                      {item.quantity} dona
                    </span>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-extrabold text-gray-900">
                      {formatPrice(
                        item.total ?? item.price * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-400">
                  Mahsulotlar mavjud emas
                </div>
              )}
            </div>
          </section>

          {/* Status timeline */}
          {history.length > 0 && (
            <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Buyurtma tarixi
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Buyurtma holatidagi o'zgarishlar
                  </p>
                </div>

                <Clock3 size={20} className="text-[#399765]" />
              </div>

              <div className="relative space-y-5">
                {history.map((item: any, index: number) => {
                  const isLatest = index === 0;

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-3"
                    >
                      {/* Timeline indicator */}
                      <div className="relative flex shrink-0 flex-col items-center">
                        <div
                          className={`z-10 flex h-9 w-9 items-center justify-center rounded-full ${
                            isLatest
                              ? "bg-[#e8f5ed] text-[#399765]"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isLatest ? (
                            <CircleCheck size={18} />
                          ) : (
                            <Clock3 size={16} />
                          )}
                        </div>

                        {index !== history.length - 1 && (
                          <div className="absolute top-9 h-[calc(100%+12px)] w-px bg-gray-100" />
                        )}
                      </div>

                      {/* History content */}
                      <div
                        className={`min-w-0 flex-1 rounded-2xl p-3.5 ${
                          isLatest
                            ? "bg-[#f3faf5]"
                            : "bg-gray-50/80"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              {STATUS_LABEL[item.status] || item.status}
                            </span>

                            {isLatest && (
                              <span className="rounded-md bg-[#dff2e5] px-2 py-0.5 text-[10px] font-bold text-[#399765]">
                                Joriy holat
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] text-gray-400">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {/* Comment */}
                        {item.comment && (
                          <div className="mt-3 flex gap-2 rounded-xl border border-gray-100 bg-white p-3">
                            <MessageSquare
                              size={15}
                              className="mt-0.5 shrink-0 text-[#399765]"
                            />

                            <p className="text-xs leading-5 text-gray-600">
                              {item.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT */}
        <aside className="min-w-0 space-y-4">

          {/* Order summary */}
          <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
            <h2 className="mb-5 font-bold text-gray-900">
              Buyurtma xulosasi
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">
                  Mahsulotlar
                </span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-gray-500">
                  <Truck size={15} />
                  Yetkazish
                </span>
                <span className="text-xs font-semibold text-[#399765]">
                  Biz yetkazamiz
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-gray-500">
                  <Banknote size={15} />
                  To'lov
                </span>
                <span className="text-xs font-semibold text-[#399765]">
                  Yetkazilganda
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-gray-700">
                    Jami
                  </span>
                  <span className="text-xl font-extrabold text-[#2f8a58]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf5ee]">
                <MapPin size={18} className="text-[#399765]" />
              </div>

              <h2 className="font-bold text-gray-900">
                Yetkazib berish manzili
              </h2>
            </div>

            <p className="text-sm font-bold text-gray-900">
              {[address.firstName, address.lastName]
                .filter(Boolean)
                .join(" ")}
            </p>

            {address.phone && (
              <p className="mt-1 text-sm text-gray-500">
                {address.phone}
              </p>
            )}

            <div className="mt-3 rounded-xl bg-gray-50 p-3">
              <p className="text-xs leading-6 text-gray-600">
                {[
                  address.region,
                  address.district,
                  address.mahalla,
                  address.street,
                  address.house,
                ]
                  .filter(Boolean)
                  .join(", ") || "Manzil ko'rsatilmagan"}
              </p>
            </div>
          </section>

          {/* Actions */}
          {(canCancel(order.status) ||
            canReturn(order.status)) && (
            <section className="space-y-2">
              {canCancel(order.status) && (
                <button
                  type="button"
                  onClick={() => setConfirm("cancel")}
                  className="w-full cursor-pointer rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100"
                >
                  Buyurtmani bekor qilish
                </button>
              )}

              {canReturn(order.status) && (
                <button
                  type="button"
                  onClick={() => setConfirm("return")}
                  className="w-full cursor-pointer rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                >
                  Qaytarish so'rash
                </button>
              )}
            </section>
          )}
        </aside>
      </div>

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={confirm === "cancel"}
        title="Bekor qilasizmi?"
        text="Bu buyurtma bekor qilinadi."
        confirmLabel="Bekor qilish"
        danger
        loading={canceling}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          await cancelOrder(id);
          setConfirm(null);
        }}
      />

      {/* Return confirmation */}
      <ConfirmDialog
        open={confirm === "return"}
        title="Qaytarish so'raysizmi?"
        text="Yetkazilgan buyurtma uchun qaytarish so'rovi yuboriladi."
        confirmLabel="Yuborish"
        loading={returning}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          await returnOrder(id);
          setConfirm(null);
        }}
      />
    </div>
  );
}
