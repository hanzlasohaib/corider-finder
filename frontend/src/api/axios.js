import axios from "axios";
import { env } from "../config/env";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* Request Interceptor
   Automatically attach JWT token */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor
   Handle unauthorized responses */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

    }

    return Promise.reject(error);
  }
);

export default api;
