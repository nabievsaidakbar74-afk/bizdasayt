"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useOrders } from "@/src/hooks/useOrders";
import { formatDate, formatPrice, mediaUrl } from "@/src/lib/format";
import StatusBadge from "../components/StatusBadge";
import { STATUS_LABEL } from "../lib/orderStatus";

const filters = [
  { value: "", label: "Barchasi" },
  { value: "PENDING", label: STATUS_LABEL.PENDING },
  { value: "PROCESSING", label: STATUS_LABEL.PROCESSING },
  { value: "SHIPPED", label: STATUS_LABEL.SHIPPED },
  { value: "DELIVERED", label: STATUS_LABEL.DELIVERED },
  { value: "CANCELLED", label: STATUS_LABEL.CANCELLED },
];

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { orders, meta, isLoading } = useOrders(page, status || undefined);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Buyurtmalar</h1>
        <p className="mt-1 text-sm text-gray-500">Tarix, holat va yetkazib berish.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.value || "all"}
            type="button"
            onClick={() => {
              setStatus(item.value);
              setPage(1);
            }}
            className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold ${
              status === item.value
                ? "bg-[#4caf7d] text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl bg-white text-center ring-1 ring-gray-100">
          <Package className="text-[#4caf7d]" />
          <p className="mt-3 font-bold">Buyurtmalar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const first = order.items?.[0];
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-col gap-4 rounded-3xl bg-white p-4 ring-1 ring-gray-100 transition hover:ring-[#cfe8d6] sm:flex-row sm:items-center"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f7f5]">
                  {first?.productImage ? (
                    <img
                      src={mediaUrl(first.productImage)}
                      alt=""
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <Package size={18} className="text-gray-300" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-900">№ {order.orderNumber}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(order.createdAt)} · {order.items?.length ?? 0} ta mahsulot
                  </p>
                </div>
                <p className="text-lg font-extrabold text-gray-900">
                  {formatPrice(order.total)}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer rounded-xl bg-white p-2 ring-1 ring-gray-200 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold">
            {meta.page} / {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer rounded-xl bg-white p-2 ring-1 ring-gray-200 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
