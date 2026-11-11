import { serverFetch } from "@/src/lib/apiUrl";

export const getTrendingProducts = async () => {
    try {
        const response = await serverFetch("/products/top?page=1&limit=8&order=desc", {
            next: { revalidate: 60 }
        })
        if (!response.ok) throw new Error("Top mahsulotlarni yuklab bo'lmadi");
        const result = await response.json();
        return result.data ?? [];
    } catch (error) {
        console.error("getTrendingProducts xatolik:", error);
        return [];
    }
}
