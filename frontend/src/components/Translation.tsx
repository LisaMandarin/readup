import { Card } from 'antd'

import targetLanguageNames from './targetLanguageNames.json'
import type { TranslationRecord } from './translationData'

type Props = {
  translations: TranslationRecord[]
}

export default function Translation(props: Props) {
  const { translations } = props

  if (translations.length === 0) {
    return null
  }

  const languageLabel =
    targetLanguageNames[translations[0].targetLanguage].targetLanguageName

  return (
    <Card
      className="mt-4"
      title={`Translation (${languageLabel})`}
      style={{ background: 'var(--card-bg)' }}
    >
      <div className="space-y-4">
        {translations.map((item, index) => (
          <div
            key={item.uid}
            className="rounded-lg border border-[var(--card-border)] bg-white/70 p-4"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sentence {index + 1}
            </p>
            <p className="m-0 text-sm leading-6 text-[var(--text-main)]">
              {item.sentence}
            </p>
            <p className="mt-3 mb-0 text-sm leading-6 text-slate-600">
              {item.translation}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
