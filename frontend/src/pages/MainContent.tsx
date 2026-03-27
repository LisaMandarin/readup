import type { TargetLanguage } from '../components/targetLanguages'
import Passage from './Passage'

type MainContentColumnProps = {
  username?: string
  email?: string
  passage: string
  targetLanguage: TargetLanguage | ''
  onPassageChange: (value: string) => void
  onTranslate: () => void
  onClear: () => void
}

type MainContentProps = MainContentColumnProps

export default function MainContent(props: MainContentProps) {
  const { passage, targetLanguage, onPassageChange, onTranslate, onClear } = props

  return (
    <main className="flex-1 rounded-lg border-4 border-[var(--card-border)] p-4">
      <div className="mb-4">
      </div>

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
    </main>
  )
}
