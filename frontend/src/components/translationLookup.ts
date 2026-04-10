// translationLookup.ts
import type { TranslationRecord } from '../data/translationData'

export type PopupState = {
  top: number
  left: number
  uid: number
  selectedText: string
}

export type LookupOptionKey =
  | 'englishDefinition'
  | 'targetLanguageTranslation'
  | 'exampleSentence'
  | 'cefrLevel'

export type LookupOptionsState = Record<LookupOptionKey, boolean>

// Maps each option key to its API lookup_type value
export const LOOKUP_TYPE_MAP: Record<LookupOptionKey, string> = {
  englishDefinition:         'english_definition',
  targetLanguageTranslation: 'spanish_translation',
  exampleSentence:           'example_sentence',
  cefrLevel:                 'cefr_level',
}

// A single resolved option — label + result from the API
export type ResolvedOption = {
  key:    LookupOptionKey
  label:  string           // e.g. "Definicion en ingles"
  result: string | null    // null while loading, string when done
  error:  string | null    // null unless the API call failed
}

export type LookupResult = {
  uid:          number
  id:           string
  selectedText: string
  partOfSpeech: string
  lemma:        string
  options:      ResolvedOption[]   // replaces enabledOptions: string[]
}

export const defaultLookupOptions: LookupOptionsState = {
  englishDefinition:         false,
  targetLanguageTranslation: false,
  exampleSentence:           false,
  cefrLevel:                 false,
}

export const normalizeToken = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z-]+$/g, '')

export const getLookupMetadata = (
  translations: TranslationRecord[],
  uid: number,
  selectedText: string
) => {
  const translation = translations.find((item) => item.uid === uid)
  const normalizedSelection = normalizeToken(selectedText)
  const selectionTokens = selectedText
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean)

  const matchedVocabItem = translation?.vocabItems.find((item) => {
    const normalizedWord = normalizeToken(item.word)
    if (
      normalizedWord === normalizedSelection ||
      item.lemma === normalizedSelection
    ) {
      return true
    }
    return (
      selectionTokens.includes(normalizedWord) ||
      selectionTokens.includes(item.lemma)
    )
  })

  return {
    partOfSpeech: matchedVocabItem?.pos ?? 'Unknown',
    lemma:
      matchedVocabItem?.lemma ??
      (normalizeToken(selectedText) || selectedText),
  }
}

// Returns only the keys the user checked
export const getEnabledOptionKeys = (
  lookupOptions: LookupOptionsState
): LookupOptionKey[] =>
  (Object.entries(lookupOptions) as Array<[LookupOptionKey, boolean]>)
    .filter(([, isEnabled]) => isEnabled)
    .map(([key]) => key)

export const hasEnabledLookupOptions = (lookupOptions: LookupOptionsState) =>
  Object.values(lookupOptions).some(Boolean)

export const getLookupResultId = (uid: number, selectedText: string) =>
  `${uid}-${normalizeToken(selectedText) || selectedText.trim().toLowerCase()}`