import { serverFetch } from "@/src/lib/apiUrl";

export const allCategoryes = async () => {
    try {
        const response = await serverFetch("/categories", {
            next: { revalidate: 60 * 60 }
        })
        if (!response.ok) throw new Error("Kategoriyalarni yuklab bo'lmadi");
        const result = await response.json();
        return result.data ?? [];
    } catch (error) {
        console.error("allCategoryes xatolik:", error);
        return [];
    }
}
