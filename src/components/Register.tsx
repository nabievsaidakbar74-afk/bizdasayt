"use client";

import { ChevronDown } from "lucide-react";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { useMounted } from "../hooks/useMounted";
import { useAuthModal } from "../providers/AuthModalProvider";
import { initials, mediaUrl } from "../lib/format";

export default function Register() {
  const { user } = useUser();
  const mounted = useMounted();
  const { openAuth } = useAuthModal();

  const displayUser = mounted ? user : null;
  const avatar = mediaUrl(displayUser?.avatar);
  const name = displayUser?.firstName || "Profil";

  if (displayUser) {
    return (
      <Link
        href="/account"
        aria-label="Profil"
        className="group flex items-center gap-2 rounded-full border border-[#d9efe0] bg-gradient-to-r from-[#edf8ee] via-white to-white py-1 pl-1 pr-2 shadow-[0_8px_24px_-16px_rgba(47,138,88,0.7)] transition hover:-translate-y-0.5 hover:border-[#4caf7d] hover:shadow-[0_12px_28px_-14px_rgba(47,138,88,0.85)] sm:pr-3"
      >
        <span className="relative shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] text-[11px] font-extrabold text-white ring-2 ring-white">
              {initials(displayUser.firstName, displayUser.lastName)}
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#4caf7d] ring-2 ring-white" />
        </span>
        <span className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="text-[10px] font-medium text-[#2f8a58]">Salom</span>
          <span className="max-w-24 truncate text-sm font-bold text-gray-900">{name}</span>
        </span>
        <ChevronDown
          size={14}
          className="hidden text-gray-400 transition group-hover:text-[#2f8a58] sm:block"
        />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label="Hisobga kirish"
      onClick={() => openAuth("login")}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#4caf7d] text-white transition hover:bg-[#3d9c6c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4caf7d]/40"
    >
      <FaUserAlt size={16} />
    </button>
  );
}
