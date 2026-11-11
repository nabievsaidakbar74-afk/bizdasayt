"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronRight,
  LoaderCircle,
  LogIn,
  MapPin,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { useGetCart } from "@/src/hooks/useGetCart";
import { useMounted } from "@/src/hooks/useMounted";
import { useAuthModal } from "@/src/providers/AuthModalProvider";
import { useCreateOrder } from "@/src/hooks/useCreateOrder";
import { useUser } from "@/src/context/UserContext";
import { useRegions } from "@/src/hooks/useRegions";
import { useDistricts } from "@/src/hooks/useDistricts";
import { useMahallas } from "@/src/hooks/useMahallas";
import SearchSelect from "@/src/components/SearchSelect";
import { geoList, geoName } from "@/src/lib/geo";

const formatPrice = (price: number) =>
  Number(price || 0).toLocaleString("en-US").replace(/,/g, " ") + " so'm";

const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem("bizdaAccessTokin");

const fieldClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#4caf7d] focus:ring-2 focus:ring-[#4caf7d]/15 disabled:cursor-not-allowed disabled:bg-gray-100";

const emptyAddress = {
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
};

export default function CheckoutPage() {
  const { data, isLoading } = useGetCart();
  const mounted = useMounted();
  const { openAuth } = useAuthModal();
  const { user } = useUser();
  const { createOrder, isPending: orderPending } = useCreateOrder();

  const [form, setForm] = useState(emptyAddress);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const { regions, isLoading: regionsLoading } = useRegions();
  const regionList = geoList(regions);
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

  const items = data?.data?.items || [];
  const totalPrice = items.reduce(
    (total: number, item: any) => total + (item.lineTotal ?? item.price * item.quantity),
    0,
  );
  const totalQuantity = items.reduce((total: number, item: any) => total + (item.quantity ?? 1), 0);

  const setField = (key: keyof typeof emptyAddress, value: string) => {
    setForm((prev) => {
      if (key === "regionId") {
        return { ...prev, regionId: value, districtId: "", mahallaId: "" };
      }
      if (key === "districtId") {
        return { ...prev, districtId: value, mahallaId: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  const handlePlaceOrder = async () => {
    setFormError("");
    const firstName = form.firstName.trim() || user?.firstName || "";
    const lastName = form.lastName.trim() || user?.lastName || "";
    const phone = form.phone.trim() || user?.phone || "";

    if (!firstName || !lastName || !phone) {
      setFormError("Ism, familiya va telefon majburiy");
      return;
    }
    if (!form.regionId || !form.districtId || !form.mahallaId || !form.street.trim()) {
      setFormError("Viloyat, tuman, mahalla va ko‘chani kiriting");
      return;
    }

    const region = geoName(regionList, form.regionId);
    const district = geoName(districtList, form.districtId);
    const mahalla = geoName(mahallaList, form.mahallaId);

    try {
      const result = await createOrder({
        address: {
          firstName,
          lastName,
          phone,
          region,
          city: region,
          district,
          mahalla,
          street: form.street.trim(),
          house: form.house.trim() || undefined,
          apartment: form.apartment.trim() || undefined,
          comment: form.comment.trim() || undefined,
        },
        notes: notes.trim() || undefined,
      });
      setPlacedOrder(result?.data ?? result);
    } catch {
      setFormError("Buyurtma berishda xatolik yuz berdi. Qayta urinib ko‘ring.");
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-4 py-10">
        <div className="mx-auto max-w-310 space-y-4">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-80 animate-pulse rounded-3xl bg-white ring-1 ring-gray-100" />
        </div>
      </div>
    );
  }

  if (!hasToken()) {
    return (
      <div className="bg-[#f4f7f5] px-4 py-16">
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-[#e7f3ea]">
          <LogIn className="h-10 w-10 text-[#4caf7d]" />
          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
            Buyurtma berish uchun kiring
          </h1>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="mt-6 cursor-pointer rounded-2xl bg-[#4caf7d] px-6 py-3 text-sm font-semibold text-white"
          >
            Kirish
          </button>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    const orderNo =
      placedOrder.orderNumber ||
      placedOrder.number ||
      (typeof placedOrder.id === "string" ? placedOrder.id.slice(0, 8).toUpperCase() : null);

    return (
      <div className="bg-[#f4f7f5] px-4 py-16">
        <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center rounded-[28px] bg-white px-6 py-16 text-center shadow-[0_20px_60px_-30px_rgba(57,151,101,0.45)] ring-1 ring-[#e7f3ea]">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] text-white shadow-lg shadow-[#4caf7d]/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-gray-900">Buyurtma qabul qilindi</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
            Buyurtmangizni manzilingizga yetkazib beramiz. To‘lov mahsulot qo‘lingizga yetganda
            amalga oshiriladi.
          </p>
          {orderNo ? (
            <p className="mt-5 rounded-full bg-[#edf8ee] px-4 py-1.5 text-sm font-bold text-[#2f8a58]">
              Buyurtma № {orderNo}
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4caf7d] to-[#399765] px-7 py-3.5 text-sm font-semibold text-white"
            >
              Xaridni davom ettirish
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center rounded-2xl bg-gray-100 px-6 py-3.5 text-sm font-semibold text-gray-700"
            >
              Buyurtmalarim
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="bg-[#f4f7f5] px-4 py-16">
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-[#e7f3ea]">
          <ShoppingCart className="h-10 w-10 text-[#4caf7d]" />
          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">Savat bo‘sh</h1>
          <p className="mt-3 text-sm text-gray-500">Rasmiylashtirish uchun avval mahsulot qo‘shing.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#4caf7d] px-6 py-3 text-sm font-semibold text-white"
          >
            Xaridni boshlash
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-310">
        <div className="mb-7 flex items-center gap-1.5 text-sm text-gray-400">
          <Link href="/" className="transition hover:text-[#399765]">
            Bosh sahifa
          </Link>
          <ChevronRight size={14} />
          <Link href="/cart" className="transition hover:text-[#399765]">
            Savat
          </Link>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-600">Rasmiylashtirish</span>
        </div>

        <div className="mb-6 flex items-center gap-3.5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4caf7d] to-[#2f8a58] text-white shadow-lg shadow-[#4caf7d]/25">
            <MapPin size={24} />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Buyurtmani rasmiylashtirish
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Yetkazib beramiz, to‘lov mahsulot yetib borgach
            </p>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <section className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] ring-1 ring-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-gray-900">Yetkazish manzili</h2>
              <span className="rounded-full bg-[#edf8ee] px-3 py-1 text-xs font-bold text-[#2f8a58]">
                Yetkazilganda to‘lov
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-gray-600">Ism *</span>
                  <input
                    className={fieldClass}
                    value={form.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    placeholder={user?.firstName || "Ismingiz"}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-gray-600">Familiya *</span>
                  <input
                    className={fieldClass}
                    value={form.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    placeholder={user?.lastName || "Familiyangiz"}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-gray-600">Telefon *</span>
                  <input
                    className={fieldClass}
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder={user?.phone || "+998 90 123 45 67"}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-gray-600">Viloyat *</span>
                  <SearchSelect
                    value={form.regionId}
                    onChange={(value) => setField("regionId", value)}
                    options={regionOptions}
                    loading={regionsLoading}
                    placeholder="Viloyatni qidiring"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-gray-600">Tuman *</span>
                  <SearchSelect
                    value={form.districtId}
                    onChange={(value) => setField("districtId", value)}
                    options={districtOptions}
                    loading={districtsLoading}
                    disabled={!form.regionId}
                    placeholder="Tumanni qidiring"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-gray-600">Mahalla *</span>
                  <SearchSelect
                    value={form.mahallaId}
                    onChange={(value) => setField("mahallaId", value)}
                    options={mahallaOptions}
                    loading={mahallasLoading}
                    disabled={!form.districtId}
                    placeholder="Mahallani qidiring"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-gray-600">Ko‘cha *</span>
                  <input
                    className={fieldClass}
                    value={form.street}
                    onChange={(e) => setField("street", e.target.value)}
                    placeholder="Ko‘cha nomi"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-gray-600">Uy (ixtiyoriy)</span>
                  <input
                    className={fieldClass}
                    value={form.house}
                    onChange={(e) => setField("house", e.target.value)}
                    placeholder="12A"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-gray-600">Xonadon (ixtiyoriy)</span>
                  <input
                    className={fieldClass}
                    value={form.apartment}
                    onChange={(e) => setField("apartment", e.target.value)}
                    placeholder="Ixtiyoriy"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-gray-600">Manzil izohi</span>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setField("comment", e.target.value)}
                    rows={3}
                    placeholder="Qo‘ng‘iroq qiling, darvoza kodi..."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#4caf7d] focus:ring-2 focus:ring-[#4caf7d]/15"
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-gray-600">Buyurtma uchun izoh</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Qo‘shimcha izoh..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#4caf7d] focus:ring-2 focus:ring-[#4caf7d]/15"
                />
              </label>

              {formError ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
              ) : null}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderPending}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4caf7d] to-[#2f8a58] text-sm font-bold text-white shadow-lg shadow-[#4caf7d]/25 transition hover:shadow-xl disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:px-8"
              >
                {orderPending ? <LoaderCircle className="animate-spin" size={16} /> : null}
                Buyurtmani tasdiqlash
              </button>
            </div>
          </section>

          <aside className="sticky top-24 overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100">
            <div className="h-1.5 bg-gradient-to-r from-[#4caf7d] via-[#7ed3a4] to-[#2f8a58]" />
            <div className="p-5">
              <h2 className="text-base font-bold text-gray-900">Buyurtmangiz</h2>
              <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                {items.map((item: any) => {
                  const linePrice = item.lineTotal ?? item.price * item.quantity;
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="line-clamp-1 text-gray-700">
                        {item.product?.name}
                        <span className="text-gray-400"> × {item.quantity}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-gray-900">
                        {formatPrice(linePrice)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-2 border-t border-dashed border-gray-200 pt-4 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} />
                    Yetkazib berish
                  </span>
                  <span className="font-semibold text-[#399765]">Biz yetkazamiz</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Banknote size={14} />
                    To‘lov
                  </span>
                  <span className="font-semibold text-[#399765]">Yetkazilganda</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Package size={14} />
                    {totalQuantity} dona
                  </span>
                  <span className="text-lg font-extrabold text-[#2f8a58]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
