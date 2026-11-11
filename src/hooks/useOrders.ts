import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export const useOrders = (page = 1, status?: string) => {
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", page, status || "all"],
    queryFn: () =>
      api
        .get("/orders", {
          params: { page, limit: 10, ...(status ? { status } : {}) },
        })
        .then((res) => res?.data),
    enabled: !!user || hasToken(),
    retry: false,
  });

  return {
    orders: Array.isArray(data?.data) ? data.data : [],
    meta: data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 },
    isLoading,
  };
};

export const useOrder = (id?: string) => {
  const { user } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`).then((res) => res?.data),
    enabled: (!!user || hasToken()) && !!id,
    retry: false,
  });

  return { order: data?.data, isLoading, isError };
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => api.post(`/orders/${id}/cancel`).then((res) => res?.data),
    onSuccess: () => {
      message.success("Buyurtma bekor qilindi");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Bekor qilib bo'lmadi");
    },
  });
  return { cancelOrder: mutateAsync, isPending };
};

export const useReturnOrder = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => api.post(`/orders/${id}/return`).then((res) => res?.data),
    onSuccess: () => {
      message.success("Qaytarish so'rovi yuborildi");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Qaytarish yuborilmadi");
    },
  });
  return { returnOrder: mutateAsync, isPending };
};
