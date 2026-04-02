import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
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

export interface MessageResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

// ── API Calls ─────────────────────────────────────────────

// Step 1: Sign up → sends verification code to email
export const signUpRequest = (
  username: string,
  email: string,
  password: string
) => API.post<MessageResponse>("/auth/signup", { username, email, password });

// Step 2: Verify the 6-digit code from email → returns JWT
export const verifyCodeRequest = (email: string, code: string) =>
  API.post<AuthResponse>("/auth/verify", { email, code });

// Resend the verification code
export const resendCodeRequest = (email: string) =>
  API.post<MessageResponse>("/auth/resend", { email });

// Sign in (email must be verified already)
export const signInRequest = (email: string, password: string) =>
  API.post<AuthResponse>("/auth/signin", { email, password });

// Get current user profile
export const getMeRequest = () => API.get<UserProfile>("/auth/me");

// Health check
export const healthCheckRequest = () =>
  API.get<{ status: string }>("/health");

export default API;