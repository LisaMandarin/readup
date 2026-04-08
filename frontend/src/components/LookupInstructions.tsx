import type { TargetLanguage } from './targetLanguages'
import targetLanguageNames from '../data/targetLanguageNames.json'
import {
  lookupInstructions,
  lookupInstructionsByLanguage,
} from '../data/lookupInstructions'

type LookupInstructionsProps = {
  targetLanguage: TargetLanguage | ''
}

export default function LookupInstructions(props: LookupInstructionsProps) {
  const translatedInstructions = props.targetLanguage
    ? lookupInstructionsByLanguage[props.targetLanguage]
    : null
  const translatedLanguageLabel = props.targetLanguage
    ? targetLanguageNames[props.targetLanguage].targetLanguageName
    : null

  return (
    <section className="mt-6 rounded-lg border border-[var(--card-border)] bg-white/60 p-4">
      <h2 className="text-lg font-semibold text-[var(--text-main)]">
        How Lookup Works
      </h2>

      <div className="mt-3 space-y-4 text-sm leading-6 text-[var(--text-main)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-main)]">English</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            {lookupInstructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </div>

        {translatedInstructions && translatedLanguageLabel && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-main)]">
              {translatedLanguageLabel}
            </h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              {translatedInstructions.map((instruction) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
