"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useCreateAddress,
  useDeleteAddress,
  useGetAddresses,
  useUpdateAddress,
  type AddressInput,
  type DeliveryAddress,
} from "@/src/hooks/useAddresses";
import { useRegions } from "@/src/hooks/useRegions";
import { useDistricts } from "@/src/hooks/useDistricts";
import { useMahallas } from "@/src/hooks/useMahallas";
import { useUser } from "@/src/context/UserContext";
import SearchSelect from "@/src/components/SearchSelect";
import { geoList, geoName } from "@/src/lib/geo";
import ConfirmDialog from "../components/ConfirmDialog";

const fieldClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#4caf7d] focus:ring-2 focus:ring-[#4caf7d]/15 disabled:bg-gray-100";

const emptyForm = {
  title: "",
  firstName: "",
  lastName: "",
  phone: "",
  regionId: "",
  districtId: "",
  mahallaId: "",
  street: "",
  house: "",
  apartment: "",
  comment: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { user } = useUser();
  const { addresses, isLoading } = useGetAddresses();
  const { createAddress, isPending: creating } = useCreateAddress();
  const { updateAddress, isPending: updating } = useUpdateAddress();
  const { deleteAddress, isPending: deleting } = useDeleteAddress();
  const { regions, isLoading: regionsLoading } = useRegions();
  const regionList = geoList(regions);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { districts, isLoading: districtsLoading } = useDistricts(form.regionId || null);
  const districtList = geoList(districts);
  const { mahallas, isLoading: mahallasLoading } = useMahallas(
    form.regionId || null,
    form.districtId || null,
  );
  const mahallaList = geoList(mahallas);

  const regionOptions = useMemo(
    () => regionList.map((item) => ({ value: item.id, label: item.name })),
    [regionList],
  );
  const districtOptions = useMemo(
    () => districtList.map((item) => ({ value: item.id, label: item.name })),
    [districtList],
  );
  const mahallaOptions = useMemo(
    () => mahallaList.map((item) => ({ value: item.id, label: item.name })),
    [mahallaList],
  );

  const startCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    });
    setOpen(true);
    setError("");
  };

  const startEdit = (address: DeliveryAddress) => {
    const regionId =
      regionList.find((item) => item.id === address.region || item.name === address.region)?.id ||
      "";
    setEditingId(address.id);
    setForm({
      title: address.title || "",
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      regionId,
      districtId: "",
      mahallaId: "",
      street: address.street || "",
      house: address.house || "",
      apartment: address.apartment || "",
      comment: address.comment || "",
      isDefault: address.isDefault,
    });
    setOpen(true);
    setError("");
  };

  useEffect(() => {
    if (!editingId || !districtList.length || form.districtId) return;
    const current = addresses.find((item) => item.id === editingId);
    if (!current) return;
    const match = districtList.find(
      (item) => item.id === current.district || item.name === current.district,
    );
    if (match) setForm((prev) => ({ ...prev, districtId: match.id }));
  }, [addresses, districtList, editingId, form.districtId]);

  useEffect(() => {
    if (!editingId || !mahallaList.length || form.mahallaId) return;
    const current = addresses.find((item) => item.id === editingId);
    if (!current?.mahalla) return;
    const match = mahallaList.find(
      (item) => item.id === current.mahalla || item.name === current.mahalla,
    );
    if (match) setForm((prev) => ({ ...prev, mahallaId: match.id }));
  }, [addresses, editingId, form.mahallaId, mahallaList]);

  const save = async () => {
    const required = ["firstName", "lastName", "phone", "regionId", "districtId", "street"] as const;
    if (required.some((key) => !String(form[key]).trim())) {
      setError("Majburiy maydonlarni to'ldiring");
      return;
    }
    setError("");
    const region = geoName(regionList, form.regionId);
    const payload: AddressInput = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      region,
      city: region,
      district: geoName(districtList, form.districtId),
      mahalla:form?.mahallaId,
      street: form.street.trim(),
      house: form.house.trim() || undefined,
      isDefault: form.isDefault,
    };
    if (form.title.trim()) payload.title = form.title.trim();
    if (form.mahallaId) payload.mahalla = geoName(mahallaList, form.mahallaId);
    if (form.apartment.trim()) payload.apartment = form.apartment.trim();
    if (form.comment.trim()) payload.comment = form.comment.trim();

    if (editingId) await updateAddress({ id: editingId, body: payload });
    else await createAddress(payload);
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manzillarim</h1>
          <p className="mt-1 text-sm text-gray-500">Kabinet uchun saqlangan manzillar.</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#4caf7d] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} /> Qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-3xl bg-white" />
      ) : addresses.length === 0 && !open ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-white ring-1 ring-gray-100">
          <MapPin className="text-[#4caf7d]" />
          <p className="mt-3 font-bold">Manzil yo'q</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold">{address.title || "Uy"}</p>
                {address.isDefault ? (
                  <span className="rounded-full bg-[#edf8ee] px-2 py-0.5 text-[11px] font-bold text-[#2f8a58]">
                    Asosiy
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-gray-700">
                {address.firstName} {address.lastName} · {address.phone}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {[address.region, address.district, address.mahalla, address.street, address.house]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-semibold"
                >
                  <Pencil size={13} /> Tahrirlash
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(address.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500"
                >
                  <Trash2 size={13} /> O'chirish
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {open ? (
        <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
          <h2 className="mb-4 font-bold">{editingId ? "Manzilni tahrirlash" : "Yangi manzil"}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Nomi</span>
              <input
                className={fieldClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Uy"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Telefon</span>
              <input
                className={fieldClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Ism</span>
              <input
                className={fieldClass}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Familiya</span>
              <input
                className={fieldClass}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Viloyat</span>
              <SearchSelect
                value={form.regionId}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    regionId: value,
                    districtId: "",
                    mahallaId: "",
                  }))
                }
                options={regionOptions}
                loading={regionsLoading}
                placeholder="Viloyatni qidiring"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Tuman</span>
              <SearchSelect
                value={form.districtId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, districtId: value, mahallaId: "" }))
                }
                options={districtOptions}
                loading={districtsLoading}
                disabled={!form.regionId}
                placeholder="Tumanni qidiring"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1.5 block text-gray-600">Mahalla</span>
              <SearchSelect
                value={form.mahallaId}
                onChange={(value) => setForm((prev) => ({ ...prev, mahallaId: value }))}
                options={mahallaOptions}
                loading={mahallasLoading}
                disabled={!form.districtId}
                placeholder="Mahallani qidiring"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1.5 block text-gray-600">Ko'cha</span>
              <input
                className={fieldClass}
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Uy (ixtiyoriy)</span>
              <input
                className={fieldClass}
                value={form.house}
                onChange={(e) => setForm({ ...form, house: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-gray-600">Xonadon</span>
              <input
                className={fieldClass}
                value={form.apartment}
                onChange={(e) => setForm({ ...form, apartment: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
              Asosiy manzil
            </label>
          </div>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={creating || updating}
              className="cursor-pointer rounded-xl bg-[#4caf7d] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              Saqlash
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Yopish
            </button>
          </div>
        </section>
      ) : null}

      <ConfirmDialog
        open={!!deleteId}
        title="Manzilni o'chirasizmi?"
        text="Bu manzil o'chiriladi."
        confirmLabel="O'chirish"
        danger
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteAddress(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
