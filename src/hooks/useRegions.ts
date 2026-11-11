import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";

export const useRegions = () => {
    const { isLoading, data:regions } = useQuery({
        queryKey: ["regions"],
        queryFn: () => api.get("/geo/regions").then(res=>res?.data)
    })
    return { regions, isLoading }
}