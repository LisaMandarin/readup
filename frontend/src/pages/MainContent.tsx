import type { TargetLanguage } from '../components/targetLanguages'
import LookupInstructions from '../components/LookupInstructions'
import type { TranslationRecord } from '../data/translationData'
import Translation from '../components/Translation'
import Passage from './Passage'

type MainContentColumnProps = {
  passage: string
  targetLanguage: TargetLanguage | ''
  onPassageChange: (value: string) => void
  onTranslate: () => void
  onClear: () => void
  translations: TranslationRecord[]
}

export default function MainContent(props: MainContentColumnProps) {
  const { passage, targetLanguage, onPassageChange, onTranslate, onClear } = props

  return (
    <main className="flex-1 rounded-lg border-4 border-[var(--card-border)] p-4">
      {/* Top spacing for the main content area */}
      <div className="mb-4">
      </div>

      {/* Page title */}
      <h1 className="m-4 text-center text-4xl font-extrabold">Read Up</h1>
      {/* Short description of the app's purpose */}
      <p className="text-center">
        Turn any text into an interactive learning experience — translate,
        explore vocabulary, and truly understand what you read.
      </p>

      {/* Input area for entering text and triggering translation */}
      <Passage
        passage={passage}
        targetLanguage={targetLanguage}
        onPassageChange={onPassageChange}
        onTranslate={onTranslate}
        onClear={onClear}
      />

      {/* Displays translated results */}
      <Translation translations={props.translations} />

      {/* Explains how the future lookup flow will work */}
      {props.translations.length > 0 && (
        <LookupInstructions targetLanguage={targetLanguage} />
      )}
    </main>
  )
}
