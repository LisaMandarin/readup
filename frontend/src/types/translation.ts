import type { TargetLanguage } from "../components/targetLanguages";

export type TranslationRecord = {
  uid: number;
  sentence: string;
  translation: string;
  targetLanguage: TargetLanguage;
  sessionID: string;
  vocabItems: {
    word: string;
    lemma: string;
    pos: string;
  }[];
};
