import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App } from "antd"
import api from "../services/api/api"
import { useAuthModal } from "../providers/AuthModalProvider"

type ToggleArgs = {
    productId: string
    // Hozir wishlist'da bormi — bo'lsa DELETE, bo'lmasa POST qilamiz
    inWishlist: boolean
}

export const useAddWishlist = () => {
    const queryClient = useQueryClient()
    const { message } = App.useApp()
    const { openAuth } = useAuthModal()
    const { isPending, mutate: toggleWishlist } = useMutation({
        mutationKey: ['toggle-wishlist'],
        mutationFn: ({ productId, inWishlist }: ToggleArgs) =>
            inWishlist
                ? api.delete(`/wishlist/${productId}`).then(res => res?.data)
                : api.post(`/wishlist/${productId}`).then(res => res?.data),
        // Optimistic update — yurakcha va header count'i server javobini
        // kutmasdan darhol yangilanadi. Xatolikda eski holatga qaytadi.
        onMutate: async ({ productId, inWishlist }) => {
            await queryClient.cancelQueries({ queryKey: ["get-wishlist"] })
            const previous = queryClient.getQueryData(["get-wishlist"])
            queryClient.setQueryData(["get-wishlist"], (old: any) => {
                const items = old?.data?.items
                if (!Array.isArray(items)) return old
                const matches = (it: any) =>
                    it?.productId === productId || it?.product?.id === productId
                const alreadyIn = items.some(matches)
                const next = inWishlist
                    ? items.filter((it: any) => !matches(it))
                    : alreadyIn
                      ? items
                      : [...items, { id: `optimistic-${productId}`, productId }]
                return { ...old, data: { ...old?.data, items: next } }
            })
            return { previous }
        },
        onError: (error: any, _vars, context) => {
            // Xatolikda optimistic o'zgarishni bekor qilamiz
            if (context?.previous !== undefined) {
                queryClient.setQueryData(["get-wishlist"], context.previous)
            }
            if (error?.response?.status === 401) {
                // Login qilmagan foydalanuvchiga darhol auth modalini ochamiz
                openAuth("login")
            } else {
                message.error("Xatolik yuz berdi, qaytadan urinib ko'ring")
            }
        },
        onSettled: () => {
            // Muvaffaqiyat xabarini chaqiruvchi komponent ko'rsatadi
            // (qo'shildi/olib tashlandi deb farqlashi uchun)
            queryClient.invalidateQueries({ queryKey: ["get-wishlist"] })
        }
    })
    return { toggleWishlist, isPending }
}
