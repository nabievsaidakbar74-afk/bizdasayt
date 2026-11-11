import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App } from "antd"
import api from "../services/api/api"
import { useAuthModal } from "../providers/AuthModalProvider"

type AddCartPayload = {
    productId: string
    variantId?: string
    quantity: number
}

export const useAddCart = () => {
    const queryClient = useQueryClient()
    const { message } = App.useApp()
    const { openAuth } = useAuthModal()
    const { isPending, mutate } = useMutation({
        mutationKey: ['add-cart'],
        mutationFn: (product: AddCartPayload) =>
            api.post(`/cart/items`, product).then(res => res?.data),
        // Optimistic update — header'dagi count server javobini kutmasdan
        // darhol oshadi. Xatolik bo'lsa eski holatga qaytaramiz.
        onMutate: async (product) => {
            await queryClient.cancelQueries({ queryKey: ["get-cart"] })
            const previous = queryClient.getQueryData(["get-cart"])
            queryClient.setQueryData(["get-cart"], (old: any) => {
                const items = old?.data?.items
                if (!Array.isArray(items)) return old
                // Mahsulot allaqachon savatda bo'lsa, son o'zgarmaydi
                const exists = items.some(
                    (it: any) =>
                        it?.productId === product.productId ||
                        it?.product?.id === product.productId
                )
                if (exists) return old
                return {
                    ...old,
                    data: {
                        ...old?.data,
                        items: [
                            ...items,
                            {
                                id: `optimistic-${product.productId}`,
                                productId: product.productId,
                                quantity: product.quantity,
                            },
                        ],
                    },
                }
            })
            return { previous }
        },
        onError: (error: any, _product, context) => {
            // Xatolikda optimistic o'zgarishni bekor qilamiz
            if (context?.previous !== undefined) {
                queryClient.setQueryData(["get-cart"], context.previous)
            }
            if (error?.response?.status === 401) {
                // Login qilmagan foydalanuvchiga darhol auth modalini ochamiz
                openAuth("login")
            } else {
                message.error("Xatolik yuz berdi, qaytadan urinib ko'ring")
            }
        },
        // Muvaffaqiyatda notification EMAS — komponent "fly to cart"
        // animatsiyasini ko'rsatadi. Refetch haqiqiy ma'lumotni olib keladi.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["get-cart"] })
        }
    })
    return { mutate, isPending }
}
