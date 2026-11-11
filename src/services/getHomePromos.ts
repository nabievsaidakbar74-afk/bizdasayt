import { serverFetch } from "@/src/lib/apiUrl";

export const getHomePromos = async () => {
    try {
        const response = await serverFetch("/home-promos", {
            next: { revalidate: 60 }
        })
        if (!response.ok) throw new Error("Promolarni yuklab bo'lmadi")
        const result = await response.json()
        return result.data ?? []
    } catch (error) {
        console.error("getHomePromos xatolik:", error)
        return []
    }
}
