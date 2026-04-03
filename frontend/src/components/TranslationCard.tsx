import { TranslationOutlined } from '@ant-design/icons'

import type { TranslationRecord } from '../data/translationData'
import type { LookupResult } from './translationLookup'
import LookupResults from './LookupResults'

type Props = {
  item: TranslationRecord
  results: LookupResult[]
  onDeleteResult: (id: string) => void
  onSentenceSelection: (uid: number) => void
}

export default function TranslationCard(props: Props) {
  const { item, results, onDeleteResult, onSentenceSelection } = props

  return (
    <div className="select-none rounded-lg border border-[var(--card-border)] bg-white/70 p-4">
      <p
        className="m-0 select-text text-sm leading-6 text-[var(--text-main)]"
        data-sentence-uid={item.uid}
        onMouseUp={() => onSentenceSelection(item.uid)}
      >
        {item.sentence}
      </p>
      <div className="mt-3 flex items-start gap-3 rounded-md bg-[rgba(15,95,92,0.08)] px-3 py-3 text-slate-700">
        <TranslationOutlined className="mt-1 text-base text-[var(--accent)]" />
        <p className="m-0 text-sm leading-6">
          {item.translation}
        </p>
      </div>
      <LookupResults results={results} onDeleteResult={onDeleteResult} />
    </div>
  )
}
