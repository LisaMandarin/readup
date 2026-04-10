// LookupResults.tsx

import { DeleteOutlined } from '@ant-design/icons'
import { Spin }           from 'antd'

import type { LookupResult } from './translationLookup'

type Props = {
  results:        LookupResult[]
  onDeleteResult: (id: string) => void
}

export default function LookupResults(props: Props) {
  const { results, onDeleteResult } = props

  return (
    <>
      {results.map((result) => (
        <div
          key={result.id}
          className="relative mt-3 rounded-2xl bg-slate-200 p-4 text-sm text-[var(--text-main)] first:mt-0"
        >
          {/* Delete button */}
          <button
            type="button"
            aria-label={`Delete lookup result for ${result.selectedText}`}
            onClick={() => onDeleteResult(result.id)}
            className="absolute top-3 right-3 p-2 text-sm text-slate-600 transition hover:text-red-600"
          >
            <DeleteOutlined />
          </button>

          {/* Word + metadata */}
          <div className="space-y-3">
            <div>
              <p className="m-0 text-base font-semibold text-[var(--text-main)]">
                {result.selectedText}
              </p>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                {result.lemma} · {result.partOfSpeech}
              </p>
            </div>

            {/* Option results */}
            {result.options.length > 0 ? (
              <div className="space-y-2">
                {result.options.map((option) => (
                  <div
                    key={`${result.id}-${option.key}`}
                    className="rounded-xl bg-white px-3 py-2"
                  >
                    {/* Label */}
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {option.label}
                    </p>

                    {/* Loading */}
                    {option.result === null && option.error === null && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Spin size="small" />
                        <span className="text-xs">Loading…</span>
                      </div>
                    )}

                    {/* Result */}
                    {option.result !== null && (
                      <p className="m-0 text-sm text-[var(--text-main)]">
                        {option.result}
                      </p>
                    )}

                    {/* Error */}
                    {option.error !== null && (
                      <p className="m-0 text-sm text-red-500">
                        ⚠ {option.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--card-border)] bg-white px-3 py-2 text-slate-500">
                No options selected.
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}