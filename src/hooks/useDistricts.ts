import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";

export const useDistricts = (regionId:string|null) => {
    
    const { isLoading, data:districts } = useQuery({
        queryKey: ["districts",regionId],
        queryFn: () => api.get(`/geo/regions/${regionId}/districts`).then(res=>res?.data),
        enabled:!!regionId
    })
    return { districts, isLoading }
}