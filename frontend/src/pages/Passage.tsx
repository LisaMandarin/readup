import { Button, Card, Input, Space } from 'antd'
import type { TargetLanguage } from '../components/targetLanguages'

type Props = {
  passage: string
  targetLanguage: TargetLanguage | ''
  onPassageChange: (value: string) => void
  onTranslate: () => void
  onClear: () => void
}

export default function Passage(props: Props) {
  const { passage, targetLanguage, onPassageChange, onTranslate, onClear } = props
  const hasPassage = passage.trim().length > 0
  const isTranslateDisabled =
    !hasPassage || targetLanguage.length === 0
  const needsTargetLanguage = hasPassage && targetLanguage.length === 0

  return (
    <Card
      className='mt-4'
      style={{
        background: 'var(--card-bg)',
      }}
    >
      <Input.TextArea
        rows={5}
        value={passage}
        onChange={(event) => onPassageChange(event.target.value)}
        placeholder='Enter the passage you want to translate'
      />

      <Space className='mt-4'>
        <Button type='primary' onClick={onTranslate} disabled={isTranslateDisabled}>
          Translation
        </Button>
        <Button onClick={onClear}>Clear</Button>
      </Space>

      {needsTargetLanguage && (
        <p className="mt-3 mb-0 text-sm text-amber-700">
          Select a target language in Settings to enable translation.
        </p>
      )}
    </Card>
  )
}
