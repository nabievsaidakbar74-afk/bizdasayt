import { useMutation } from "@tanstack/react-query"
import api from "../services/api/api"
import { App } from "antd";

export const useRegister = () => {
    const { message } = App.useApp()
    const { isPending, mutate: register } = useMutation({
        mutationKey: ['register'],
        mutationFn: (data: any) => api.post("/auth/register", data),
        onError: (error: any) => {
            message.error(error?.response?.data?.message || "Ro'yxatdan o'tishda xatolik");
        },
        onSuccess: () => {
            message.success("Hisob yaratildi, endi kiring");
        }
    })
    return { register, isPending }
}
