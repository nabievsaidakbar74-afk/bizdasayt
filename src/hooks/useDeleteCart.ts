"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api/api";
import { App } from "antd";

export default function useDeleteCart() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { mutate: CartDelete, isPending } = useMutation({
    mutationKey: ["delete-cart"],

    mutationFn: () => api.delete("/cart"),

    onSuccess: () => {
      message.success("Savat tozalandi!");

      queryClient.invalidateQueries({
        queryKey: ["get-cart"],
      });
    },

    onError: () => {
      message.error("Xatolik yuz berdi!");
    },
  });

  return { CartDelete, isPending };
}
