import type { PopupCopy } from '../data/popupCopyByLanguage'
import type {
  LookupOptionKey,
  LookupOptionsState,
  PopupState,
} from './translationLookup'

type Props = {
  popup: PopupState
  popupRef: React.RefObject<HTMLDivElement | null>
  popupCopy: PopupCopy
  lookupOptions: LookupOptionsState
  partOfSpeech: string
  onOptionChange: (option: LookupOptionKey) => void
  onClose: () => void
  onLookUp: () => void
}

export default function LookupPopup(props: Props) {
  const {
    popup,
    popupRef,
    popupCopy,
    lookupOptions,
    partOfSpeech,
    onOptionChange,
    onClose,
    onLookUp,
  } = props

  return (
    <div
      ref={popupRef}
      className="fixed z-50 w-80 rounded-2xl border border-[var(--card-border)] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
      style={{ top: popup.top, left: popup.left }}
    >
      <div className="mb-3 rounded-xl bg-[rgba(15,95,92,0.08)] px-3 py-2 text-sm font-medium text-[var(--text-main)]">
        {popup.selectedText} | {partOfSpeech}
      </div>
      <div className="space-y-2 text-sm text-[var(--text-main)]">
        <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
          <input
            type="checkbox"
            checked={lookupOptions.englishDefinition}
            onChange={() => onOptionChange('englishDefinition')}
          />
          <span>{popupCopy.englishDefinition}</span>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
          <input
            type="checkbox"
            checked={lookupOptions.targetLanguageTranslation}
            onChange={() => onOptionChange('targetLanguageTranslation')}
          />
          <span>{popupCopy.targetLanguageTranslation}</span>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
          <input
            type="checkbox"
            checked={lookupOptions.exampleSentence}
            onChange={() => onOptionChange('exampleSentence')}
          />
          <span>{popupCopy.exampleSentence}</span>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
          <input
            type="checkbox"
            checked={lookupOptions.cefrLevel}
            onChange={() => onOptionChange('cefrLevel')}
          />
          <span>{popupCopy.cefrLevel}</span>
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          onClick={onClose}
        >
          {popupCopy.cancel}
        </button>
        <button
          type="button"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
          onClick={onLookUp}
        >
          {popupCopy.lookUp}
        </button>
      </div>
    </div>
  )
}
