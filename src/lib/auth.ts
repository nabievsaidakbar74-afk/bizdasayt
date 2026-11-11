export const ACCESS_TOKEN_KEY = "bizdaAccessTokin";
export const REFRESH_TOKEN_KEY = "bizdaRefreshTokin";

export const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem(ACCESS_TOKEN_KEY);
