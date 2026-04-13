import { DeleteOutlined } from '@ant-design/icons'

import type { LookupResult } from './translationLookup'

type Props = {
  results: LookupResult[]
  onDeleteResult: (id: string) => void
  onSentenceSelection: (uid: number) => void
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
          <button
            type="button"
            aria-label={`Delete lookup result for ${result.selectedText}`}
            onClick={() => onDeleteResult(result.id)}
            className="absolute top-3 right-3 p-2 text-sm text-slate-600 transition hover:border-red-300 hover:text-red-600"
          >
            <DeleteOutlined />
          </button>
          <div className="space-y-3">
            <div>
              <p className="m-0 text-base font-semibold text-[var(--text-main)]">
                {result.selectedText}:
              </p>
              <p className="mt-1 mb-0 text-sm text-slate-700">
                {result.lemma} ({result.partOfSpeech})
              </p>
            </div>
            <div>
              {result.enabledOptions.length > 0 ? (
                <div className="space-y-2">
                  {result.enabledOptions.map((option) => (
                    <div
                      key={`${result.id}-${option}`}
                      className="rounded-xl bg-white px-3 py-2"
                    >
                      {option}
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
        </div>
      ))}
    </>
  )
}