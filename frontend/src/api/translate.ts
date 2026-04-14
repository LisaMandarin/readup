import API from "./auth";
import type { TargetLanguage } from "../components/targetLanguages";

export interface Language {
  code: string;
  name: string;
}

export interface VocabItem {
  word: string;
  lemma: string;
  pos: string;
}

export interface TranslationItem {
  uid: number;
  sentence: string;
  translation: string;
  targetLanguage: TargetLanguage;
  sessionID: string;
  vocabItems: VocabItem[];
}

export interface TranslateResponse {
  translations: TranslationItem[];
}

export const getLanguages = () =>
  API.get<Language[]>("/api/translate/languages");

export const translateText = (data: {
  passage: string;
  targetLanguage: TargetLanguage;
}) =>
  API.post<TranslateResponse>("/api/translate", data);
