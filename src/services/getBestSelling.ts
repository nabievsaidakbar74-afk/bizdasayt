import { serverFetch } from "@/src/lib/apiUrl";

export const getBestSelling = async () => {
    try {
        const response = await serverFetch("/products/best-selling?page=1&limit=8&order=desc", {
            next: { revalidate: 60 }
        })
        if (!response.ok) throw new Error("Ko'p sotilgan mahsulotlarni yuklab bo'lmadi");
        const result = await response.json();
        return result.data ?? [];
    } catch (error) {
        console.error("getBestSelling xatolik:", error);
        return [];
    }
}
