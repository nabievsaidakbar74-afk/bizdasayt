"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { useUser } from "@/src/context/UserContext";
import { useCustomerMe } from "@/src/hooks/useCustomerMe";
import { useLogout } from "@/src/hooks/useLogout";
import { fullName, initials, mediaUrl } from "@/src/lib/format";
import ConfirmDialog from "./ConfirmDialog";

const nav = [
  { href: "/account", label: "Umumiy", icon: LayoutGrid, exact: true },
  { href: "/account/orders", label: "Buyurtmalar", icon: Package },
  { href: "/account/wishlist", label: "Sevimlilar", icon: Heart },
  { href: "/account/addresses", label: "Manzillarim", icon: MapPin },
  { href: "/account/reviews", label: "Reviewlarim", icon: MessageSquare },
  { href: "/account/settings", label: "Sozlamalar", icon: Settings },
];

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { profile } = useCustomerMe();
  const { logout, isPending } = useLogout();
  const [showLogout, setShowLogout] = useState(false);

  const person = profile || user;
  const name = fullName(person?.firstName, person?.lastName);
  const avatar = mediaUrl(person?.avatar);

  const isActive = (item: (typeof nav)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto grid max-w-310 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_-32px_rgba(47,138,88,0.45)] ring-1 ring-[#e7f3ea] lg:sticky lg:top-24">
          <div className="relative bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] px-5 pb-6 pt-6 text-white">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/25"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-4 ring-white/20">
                  {initials(person?.firstName, person?.lastName)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold">{name}</p>
                <p className="truncate text-xs text-white/75">{person?.email}</p>
              </div>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-1 lg:p-3">
            {nav.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#edf8ee] text-[#2f8a58] shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active ? "bg-white text-[#2f8a58]" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <item.icon size={16} />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <ShoppingBag size={16} />
              </span>
              Savat
            </Link>
          </nav>

          <div className="border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={() => setShowLogout(true)}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <LogOut size={16} />
              </span>
              Chiqish
            </button>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>

      <ConfirmDialog
        open={showLogout}
        title="Hisobdan chiqasizmi?"
        text="Haqiqatan ham shaxsiy kabinetingizdan chiqmoqchimisiz?"
        confirmLabel="Chiqish"
        danger
        loading={isPending}
        icon={<LogOut size={20} className="text-red-500" />}
        onClose={() => setShowLogout(false)}
        onConfirm={() => logout()}
      />
    </div>
  );
}
