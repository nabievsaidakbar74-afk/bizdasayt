import { serverFetch } from "@/src/lib/apiUrl";
import { emptyProductsMeta, type ProductsMeta } from "@/src/lib/productsQuery";
import type { Product } from "@/src/features/products/types/products";

export type ProductsListResponse = {
  data: Product[];
  meta: ProductsMeta;
};

function productsPath(params: string | null | undefined) {
  const query = new URLSearchParams(params || "");
  const sort = query.get("sort");
  query.delete("sort");
  const path =
    sort === "top"
      ? "/products/top"
      : sort === "best-selling"
        ? "/products/best-selling"
        : "/products";
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

export const getProduct = async (
  params: string | null | undefined,
): Promise<ProductsListResponse> => {
  try {
    const response = await serverFetch(productsPath(params), {
      next: { revalidate: 60 },
    });
    if (response.status === 401) {
      return { data: [], meta: emptyProductsMeta() };
    }
    if (!response.ok) throw new Error("Mahsulotni yuklab bo'lmadi");

    const result = await response.json();
    const data = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
        ? result
        : [];
    const meta = result?.meta || emptyProductsMeta(1, data.length);

    return {
      data,
      meta: {
        page: Number(meta.page) || 1,
        limit: Number(meta.limit) || data.length,
        total: Number(meta.total) || data.length,
        totalPages: Number(meta.totalPages) || 1,
      },
    };
  } catch (error) {
    console.error("getProduct xatolik:", error);
    return { data: [], meta: emptyProductsMeta() };
  }
};
