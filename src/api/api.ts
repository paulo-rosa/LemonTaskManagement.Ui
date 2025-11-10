import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 180000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

export default api;
