import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export const useCustomerMe = () => {
  const { user } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-me"],
    queryFn: () => api.get("/customers/me").then((res) => res?.data),
    enabled: !!user || hasToken(),
    retry: false,
  });

  return { profile: data?.data, isLoading, isError };
};
