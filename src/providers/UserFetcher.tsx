"use client";

import { useEffect } from "react";
import { useMe } from "../hooks/useMe";
import { useUser } from "../context/UserContext";

/**
 * Sahifa yuklanganda token bo'lsa foydalanuvchi ma'lumotini
 * olib, UserContext ga yozadi. Hech qanday redirect qilmaydi.
 */
export default function UserFetcher() {
  const { data } = useMe();
  const { setUser } = useUser();

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  return null;
}
