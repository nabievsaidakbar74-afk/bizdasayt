import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export const useMe = () => {
    const { user } = useUser();
    const { isLoading, data, isError, error } = useQuery({
        queryKey: ["me"],
        queryFn: () => api.get("/auth/me").then(res => res?.data),
        enabled: !!user || hasToken(),
        retry: false,
        staleTime: 5 * 60 * 1000,
    })
    return { data, isLoading, isError, error }
}
