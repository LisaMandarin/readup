import { useEffect, useRef, useState } from 'react'
import { TranslationOutlined } from '@ant-design/icons'
import { Card } from 'antd'

import targetLanguageNames from '../data/targetLanguageNames.json'
import popupCopyByLanguage from '../data/popupCopyByLanguage'
import type { TranslationRecord } from '../data/translationData'

type Props = {
  translations: TranslationRecord[]
}

type PopupState = {
  top: number
  left: number
  uid: number
  selectedText: string
}

type LookupOptionKey =
  | 'englishDefinition'
  | 'targetLanguageTranslation'
  | 'exampleSentence'
  | 'cefrLevel'

type LookupOptionsState = Record<LookupOptionKey, boolean>

type LookupResult = {
  uid: number
  id: string
  selectedText: string
  partOfSpeech: string
  lemma: string
  enabledOptions: string[]
}

export default function Translation(props: Props) {
  const { translations } = props
  const [popup, setPopup] = useState<PopupState | null>(null)
  const [lookupOptions, setLookupOptions] = useState<LookupOptionsState>({
    englishDefinition: false,
    targetLanguageTranslation: false,
    exampleSentence: false,
    cefrLevel: false,
  })
  const [lookupResults, setLookupResults] = useState<LookupResult[]>([])
  const popupRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!popup) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target

      if (target instanceof Node && popupRef.current?.contains(target)) {
        return
      }

      window.getSelection()?.removeAllRanges()
      setPopup(null)
    }

    const handleViewportChange = () => {
      setPopup(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [popup])

  const closePopup = () => {
    window.getSelection()?.removeAllRanges()
    setPopup(null)
  }

  const normalizeToken = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/^[^a-z]+|[^a-z-]+$/g, '')

  const getLookupMetadata = (uid: number, selectedText: string) => {
    const translation = translations.find((item) => item.uid === uid)
    const normalizedSelection = normalizeToken(selectedText)
    const selectionTokens = selectedText
      .split(/\s+/)
      .map(normalizeToken)
      .filter(Boolean)

    const matchedVocabItem = translation?.vocabItems.find((item) => {
      const normalizedWord = normalizeToken(item.word)

      if (
        normalizedWord === normalizedSelection ||
        item.lemma === normalizedSelection
      ) {
        return true
      }

      return (
        selectionTokens.includes(normalizedWord) ||
        selectionTokens.includes(item.lemma)
      )
    })

    return {
      partOfSpeech: matchedVocabItem?.pos ?? 'Unknown',
      lemma:
        matchedVocabItem?.lemma ??
        (normalizeToken(selectedText) || selectedText),
    }
  }

  const handleLookupOptionChange = (option: LookupOptionKey) => {
    setLookupOptions((current) => ({
      ...current,
      [option]: !current[option],
    }))
  }

  const handleLookUp = () => {
    if (!popup) {
      return
    }

    const { partOfSpeech, lemma } = getLookupMetadata(
      popup.uid,
      popup.selectedText
    )
    const enabledOptions = (
      Object.entries(lookupOptions) as Array<[LookupOptionKey, boolean]>
    )
      .filter(([, isEnabled]) => isEnabled)
      .map(([option]) => popupCopy[option])

    setLookupResults((current) => [
      ...current,
      {
        uid: popup.uid,
        id: `${popup.uid}-${popup.selectedText}-${Date.now()}`,
        selectedText: popup.selectedText,
        partOfSpeech,
        lemma,
        enabledOptions,
      },
    ])
    window.getSelection()?.removeAllRanges()
    setPopup(null)
  }

  const handleSentenceSelection = (uid: number) => {
    window.setTimeout(() => {
      const selection = window.getSelection()

      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setPopup(null)
        return
      }

      const range = selection.getRangeAt(0)
      const sentenceElement = document.querySelector<HTMLElement>(
        `[data-sentence-uid="${uid}"]`
      )

      if (!sentenceElement) {
        setPopup(null)
        return
      }

      const commonAncestor = range.commonAncestorContainer
      const selectionInsideSentence = sentenceElement.contains(
        commonAncestor.nodeType === Node.TEXT_NODE
          ? commonAncestor.parentNode
          : commonAncestor
      )

      if (!selectionInsideSentence || selection.toString().trim().length === 0) {
        setPopup(null)
        return
      }

      const rect = range.getBoundingClientRect()
      const popupWidth = 320
      const popupHeight = 520
      const viewportPadding = 16
      const top = Math.min(
        rect.bottom + 12,
        window.innerHeight - popupHeight - viewportPadding
      )
      const left = Math.min(
        Math.max(rect.left, viewportPadding),
        window.innerWidth - popupWidth - viewportPadding
      )

      setPopup({
        top,
        left,
        uid,
        selectedText: selection.toString().trim(),
      })
      setLookupOptions({
        englishDefinition: false,
        targetLanguageTranslation: false,
        exampleSentence: false,
        cefrLevel: false,
      })
    }, 0)
  }

  const firstTranslation = translations[0]

  if (!firstTranslation) {
    return null
  }

  const targetLanguage = firstTranslation.targetLanguage
  const languageLabel =
    targetLanguageNames[targetLanguage].targetLanguageName
  const popupCopy = popupCopyByLanguage[targetLanguage]
  const popupMetadata = popup
    ? getLookupMetadata(popup.uid, popup.selectedText)
    : null

  return (
    <Card
      className="mt-4"
      title={`Translation (${languageLabel})`}
      style={{ background: 'var(--card-bg)' }}
    >
      <div className="space-y-4">
        {translations.map((item) => (
          <div
            key={item.uid}
            className="select-none rounded-lg border border-[var(--card-border)] bg-white/70 p-4"
          >
            <p
              className="m-0 select-text text-sm leading-6 text-[var(--text-main)]"
              data-sentence-uid={item.uid}
              onMouseUp={() => handleSentenceSelection(item.uid)}
            >
              {item.sentence}
            </p>
            <div className="mt-3 flex items-start gap-3 rounded-md bg-[rgba(15,95,92,0.08)] px-3 py-3 text-slate-700">
              <TranslationOutlined className="mt-1 text-base text-[var(--accent)]" />
              <p className="m-0 text-sm leading-6">
                {item.translation}
              </p>
            </div>
            {lookupResults
              .filter((result) => result.uid === item.uid)
              .map((result) => (
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
          </div>
        ))}
      </div>
      {popup && (
        <div
          ref={popupRef}
          className="fixed z-50 w-80 rounded-2xl border border-[var(--card-border)] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
          style={{ top: popup.top, left: popup.left }}
        >
          {popupMetadata && (
            <div className="mb-3 rounded-xl bg-[rgba(15,95,92,0.08)] px-3 py-2 text-sm font-medium text-[var(--text-main)]">
              {popup.selectedText} | {popupMetadata.partOfSpeech}
            </div>
          )}
          <div className="space-y-2 text-sm text-[var(--text-main)]">
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={lookupOptions.englishDefinition}
                onChange={() => handleLookupOptionChange('englishDefinition')}
              />
              <span>{popupCopy.englishDefinition}</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={lookupOptions.targetLanguageTranslation}
                onChange={() =>
                  handleLookupOptionChange('targetLanguageTranslation')
                }
              />
              <span>{popupCopy.targetLanguageTranslation}</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={lookupOptions.exampleSentence}
                onChange={() => handleLookupOptionChange('exampleSentence')}
              />
              <span>{popupCopy.exampleSentence}</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={lookupOptions.cefrLevel}
                onChange={() => handleLookupOptionChange('cefrLevel')}
              />
              <span>{popupCopy.cefrLevel}</span>
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
              onClick={closePopup}
            >
              {popupCopy.cancel}
            </button>
            <button
              type="button"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
              onClick={handleLookUp}
            >
              {popupCopy.lookUp}
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
