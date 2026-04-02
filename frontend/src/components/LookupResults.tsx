import type { LookupResult } from './translationLookup'

type Props = {
  results: LookupResult[]
}

export default function LookupResults(props: Props) {
  const { results } = props

  return (
    <>
      {results.map((result) => (
        <div
          key={result.id}
          className="mt-3 rounded-2xl border border-[var(--card-border)] bg-slate-50 p-4 text-sm text-[var(--text-main)]"
        >
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
