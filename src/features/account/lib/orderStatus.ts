export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Kutilmoqda",
  CONFIRMED: "Tasdiqlandi",
  PROCESSING: "Tayyorlanmoqda",
  PACKED: "Qadoqlandi",
  SHIPPED: "Yo'lda",
  DELIVERED: "Yetkazildi",
  CANCELLED: "Bekor qilindi",
  RETURN_REQUESTED: "Qaytarish so'ralgan",
  RETURNED: "Qaytarildi",
};

export const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  PACKED: "bg-violet-50 text-violet-700",
  SHIPPED: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-[#edf8ee] text-[#2f8a58]",
  CANCELLED: "bg-red-50 text-red-600",
  RETURN_REQUESTED: "bg-orange-50 text-orange-700",
  RETURNED: "bg-gray-100 text-gray-600",
};

export const canCancel = (status?: string) =>
  status === "PENDING" || status === "CONFIRMED" || status === "PROCESSING";

export const canReturn = (status?: string) =>
  status === "SHIPPED" || status === "DELIVERED";
