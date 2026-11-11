"use client";

import { type ReactNode, useEffect } from "react";
import { useMe } from "../hooks/useMe";
import { useMounted } from "../hooks/useMounted";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

/**
 * Faqat himoyalangan sahifalar (profil kabi) uchun.
 * Foydalanuvchi kirmagan bo'lsa bosh sahifaga qaytaradi.
 */
export default function ProtectedProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data, isLoading, isError } = useMe();
  const mounted = useMounted();
  const router = useRouter();

  useEffect(() => {
    if (mounted && !isLoading && (isError || !data?.data)) {
      router.replace("/");
    }
  }, [mounted, isLoading, isError, data, router]);

  // !mounted — server va client birinchi renderini bir xil qiladi (hydration fix)
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#4caf7d]" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return null;
  }

  return <>{children}</>;
}
