import axios from "axios";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

export const axiosInstance = axios.create({
  baseURL: `${APP_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  // ทำให้ array ถูกส่งเป็น ?tierIds=3&tierIds=2 (ซ้ำ key เดิม, ไม่มี [] ใน key)
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();

      Object.entries(params || {}).forEach(([key, value]) => {
        if (value == null) return;

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v == null) return;
            searchParams.append(key, String(v));
          });
        } else {
          searchParams.append(key, String(value));
        }
      });

      return searchParams.toString();
    },
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Unknown error";

    return Promise.reject(new Error(JSON.stringify({ message, statusCode })));
  },
);
