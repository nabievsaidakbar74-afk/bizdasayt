import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "../services/api/api";
import { useUser } from "../context/UserContext";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../lib/auth";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem(REFRESH_TOKEN_KEY)
          : null;
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }).catch(() => null);
      }
    },
    onSettled: () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setUser(null);
      queryClient.clear();
      router.push("/");
    },
  });

  return { logout: mutateAsync, isPending };
};
