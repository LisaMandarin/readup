import { DownOutlined, TranslationOutlined, UpOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

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
  const [isLookupResultsExpanded, setIsLookupResultsExpanded] = useState(true)
  const previousResultsCountRef = useRef(results.length)

  useEffect(() => {
    if (results.length > previousResultsCountRef.current) {
      setIsLookupResultsExpanded(true)
    }

    previousResultsCountRef.current = results.length
  }, [results.length])

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
      {results.length > 0 && (
        <div className="mt-3 rounded-xl bg-slate-50">
          <button
            type="button"
            onClick={() => setIsLookupResultsExpanded((current) => !current)}
            aria-expanded={isLookupResultsExpanded}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--text-main)] transition"
          >
            <span>{`Results (${results.length})`}</span>
            {isLookupResultsExpanded ? (
              <UpOutlined aria-hidden="true" className="text-xs text-slate-500" />
            ) : (
              <DownOutlined aria-hidden="true" className="text-xs text-slate-500" />
            )}
          </button>
          {isLookupResultsExpanded && (
            <div className="px-3 pb-3">
              <LookupResults results={results} onDeleteResult={onDeleteResult} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
