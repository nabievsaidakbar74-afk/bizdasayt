"use client";

import { useEffect, useState } from "react";

/**
 * Komponent client'da mount bo'lganini qaytaradi.
 * SSR paytida `false` — shu orqi server va client birinchi renderi
 * bir xil bo'lib, hydration mismatch oldi olinadi
 * (masalan, localStorage/token'ga bog'liq so'rovlar uchun).
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
