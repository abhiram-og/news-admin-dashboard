import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/contexts/AuthContext";
import { toast } from "sonner";

/* =========================================================
   Base URL
   ========================================================= */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/* =========================================================
   Normal JSON API instance
   ========================================================= */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/* =========================================================
   File upload API (multipart/form-data)
   ========================================================= */
export const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

/* =========================================================
   Request interceptor (attach access token)
   ========================================================= */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

uploadApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   Response interceptor (401 handling)
   ========================================================= */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
