import axios from "axios";
import { tokenStorage } from "../utils/storage";

const PUBLIC_API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL
  || import.meta.env.VITE_API_BASE_URL
  || "http://localhost:5000/api";
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000/admin-api";

const attachAuthHeader = (config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const publicApi = axios.create({
  baseURL: PUBLIC_API_BASE_URL,
  timeout: 15000
});

export const adminApiClient = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 15000
});

publicApi.interceptors.request.use(attachAuthHeader);
adminApiClient.interceptors.request.use(attachAuthHeader);
