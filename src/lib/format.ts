import { API_URL } from "./apiUrl";

export const formatPrice = (price: number | string | null | undefined) =>
  Number(price || 0).toLocaleString("en-US").replace(/,/g, " ") + " so'm";

export const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
};

export const mediaUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const origin = API_URL.replace(/\/api\/?$/, "");
  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
};

export const fullName = (first?: string | null, last?: string | null) =>
  [first, last].filter(Boolean).join(" ") || "Foydalanuvchi";

export const initials = (first?: string | null, last?: string | null) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "U";
