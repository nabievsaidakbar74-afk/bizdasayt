import { useQuery } from "@tanstack/react-query";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export const usePurchasedProducts = () => {
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["purchased-products"],
    queryFn: () =>
      api.get("/customers/me/purchased-products").then((res) => res?.data),
    enabled: !!user || hasToken(),
    retry: false,
  });

  const products = Array.isArray(data?.data)
    ? data.data
    : data?.data?.items ?? [];

  return { products, isLoading };
};
