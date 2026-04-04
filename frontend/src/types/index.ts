import type { TargetLanguage } from "../components/targetLanguages";

export type TranslationRecord = {
  uid: number;
  sentence: string;
  translation: string;
  targetLanguage: TargetLanguage;
  sessionID: string;
};

export type SessionHistoryRecord = {
  userID: string;
  sessionID: string;
  title: string;
  passage: string;
  targetLanguage: TargetLanguage;
  createdAt: Date;
  updatedAt: Date;
};
