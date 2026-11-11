"use client";

import { useEffect, useState } from "react";
import { Camera, LoaderCircle, LogOut } from "lucide-react";
import { useMe } from "@/src/hooks/useMe";
import {
  useChangePassword,
  useUpdateProfile,
  useUploadAvatar,
} from "@/src/hooks/useUpdateProfile";
import { useLogout } from "@/src/hooks/useLogout";
import { initials, mediaUrl } from "@/src/lib/format";
import ConfirmDialog from "../components/ConfirmDialog";

const fieldClass =
  "h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#4caf7d] focus:ring-2 focus:ring-[#4caf7d]/15";

export default function SettingsPage() {
  const { data } = useMe();
  const me = data?.data;
  const { updateProfile, isPending } = useUpdateProfile();
  const { changePassword, isPending: passwordPending } = useChangePassword();
  const { uploadAvatar, isPending: avatarPending } = useUploadAvatar();
  const { logout, isPending: logoutPending } = useLogout();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [passError, setPassError] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (!me) return;
    setForm({
      firstName: me.firstName || "",
      lastName: me.lastName || "",
      email: me.email || "",
      phone: me.phone || "",
    });
  }, [me]);

  const saveProfile = async () => {
    await updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  const savePassword = async () => {
    if (passwords.newPassword.length < 6) {
      setPassError("Yangi parol kamida 6 belgi bo'lsin");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      setPassError("Parollar mos emas");
      return;
    }
    setPassError("");
    await changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Sozlamalar</h1>
        <p className="mt-1 text-sm text-gray-500">Profil, parol va chiqish.</p>
      </div>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100 sm:p-6">
        <h2 className="mb-4 font-bold">Profil</h2>
        <div className="mb-5 flex items-center gap-4">
          <label className="relative cursor-pointer">
            {me?.avatar ? (
              <img
                src={mediaUrl(me.avatar)}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] text-xl font-bold text-white">
                {initials(me?.firstName, me?.lastName)}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#399765] shadow">
              {avatarPending ? <LoaderCircle size={14} className="animate-spin" /> : <Camera size={14} />}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
            />
          </label>
          <p className="text-sm text-gray-500">Rasmni bosib yangilang.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block text-gray-600">Ism</span>
            <input className={fieldClass} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-gray-600">Familiya</span>
            <input className={fieldClass} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-gray-600">Email</span>
            <input className={fieldClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-gray-600">Telefon</span>
            <input className={fieldClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
        </div>
        <button
          type="button"
          onClick={saveProfile}
          disabled={isPending}
          className="mt-4 cursor-pointer rounded-xl bg-[#4caf7d] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          Saqlash
        </button>
      </section>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100 sm:p-6">
        <h2 className="mb-4 font-bold">Parol</h2>
        <div className="grid gap-3 sm:max-w-md">
          <input
            type="password"
            className={fieldClass}
            placeholder="Joriy parol"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
          <input
            type="password"
            className={fieldClass}
            placeholder="Yangi parol"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
          <input
            type="password"
            className={fieldClass}
            placeholder="Yangi parolni tasdiqlang"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
        </div>
        {passError && <p className="mt-2 text-sm text-red-500">{passError}</p>}
        <button
          type="button"
          onClick={savePassword}
          disabled={passwordPending}
          className="mt-4 cursor-pointer rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          Parolni o'zgartirish
        </button>
      </section>

      <button
        type="button"
        onClick={() => setShowLogout(true)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-500"
      >
        <LogOut size={16} /> Chiqish
      </button>

      <ConfirmDialog
        open={showLogout}
        title="Hisobdan chiqasizmi?"
        text="Haqiqatan ham chiqmoqchimisiz?"
        confirmLabel="Chiqish"
        danger
        loading={logoutPending}
        onClose={() => setShowLogout(false)}
        onConfirm={() => logout()}
      />
    </div>
  );
}
