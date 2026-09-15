import axios from "axios";
import { env } from "../config/env";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ROLE_KEY = "user_role";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || !original) {
      return Promise.reject(error);
    }

    const requestUrl = original.url || "";
    if (requestUrl.includes("/auth/refresh") || original._retry) {
      clearAuthStorage();
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearAuthStorage();
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const res = await api.post("/v1/auth/refresh", {
        refresh_token: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access_token);
      original.headers.Authorization = `Bearer ${res.data.access_token}`;
      return api(original);
    } catch (refreshError) {
      clearAuthStorage();
      unauthorizedHandler?.();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
