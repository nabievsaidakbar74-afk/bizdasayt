export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://oline-shop-backend.onrender.com/api";

const FETCH_TIMEOUT_MS = 8000;

export async function serverFetch(path: string, init?: RequestInit) {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}
