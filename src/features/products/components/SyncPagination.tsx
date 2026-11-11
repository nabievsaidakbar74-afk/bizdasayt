"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/src/lib/productsQuery";

export default function SyncPagination() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    if (page && limit) return;

    const params = new URLSearchParams(searchParams.toString());
    if (!page) params.set("page", String(DEFAULT_PAGE));
    if (!limit) params.set("limit", String(DEFAULT_LIMIT));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
