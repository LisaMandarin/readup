import API from "./auth";

export interface Language {
  code: string;
  name: string;
}

export type TargetLanguage =
  | "spanish"
  | "french"
  | "chinese"
  | "german"
  | "portuguese"
  | "japanese";

export interface TranslationItem {
  uid: number;
  sentence: string;
  translation: string;
  lemma: string[];
  pos: string[];
}

export interface TranslationSession {
  sessionID: string;
  userID: string;
  title: string;
  passagePreview: string;
  fullPassage: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslateResponse {
  session: TranslationSession;
  translations: TranslationItem[];
}

export const getLanguages = () =>
  API.get<Language[]>("/api/translate/languages");

export const translateText = (data: {
  passage: string;
  targetLanguage: TargetLanguage;
}) =>
  API.post<TranslateResponse>("/api/translate", data);