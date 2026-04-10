// utils/adaptTranslation.ts

import type { TranslationRecord } from '../data/translationData'
import type {
  SentenceTranslationResponse,
  TranslateApiResponse,
} from '../api/auth'
import type { TargetLanguage } from '../components/targetLanguages'

type AllowedPos = 'NOUN' | 'VERB' | 'ADJ' | 'ADV' | 'ADP' | 'SCONJ'

const ALLOWED_POS = new Set<string>([
  'NOUN', 'VERB', 'ADJ', 'ADV', 'ADP', 'SCONJ',
])

function toAllowedPos(pos: string): AllowedPos {
  return ALLOWED_POS.has(pos) ? (pos as AllowedPos) : 'NOUN'
}

// Normalise lemma/pos — backend may send a string or an array
function toArray(value: string | string[]): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean)
  return []
}

export function adaptApiResponse(
  response: TranslateApiResponse,
  targetLanguage: TargetLanguage,
  passage: string,
): TranslationRecord[] {
  return response.translations.map(
    (item: SentenceTranslationResponse): TranslationRecord => {
      const lemmas   = toArray(item.lemma)
      const posArray = toArray(item.pos)

      // Split sentence into tokens to pair with lemmas
      const words = item.sentence
        .split(/\s+/)
        .filter(Boolean)

      return {
        uid:           item.uid,
        sentence:      item.sentence,
        translation:   item.translation,
        targetLanguage,
        sessionID:     response.sessionID,
        vocabItems:    lemmas.map((lemma, index) => ({
          word:  words[index] ?? lemma,
          lemma,
          pos:   toAllowedPos(posArray[index] ?? 'NOUN'),
        })),
      }
    }
  )
}