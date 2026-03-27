import API from "./auth";

// ── Types ─────────────────────────────────────────────────

export interface Language {
  code: string;
  name: string;
}

export interface TranslateRequest {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TranslateResponse {
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
}

// ── API Calls ─────────────────────────────────────────────

export const getLanguages = () =>
  API.get<Language[]>("/translate/languages");

export const translateText = (data: TranslateRequest) =>
  API.post<TranslateResponse>("/translate/", data);