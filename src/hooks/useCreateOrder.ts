import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import api from "../services/api/api";

export type CreateOrderInput = {
  address: {
    firstName: string;
    lastName: string;
    phone: string;
    region: string;
    city?: string;
    district: string;
    mahalla: string;
    street: string;
    house?: string;
    apartment?: string;
    comment?: string;
  };
  notes?: string;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (body: CreateOrderInput) =>
      api.post("/orders", body).then((res) => res?.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
      message.success("Buyurtmangiz qabul qilindi")
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Buyurtma yuborilmadi");
    },
  });

  return { createOrder: mutateAsync, isPending };
};
