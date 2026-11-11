import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export const useGetCart = () => {
    // user'ni obuna qilamiz — login/logout'da komponent qayta render bo'lib
    // enabled yangilanadi (faqat hasToken() reaktiv EMAS)
    const { user } = useUser()
    const { isLoading, data } = useQuery({
        queryKey: ["get-cart"],
        queryFn: () => api.get("/cart").then(res => res?.data),
        // Login qilmagan foydalanuvchida 401 so'rov yubormaymiz
        enabled: !!user || hasToken(),
        retry: false,
    })
    return { data, isLoading }
}
