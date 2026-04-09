import axios, { type AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Always return the response data directly
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then((res) => res as unknown as T);

export const apiPost = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
) => api.post<T>(url, data, config).then((res) => res as unknown as T);

export default api;
