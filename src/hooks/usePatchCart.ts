"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api/api";
import { App } from "antd";

type PatchCartData = {
  id: string;
  quantity: number;
};

export default function usePatchCart() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { mutate, isPending } = useMutation({
    mutationKey: ["patch-cart"],

    mutationFn: ({ id, quantity }: PatchCartData) =>
      api.patch(`/cart/items/${id}`, { quantity }),

    onSuccess: () => {
      // Miqdor o'zgarishi — sessiz yangilanadi (har safar message charchatadi)
      queryClient.invalidateQueries({
        queryKey: ["get-cart"],
      });
    },

    onError: () => {
      message.error("Xatolik yuz berdi!");
    },
  });

  return { mutate, isPending };
}
