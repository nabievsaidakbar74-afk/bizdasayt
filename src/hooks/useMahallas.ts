import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";

export const useMahallas = (regionId:string|null,district:string|null) => {
    const { isLoading, data:mahallas } = useQuery({
        queryKey: ["mahallas",district],
        queryFn: () => api.get(`/geo/regions/${regionId}/districts/${district}/mahallas`).then(res=>res?.data),
        enabled:!!district
    })
    return { mahallas, isLoading }
}