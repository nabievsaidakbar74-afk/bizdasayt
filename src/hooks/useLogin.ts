import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api/api"
import { App } from "antd"
import { useUser } from "../context/UserContext"

export const useLogin = () => {
    const { setUser } = useUser()
    const queryClient = useQueryClient()
    const { message } = App.useApp()
    const { isPending, mutate: login } = useMutation({
        mutationKey: ['login'],
        mutationFn: (data: any) => api.post("/auth/login", data).then(res => res?.data),
        onError: (error: any) => {
            message.error(error?.response?.data?.message || "Email yoki parol noto'g'ri");
        },
        onSuccess: (data) => {
            message.success("Xush kelibsiz!");
            setUser(data?.data?.user)
            localStorage.setItem("bizdaAccessTokin", data?.data?.accessToken)
            localStorage.setItem("bizdaRefreshTokin", data?.data?.refreshToken)
            queryClient.invalidateQueries()
        }
    })
    return { login, isPending }
}
