import { Product } from "../types/products";
import { serverFetch } from "@/src/lib/apiUrl";

export const getAllProducts = async () => {
    try {
        const response = await serverFetch("/products", {
            next: { revalidate: 60 },
        })
        if (!response.ok) {
            throw new Error("Mahsulotlarni yuklashda xatolik yuz berdi");
        }

        const result = await response.json();

        // API array yoki { success: true, data: [...] } qaytarishi mumkin.
        const products = Array.isArray(result)
            ? result
            : result.data;

        if (!Array.isArray(products)) {
            throw new Error("API mahsulotlar ro'yxatini qaytarmadi");
        }

        return products.filter(
            (product: Product): boolean => product.isActive !== false
        );
    } catch (error) {
        console.error("getAllProducts xatolik:", error);
        return [];
    }
}

export const getProduct = async (params: string) => {
    try {
        const response = await serverFetch(`/products/${params}`, {
            next: { revalidate: 60 }
        })
        if (response.status === 401) return null;
        if (!response.ok) throw new Error("Mahsulotni yuklab bo'lmadi");

        const result = await response.json();
        return result.data ?? result;
    } catch (error) {
        console.error("getProduct xatolik:", error);
        return null;
    }
}
