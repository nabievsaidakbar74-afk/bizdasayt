import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import api from "../services/api/api";
import { hasToken } from "../lib/auth";
import { useUser } from "../context/UserContext";

export type DeliveryAddress = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  city: string;
  district: string;
  mahalla?: string | null;
  street: string;
  house: string;
  apartment?: string | null;
  comment?: string | null;
  isDefault: boolean;
};

export type AddressInput = {
  title?: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  city?: string;
  district: string;
  mahalla?: string;
  street: string;
  house?: string;
  apartment?: string;
  comment?: string;
  isDefault?: boolean;
};

export const useGetAddresses = () => {
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/customers/me/addresses").then((res) => res?.data),
    enabled: !!user || hasToken(),
    retry: false,
  });

  const addresses: DeliveryAddress[] = Array.isArray(data?.data) ? data.data : [];
  return { addresses, isLoading };
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-address"],
    mutationFn: (body: AddressInput) =>
      api.post("/customers/me/addresses", body).then((res) => res?.data),
    onSuccess: () => {
      message.success("Manzil saqlandi");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Manzil saqlanmadi");
    },
  });

  return { createAddress: mutateAsync, isPending };
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<AddressInput> }) =>
      api.patch(`/customers/me/addresses/${id}`, body).then((res) => res?.data),
    onSuccess: () => {
      message.success("Manzil yangilandi");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Manzil yangilanmadi");
    },
  });
  return { updateAddress: mutateAsync, isPending };
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/customers/me/addresses/${id}`).then((res) => res?.data),
    onSuccess: () => {
      message.success("Manzil o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Manzil o'chirilmadi");
    },
  });
  return { deleteAddress: mutateAsync, isPending };
};
