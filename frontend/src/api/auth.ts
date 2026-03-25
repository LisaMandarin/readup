import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ""),
});

// Attach JWT to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ─────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  token_type: string;
  username: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export interface HealthResponse {
  status: string;
  database?: string;
}

// ── API calls ─────────────────────────────────────────────

export const signUpRequest = (
  username: string,
  email: string,
  password: string
) => API.post<AuthResponse>("/auth/signup", { username, email, password });

export const signInRequest = (email: string, password: string) =>
  API.post<AuthResponse>("/auth/signin", { email, password });

export const getMeRequest = () => API.get<UserProfile>("/auth/me");

export const signOutRequest = () => API.post<{ message: string }>("/auth/signout");

export const healthCheckRequest = () => API.get<HealthResponse>("/health");

export const databaseHealthCheckRequest = () =>
  API.get<HealthResponse>("/health/db");

export default API;