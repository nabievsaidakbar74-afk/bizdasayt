import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import api from "../services/api/api";
import { useUser } from "../context/UserContext";

type ProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { setUser } = useUser();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: ProfilePayload) =>
      api.patch("/auth/profile", body).then((res) => res?.data),
    onSuccess: (res) => {
      if (res?.data) setUser(res.data);
      message.success("Profil yangilandi");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Profil saqlanmadi");
    },
  });

  return { updateProfile: mutateAsync, isPending };
};

export const useChangePassword = () => {
  const { message } = App.useApp();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      api.patch("/auth/change-password", body).then((res) => res?.data),
    onSuccess: () => {
      message.success("Parol o'zgartirildi");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Parol o'zgarmadi");
    },
  });
  return { changePassword: mutateAsync, isPending };
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { user, setUser } = useUser();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/uploads/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data;
    },
    onSuccess: (res) => {
      const url = res?.data?.url || res?.data?.avatar || res?.data;
      if (url && typeof url === "string" && user) {
        setUser({ ...user, avatar: url });
      }
      message.success("Rasm yuklandi");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["customer-me"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Rasm yuklanmadi");
    },
  });

  return { uploadAvatar: mutateAsync, isPending };
};
