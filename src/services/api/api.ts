import axios from "axios";
import { API_URL } from "@/src/lib/apiUrl";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// So'rov ketishidan oldin tokenni biriktirish
api.interceptors.request.use(
  (config) => {
    // Next.js da window/localStorage faqat browser muhitida mavjud
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("bizdaAccessTokin");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serverdan javob kelganda xatolikni ushlash
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("bizdaAccessTokin");
        localStorage.removeItem("bizdaRefreshTokin");
        // localStorage.removeItem("crmUser");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;