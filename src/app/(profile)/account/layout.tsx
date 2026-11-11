"use client";

import AccountShell from "@/src/features/account/components/AccountShell";
import { type ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
