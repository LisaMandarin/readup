import API from "./auth";

export interface SessionListItem {
  sessionID: string;
  title: string;
  passagePreview: string;
  targetLanguage: string;
  createdAt: string;
}

export interface TranslationItem {
  uid: number;
  sentence: string;
  translation: string;
  lemma: string[];
  pos: string[];
}

export interface SessionDetail {
  sessionID: string;
  userID: string;
  title: string;
  passagePreview: string;
  fullPassage: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionResponse {
  session: SessionDetail;
  translations: TranslationItem[];
}

export interface DeleteSessionResponse {
  message: string;
}

export const getSessions = () =>
  API.get<SessionListItem[]>("/api/sessions");

export const getSessionById = (sessionId: string) =>
  API.get<SessionResponse>(`/api/sessions/${sessionId}`);

export const deleteSession = (sessionId: string) =>
  API.delete<DeleteSessionResponse>(`/api/sessions/${sessionId}`);