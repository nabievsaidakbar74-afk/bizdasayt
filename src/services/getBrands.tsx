import { serverFetch } from "@/src/lib/apiUrl";

export const getBrands = async () => {
    try {
        const response = await serverFetch("/brands", {
            next: { revalidate: 60 }
        })
        if (!response.ok) throw new Error("Brendlarni yuklab bo'lmadi");
        const result = await response.json();
        return result.data ?? [];
    } catch (error) {
        console.error("getBrands xatolik:", error);
        return [];
    }
}
