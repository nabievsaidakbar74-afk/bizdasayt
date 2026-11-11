"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { DEFAULT_LIMIT, DEFAULT_PAGE, LOAD_MORE_STEP } from "@/src/lib/productsQuery";

export default function LoadMore({ loaded, total }: { loaded: number; total: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  if (loaded >= total || total <= 0) return null;

  const handleMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    const currentLimit = Number(params.get("limit") || DEFAULT_LIMIT);
    params.set("page", String(DEFAULT_PAGE));
    params.set("limit", String(currentLimit + LOAD_MORE_STEP));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{loaded}</span>
        <span className="mx-1 text-gray-300">/</span>
        {total} ta mahsulot ko‘rsatilmoqda
      </p>
      <button
        type="button"
        onClick={handleMore}
        disabled={pending}
        className="group inline-flex min-w-[240px] cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[#4caf7d]/35 bg-white px-7 py-3.5 text-[15px] font-semibold tracking-wide text-[#2d6a4a] shadow-[0_8px_20px_-12px_rgba(76,175,125,0.55)] transition hover:border-[#4caf7d] hover:bg-[#4caf7d] hover:text-white hover:shadow-[0_12px_24px_-10px_rgba(76,175,125,0.65)] disabled:cursor-wait disabled:opacity-60"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4caf7d]/12 text-[#4caf7d] transition group-hover:bg-white/20 group-hover:text-white">
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <ChevronDown size={16} strokeWidth={2.4} />
          )}
        </span>
        {pending ? "Yuklanmoqda…" : "Yana 10 ta"}
      </button>
    </div>
  );
}
