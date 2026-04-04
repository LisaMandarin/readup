import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Types
export interface SessionResponse {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface PassageResponse {
  id: number;
  sentence: string;
  translation: string | null;
  created_at: string;
}

export interface SessionWithPassagesResponse extends SessionResponse {
  passages: PassageResponse[];
}

export interface SessionCreateRequest {
  sentence: string;
}

export interface SessionUpdateRequest {
  title?: string;
}

export interface PassageCreateRequest {
  sentence: string;
  translation?: string;
}

export interface PassageUpdateRequest {
  sentence?: string;
  translation?: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// Create axios instance with auth
const createAuthenticatedRequest = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Sessions API
export const createSession = async (data: SessionCreateRequest) => {
  const api = createAuthenticatedRequest();
  return api.post<SessionResponse>("/sessions/", data);
};

export const getUserSessions = async () => {
  const api = createAuthenticatedRequest();
  return api.get<SessionResponse[]>("/sessions/");
};

export const getSessionWithPassages = async (sessionId: number) => {
  const api = createAuthenticatedRequest();
  return api.get<SessionWithPassagesResponse>(`/sessions/${sessionId}`);
};

export const addPassageToSession = async (
  sessionId: number,
  data: PassageCreateRequest,
) => {
  const api = createAuthenticatedRequest();
  return api.post<PassageResponse>(`/sessions/${sessionId}/passages`, data);
};

export const getSessionPassages = async (sessionId: number) => {
  const api = createAuthenticatedRequest();
  return api.get<PassageResponse[]>(`/sessions/${sessionId}/passages`);
};

export const updateSession = async (
  sessionId: number,
  data: SessionUpdateRequest,
) => {
  const api = createAuthenticatedRequest();
  return api.put<SessionResponse>(`/sessions/${sessionId}`, data);
};

export const deleteSession = async (sessionId: number) => {
  const api = createAuthenticatedRequest();
  return api.delete(`/sessions/${sessionId}`);
};

export const updatePassage = async (
  sessionId: number,
  passageId: number,
  data: PassageUpdateRequest,
) => {
  const api = createAuthenticatedRequest();
  return api.put<PassageResponse>(
    `/sessions/${sessionId}/passages/${passageId}`,
    data,
  );
};

export const deletePassage = async (sessionId: number, passageId: number) => {
  const api = createAuthenticatedRequest();
  return api.delete(`/sessions/${sessionId}/passages/${passageId}`);
};
