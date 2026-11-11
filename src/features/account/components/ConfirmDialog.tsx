"use client";

import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = "Tasdiqlash",
  danger,
  loading,
  onClose,
  onConfirm,
  icon,
}: {
  open: boolean;
  title: string;
  text: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {icon && (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            {icon}
          </div>
        )}
        <h3 className="mt-4 text-center text-lg font-bold">{title}</h3>
        <p className="mt-2 text-center text-sm text-gray-500">{text}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-xl border border-gray-200 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-[#4caf7d] hover:bg-[#399765]"
            }`}
          >
            {loading && <LoaderCircle size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
