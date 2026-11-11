"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingCart, Check, Heart } from "lucide-react";
import { App } from "antd";
import { useAddCart } from "../../../hooks/useAddCart";
import { useAddWishlist } from "../../../hooks/useAddWishlist";
import { useGetWishlist } from "../../../hooks/useGetWishlist";
import { useMounted } from "../../../hooks/useMounted";
import { useUser } from "../../../context/UserContext";
import { useAuthModal } from "../../../providers/AuthModalProvider";
import { flyToCart } from "../../../lib/flyToCart";

const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem("bizdaAccessTokin");

type Props = {
  productId: string;
  stock: number;
  price: number;
  /** Fly-to-cart animatsiyasi uchun asosiy rasm URL'i */
  imageUrl?: string | null;
  variantId?: string;
};

export default function ProductActions({
  productId,
  stock,
  price,
  imageUrl,
  variantId,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: addCart, isPending } = useAddCart();
  const { toggleWishlist, isPending: isWishlistPending } = useAddWishlist();
  const { data: wishlistData } = useGetWishlist();
  const { message } = App.useApp();
  const { user } = useUser();
  const { openAuth } = useAuthModal();
  const mounted = useMounted();

  const wishlistItems = wishlistData?.data?.items ?? [];
  const inWishlist =
    mounted &&
    wishlistItems.some(
      (item: { productId?: string; product?: { id?: string } }) =>
        item.productId === productId || item.product?.id === productId
    );

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (stock < 1 || isPending) return;

    // Login qilmagan bo'lsa — loading'siz DARHOL auth modalini ochamiz
    if (!user && !hasToken()) {
      openAuth("login");
      return;
    }

    addCart(
      { productId, quantity, variantId },
      {
        onSuccess: () => {
          // Notification o'rniga — rasm savatchaga "uchib boradi"
          if (imageUrl) {
            flyToCart({
              imageSrc: imageUrl,
              fromEl: document.getElementById("product-main-image"),
            });
          }
          setAdded(true);
          if (addedTimer.current) clearTimeout(addedTimer.current);
          addedTimer.current = setTimeout(() => setAdded(false), 1800);
        },
      }
    );
  };

  const handleWishlist = () => {
    if (isWishlistPending) return;
    // Login qilmagan bo'lsa — loading'siz DARHOL auth modalini ochamiz
    if (!user && !hasToken()) {
      openAuth("login");
      return;
    }
    toggleWishlist(
      { productId, inWishlist },
      {
        onSuccess: () => {
          message.success(
            inWishlist ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi"
          );
        },
      }
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Miqdor:</span>

        <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1">
          <button
            type="button"
            aria-label="Miqdorni kamaytirish"
            disabled={quantity <= 1 || stock < 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-10 text-center text-sm font-semibold text-gray-900">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Miqdorni oshirish"
            disabled={quantity >= stock}
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={stock < 1 || isPending}
          onClick={handleAddToCart}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition disabled:cursor-not-allowed ${
            added
              ? "bg-emerald-500 shadow-emerald-100"
              : "bg-[#4caf7d] shadow-green-100 hover:bg-[#399765] active:scale-[0.98]"
          } disabled:bg-gray-300 disabled:shadow-none`}
        >
          {stock < 1 ? (
            <>
              <ShoppingCart size={20} />
              Sotuvda mavjud emas
            </>
          ) : isPending ? (
            <span className="flex items-center gap-1.5">
              <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-white" />
            </span>
          ) : added ? (
            <>
              <Check size={20} />
              Savatga qo'shildi
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              Savatga qo'shish
            </>
          )}
        </button>

        {/* Sevimlilar tugmasi */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={isWishlistPending}
          aria-label="Sevimlilarga qo'shish"
          className={`flex w-14 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-wait ${
            inWishlist
              ? "border-rose-200 bg-rose-50 shadow-md shadow-rose-100"
              : "border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50/50"
          }`}
        >
          <Heart
            size={21}
            className={`transition-all duration-300 ${
              isWishlistPending
                ? "animate-pulse fill-rose-300 text-rose-300"
                : inWishlist
                  ? "scale-110 fill-rose-500 text-rose-500 drop-shadow-[0_2px_6px_rgba(244,63,94,0.45)]"
                  : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-gray-400">
        Jami:{" "}
        {(price * quantity).toLocaleString("en-US").replace(/,/g, " ")} so'm
      </p>
    </div>
  );
}
