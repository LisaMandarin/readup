import type { TranslationRecord } from '../types/translation'

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

export type LookupResult = {
  uid: number
  id: string
  selectedText: string
  partOfSpeech: string
  lemma: string
  requestedOptions: LookupOptionsState
  translation: string
  definition: string
  example: string
  level: string
  error?: string
}

export const defaultLookupOptions: LookupOptionsState = {
  englishDefinition: false,
  targetLanguageTranslation: false,
  exampleSentence: false,
  cefrLevel: false,
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
    lemma: matchedVocabItem?.lemma ?? (normalizeToken(selectedText) || selectedText),
  }
}

export const hasEnabledLookupOptions = (lookupOptions: LookupOptionsState) =>
  Object.values(lookupOptions).some(Boolean)

export const toVocabOptionsRequest = (lookupOptions: LookupOptionsState) => ({
  translation: lookupOptions.targetLanguageTranslation,
  definition: lookupOptions.englishDefinition,
  example: lookupOptions.exampleSentence,
  level: lookupOptions.cefrLevel,
})

export const getLookupResultId = (uid: number, selectedText: string) =>
  `${uid}-${normalizeToken(selectedText) || selectedText.trim().toLowerCase()}`
