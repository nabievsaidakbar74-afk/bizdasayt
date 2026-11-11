"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { App } from "antd";
import { useGetWishlist } from "@/src/hooks/useGetWishlist";
import { useAddWishlist } from "@/src/hooks/useAddWishlist";
import { useAddCart } from "@/src/hooks/useAddCart";
import { formatPrice, mediaUrl } from "@/src/lib/format";

export default function AccountWishlistPage() {
  const { data, isLoading } = useGetWishlist();
  const { toggleWishlist, isPending } = useAddWishlist();
  const { mutate: addCart, isPending: cartPending } = useAddCart();
  const { message } = App.useApp();
  const items = data?.data?.items ?? [];

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Sevimlilar</h1>
        <p className="mt-1 text-sm text-gray-500">{items.length} ta mahsulot</p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl bg-white text-center ring-1 ring-gray-100">
          <Heart className="text-rose-400" />
          <p className="mt-3 font-bold">Ro'yxat bo'sh</p>
          <Link href="/products" className="mt-4 text-sm font-semibold text-[#399765]">
            Mahsulotlarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => {
            const product = item.product;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl bg-white p-4 ring-1 ring-gray-100 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/products/${product?.category?.slug ?? "all"}/${product?.id}`}
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f7f5]"
                >
                  {mediaUrl(product?.image) ? (
                    <img src={mediaUrl(product.image)} alt="" className="h-16 w-16 object-contain" />
                  ) : (
                    <Heart size={18} className="text-gray-300" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product?.category?.slug ?? "all"}/${product?.id}`}
                    className="font-bold text-gray-900 hover:text-[#399765]"
                  >
                    {product?.name}
                  </Link>
                  <p className="mt-1 text-sm font-extrabold text-[#2f8a58]">
                    {formatPrice(product?.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={cartPending}
                    onClick={() =>
                      addCart(
                        { productId: product.id, quantity: 1 },
                        { onSuccess: () => message.success("Savatga qo'shildi") }
                      )
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#edf8ee] px-3 py-2 text-sm font-semibold text-[#399765]"
                  >
                    <ShoppingCart size={15} /> Savatga
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleWishlist({ productId: product.id, inWishlist: true })}
                    className="cursor-pointer rounded-xl bg-red-50 p-2 text-red-500"
                    aria-label="Olib tashlash"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
