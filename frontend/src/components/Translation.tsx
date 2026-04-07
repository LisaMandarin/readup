import { TranslationOutlined } from '@ant-design/icons'
import { Card, Typography, Tag, Divider, Empty } from 'antd'
import type { TargetLanguage } from './targetLanguages'

const { Text } = Typography

export type TranslationRecord = {
  uid: number
  sentence: string
  translation: string
  lemma: string[]
  pos: string[]
}

type Props = {
  translations: TranslationRecord[]
  targetLanguage: TargetLanguage | ''
}

export default function Translation({ translations, targetLanguage }: Props) {
  if (translations.length === 0) {
    return (
      <Card
        className="mt-4"
        title="Translation"
        style={{ background: 'var(--card-bg)' }}
      >
        <Empty description="No translation yet" />
      </Card>
    )
  }

  const languageLabel =
    targetLanguage.length > 0
      ? targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)
      : 'Unknown'

  return (
    <Card
      className="mt-4"
      title={
        <div className="flex items-center gap-2">
          <span>Translation</span>
          <Tag color="blue">{languageLabel}</Tag>
        </div>
      }
      style={{ background: 'var(--card-bg)' }}
    >
      <div className="space-y-4">
        {translations.map((item) => (
          <div
            key={item.uid}
            className="rounded-lg border border-[var(--card-border)] bg-white/70 p-4"
          >
            <Text strong>Sentence {item.uid}</Text>

            <p className="m-0 mt-2 text-sm leading-6 text-[var(--text-main)]">
              {item.sentence}
            </p>

            <div className="mt-3 flex items-start gap-3 rounded-md bg-[rgba(15,95,92,0.08)] px-3 py-3 text-slate-700">
              <TranslationOutlined className="mt-1 text-base text-[var(--accent)]" />
              <p className="m-0 text-sm leading-6">
                {item.translation}
              </p>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className="text-xs text-slate-500">
              <p className="m-0">
                <strong>Lemma:</strong> {item.lemma.join(', ')}
              </p>
              <p className="m-0 mt-1">
                <strong>POS:</strong> {item.pos.join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}