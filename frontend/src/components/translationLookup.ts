import type { PopupCopy } from '../data/popupCopyByLanguage'
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

export type LookupResult = {
  uid: number
  id: string
  selectedText: string
  partOfSpeech: string
  lemma: string
  enabledOptions: string[]
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

export const getEnabledOptions = (
  lookupOptions: LookupOptionsState,
  popupCopy: PopupCopy
) =>
  (Object.entries(lookupOptions) as Array<[LookupOptionKey, boolean]>)
    .filter(([, isEnabled]) => isEnabled)
    .map(([option]) => popupCopy[option])

export const hasEnabledLookupOptions = (lookupOptions: LookupOptionsState) =>
  Object.values(lookupOptions).some(Boolean)

export const getLookupResultId = (uid: number, selectedText: string) =>
  `${uid}-${normalizeToken(selectedText) || selectedText.trim().toLowerCase()}`