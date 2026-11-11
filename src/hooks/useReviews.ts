import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import api from "../services/api/api";

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      productId,
      rating,
      comment,
      orderId,
    }: {
      productId: string;
      rating: number;
      comment?: string;
      orderId: string;
    }) =>
      api
        .post(`/products/${productId}/reviews`, { rating, comment, orderId })
        .then((res) => res?.data),
    onSuccess: () => {
      message.success("Fikr yozildi");
      queryClient.invalidateQueries({ queryKey: ["purchased-products"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Fikr yozilmadi");
    },
  });
  return { createReview: mutateAsync, isPending };
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      rating,
      comment,
    }: {
      id: string;
      rating: number;
      comment?: string;
    }) => api.patch(`/reviews/${id}`, { rating, comment }).then((res) => res?.data),
    onSuccess: () => {
      message.success("Fikr yangilandi");
      queryClient.invalidateQueries({ queryKey: ["purchased-products"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Fikr yangilanmadi");
    },
  });
  return { updateReview: mutateAsync, isPending };
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`).then((res) => res?.data),
    onSuccess: () => {
      message.success("Fikr o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["purchased-products"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Fikr o'chirilmadi");
    },
  });
  return { deleteReview: mutateAsync, isPending };
};
