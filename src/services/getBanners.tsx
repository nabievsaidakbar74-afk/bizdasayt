import { serverFetch } from "@/src/lib/apiUrl";

export const getBanners = async () => {
    try {
        const response = await serverFetch("/banners", {
            next: { revalidate: 60 }
        })
        if (!response.ok) throw new Error("Bannerlarni yuklab bo'lmadi");
        const result = await response.json();
        return result.data ?? [];
    } catch (error) {
        console.error("getBanners xatolik:", error);
        return [];
    }
}
