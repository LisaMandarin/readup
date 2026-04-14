import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: apiBaseUrl,
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


export interface SentenceTranslationResponse {
  uid: number
  sentence: string
  translation: string
  lemma: string | string[]   // ← was string[]
  pos: string | string[]   // ← was string[]
}

export interface TranslateApiResponse {
  sessionID: string
  translations: SentenceTranslationResponse[]
}

export interface TranslateRequestBody {
  passage: string
  targetLanguage: string
}

export const translateRequest = (body: TranslateRequestBody) =>
  API.post<TranslateApiResponse>('/api/translate', body)

export interface SessionSummary {
  sessionID: string
  title: string
  passagePreview: string
  targetLanguage: string
  createdAt: string
  updatedAt: string
}

export interface SessionDetailResponse {
  sessionID: string
  title: string
  passagePreview: string
  fullPassage: string
  targetLanguage: string
  createdAt: string
  updatedAt: string
  translations: Array<{
    uid: number
    sentence: string
    translation: string
    targetLanguage: string
    sessionID: string
    vocabItems: Array<{
      word: string
      lemma: string
      pos: string
    }>
  }>
}

export const getSessionsRequest = () =>
  API.get<SessionSummary[]>('/api/sessions')

export const getSessionDetailRequest = (sessionID: string) =>
  API.get<SessionDetailResponse>(`/api/sessions/${sessionID}`)

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
