import API from "./auth";
import type { TargetLanguage } from "../components/targetLanguages";
import type { LookupResult } from "../components/translationLookup";

export interface TranslationSessionSummary {
  sessionID: string;
  title: string;
  passagePreview: string;
  targetLanguage: TargetLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationSessionSentence {
  uid: number;
  sentence: string;
  translation: string;
  targetLanguage: TargetLanguage;
  sessionID: string;
  vocabItems: Array<{
    word: string;
    lemma: string;
    pos: string;
  }>;
}

export interface TranslationSessionDetail {
  sessionID: string;
  title: string;
  passagePreview: string;
  fullPassage: string;
  targetLanguage: TargetLanguage;
  createdAt: string;
  updatedAt: string;
  translations: TranslationSessionSentence[];
  lookupResults: LookupResult[];
}

export interface DeleteTranslationSessionResponse {
  message: string;
}

export const getTranslationSessions = () =>
  API.get<TranslationSessionSummary[]>("/api/sessions");

export const getTranslationSessionById = (sessionId: string) =>
  API.get<TranslationSessionDetail>(`/api/sessions/${sessionId}`);

export const deleteTranslationSession = (sessionId: string) =>
  API.delete<DeleteTranslationSessionResponse>(`/api/sessions/${sessionId}`);

export const deleteTranslationSessionSentence = (
  sessionId: string,
  uid: number
) => API.delete<{ message: string }>(`/api/sessions/${sessionId}/sentences/${uid}`);

export const deleteTranslationLookupResult = (
  sessionId: string,
  lookupResultId: string
) =>
  API.delete<{ message: string }>(
    `/api/sessions/${sessionId}/lookup-results/${encodeURIComponent(lookupResultId)}`
  );
