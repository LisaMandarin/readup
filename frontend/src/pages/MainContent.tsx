import type { TargetLanguage } from '../components/targetLanguages'
import Translation from '../components/Translation'
import Passage from './Passage'

export type TranslationRecord = {
  uid: number
  sentence: string
  translation: string
  lemma: string[]
  pos: string[]
}

type MainContentProps = {
  passage: string
  targetLanguage: TargetLanguage | ''
  onPassageChange: (value: string) => void
  onTranslate: () => void
  onClear: () => void
  translations: TranslationRecord[]
}

export default function MainContent({
  passage,
  targetLanguage,
  onPassageChange,
  onTranslate,
  onClear,
  translations,
}: MainContentProps) {
  return (
    <main className="flex-1 rounded-lg border-4 border-[var(--card-border)] p-4">
      <h1 className="m-4 text-center text-4xl font-extrabold">Read Up</h1>

      <p className="text-center">
        Turn any text into an interactive learning experience — translate,
        explore vocabulary, and truly understand what you read.
      </p>

      <Passage
        passage={passage}
        targetLanguage={targetLanguage}
        onPassageChange={onPassageChange}
        onTranslate={onTranslate}
        onClear={onClear}
      />

      <Translation
        translations={translations}
        targetLanguage={targetLanguage}
      />
    </main>
  )
}