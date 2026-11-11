"use client";

import { useState } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { usePurchasedProducts } from "@/src/hooks/usePurchasedProducts";
import { useCreateReview, useDeleteReview, useUpdateReview } from "@/src/hooks/useReviews";
import { formatPrice, mediaUrl } from "@/src/lib/format";
import ConfirmDialog from "../components/ConfirmDialog";

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${n} yulduz`}
        >
          <Star
            size={18}
            className={n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { products, isLoading } = usePurchasedProducts();
  const { createReview, isPending: creating } = useCreateReview();
  const { updateReview, isPending: updating } = useUpdateReview();
  const { deleteReview, isPending: deleting } = useDeleteReview();
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const list = Array.isArray(products) ? products : [];

  const productOf = (item: any) => item.product || item;
  const reviewOf = (item: any) => item.review || item.myReview || null;
  const orderIdOf = (item: any) =>
    item.lastOrderId || item.orderId || item.lastOrder?.id || "";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Reviewlarim</h1>
        <p className="mt-1 text-sm text-gray-500">
          Faqat yetkazilgan mahsulotlarga fikr yoziladi.
        </p>
      </div>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-3xl bg-white" />
      ) : list.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-white ring-1 ring-gray-100">
          <MessageSquare className="text-[#4caf7d]" />
          <p className="mt-3 font-bold">Hali xarid qilingan mahsulot yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item: any) => {
            const product = productOf(item);
            const review = reviewOf(item);
            const key = product.id || item.productId;
            const draft = drafts[key] || {
              rating: review?.rating || 5,
              comment: review?.comment || "",
            };
            return (
              <article key={key} className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
                <div className="flex gap-3">
                  <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-[#f4f7f5]">
                    {mediaUrl(product.image || product.images?.[0]?.url) && (
                      <img
                        src={mediaUrl(product.image || product.images?.[0]?.url)}
                        alt=""
                        className="h-14 w-14 object-contain"
                      />
                    )}
                  </span>
                  <div>
                    <p className="font-bold">{product.name}</p>
                    {product.price != null && (
                      <p className="text-sm text-[#2f8a58]">{formatPrice(product.price)}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Stars
                    value={draft.rating}
                    onChange={(rating) =>
                      setDrafts((prev) => ({ ...prev, [key]: { ...draft, rating } }))
                    }
                  />
                  <textarea
                    rows={3}
                    value={draft.comment}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [key]: { ...draft, comment: e.target.value },
                      }))
                    }
                    placeholder="Fikringiz..."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#4caf7d]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={creating || updating}
                      onClick={() =>
                        review?.id
                          ? updateReview({
                              id: review.id,
                              rating: draft.rating,
                              comment: draft.comment,
                            })
                          : createReview({
                              productId: product.id || item.productId,
                              rating: draft.rating,
                              comment: draft.comment,
                              orderId: orderIdOf(item),
                            })
                      }
                      className="cursor-pointer rounded-xl bg-[#4caf7d] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {review?.id ? "Yangilash" : "Yuborish"}
                    </button>
                    {review?.id && (
                      <button
                        type="button"
                        onClick={() => setDeleteId(review.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500"
                      >
                        <Trash2 size={14} /> O'chirish
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Fikrni o'chirasizmi?"
        text="Bu review o'chiriladi."
        confirmLabel="O'chirish"
        danger
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteReview(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
