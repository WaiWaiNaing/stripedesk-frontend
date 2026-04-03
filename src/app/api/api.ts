import axios from "axios";
import { AppConfig } from "../config/AppConfig";
import { useAuthStore } from "@/stores/auth";

export const api = axios.create({
  baseURL: AppConfig.apiBaseUrl ?? "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error?.config as (typeof error)["config"] & {
      __retry401?: boolean;
      __skip401Retry?: boolean;
    };

    if (error?.response?.status !== 401 || !originalConfig) {
      return Promise.reject(error);
    }

    if (originalConfig.__skip401Retry) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (originalConfig.__retry401) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalConfig.__retry401 = true;

    // Avoid infinite loops: don't try to refresh when the refresh endpoint itself fails.
    const url = typeof originalConfig.url === "string" ? originalConfig.url : "";
    if (url.includes("/auth/refresh")) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      await api.post("/auth/refresh", {}, { __skip401Retry: true } as any);

      // Retry the original request once the refresh flow completed.
      return api.request(originalConfig);
    } catch (refreshError) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  },
);
