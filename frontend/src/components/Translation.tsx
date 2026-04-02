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
}

export default function Translation(props: Props) {
  const { translations } = props
  const [popup, setPopup] = useState<PopupState | null>(null)
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
      const popupHeight = 248
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
          </div>
        ))}
      </div>
      {popup && (
        <div
          ref={popupRef}
          className="fixed z-50 w-80 rounded-2xl border border-[var(--card-border)] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
          style={{ top: popup.top, left: popup.left }}
        >
          <div className="space-y-2 text-sm text-[var(--text-main)]">
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input type="checkbox" />
              <span>{popupCopy.englishDefinition}</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input type="checkbox" />
              <span>{popupCopy.targetLanguageTranslation}</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input type="checkbox" />
              <span>{popupCopy.exampleSentence}</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-3 py-2">
              <input type="checkbox" />
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
            >
              {popupCopy.lookUp}
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
