import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export const useGetWishlist = () => {
    // user'ni obuna qilamiz — login/logout'da enabled qayta baholanadi
    // (faqat hasToken() reaktiv EMAS: login'da badge yangilanmay qolardi)
    const { user } = useUser()
    const { isLoading, data, isError, error } = useQuery({
        queryKey: ["get-wishlist"],
        queryFn: () => api.get("/wishlist").then(res => res?.data),
        enabled: !!user || hasToken(),
        retry: false,
    })
    return { data, isLoading, isError, error }
}
