"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api/api";
import { App } from "antd";

export default function useDeleteCartId() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { mutate: CartDeleteId, isPending:CartDeleteIdPending } = useMutation({
    mutationKey: ["delete-cart-id"],

    mutationFn: (id: string) => api.delete(`/cart/items/${id}`),

    onSuccess: () => {
      message.success("Mahsulot savatdan o'chirildi");

      queryClient.invalidateQueries({
        queryKey: ["get-cart"],
      });
    },

    onError: () => {
      message.error("Xatolik yuz berdi!");
    },
  });

  return { CartDeleteId, CartDeleteIdPending };
}
