// Passage.tsx

import { Button, Card, Input, Space } from 'antd'
import type { TargetLanguage } from '../components/targetLanguages'

type Props = {
  passage: string
  targetLanguage: TargetLanguage | ''
  onPassageChange: (value: string) => void
  onTranslate: () => void
  onClear: () => void
  isTranslating: boolean        // ← add
}

export default function Passage(props: Props) {
  const {
    passage,
    targetLanguage,
    onPassageChange,
    onTranslate,
    onClear,
    isTranslating,              // ← add
  } = props

  const hasPassage           = passage.trim().length > 0
  const isTranslateDisabled  = !hasPassage || targetLanguage.length === 0 || isTranslating
  const needsTargetLanguage  = hasPassage && targetLanguage.length === 0

  return (
    <Card className="mt-4" style={{ background: 'var(--card-bg)' }}>
      <Input.TextArea
        rows={5}
        value={passage}
        onChange={(event) => onPassageChange(event.target.value)}
        placeholder="Enter the passage you want to translate"
        disabled={isTranslating}   // ← prevent edits mid-request
      />

      <Space className="mt-4">
        <Button
          type="primary"
          onClick={onTranslate}
          disabled={isTranslateDisabled}
          loading={isTranslating}       // ← antd loading spinner on the button
        >
          {isTranslating ? 'Translating…' : 'Translate'}
        </Button>
        <Button
          onClick={onClear}
          disabled={isTranslating}      // ← prevent clear mid-request
        >
          Clear
        </Button>
      </Space>

      {needsTargetLanguage && !isTranslating && (
        <p className="mt-3 mb-0 text-sm text-amber-700">
          Select a target language in Settings to enable translation.
        </p>
      )}
    </Card>
  )
}