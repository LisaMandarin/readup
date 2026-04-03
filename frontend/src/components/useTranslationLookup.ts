import { useEffect, useRef, useState } from 'react'

import type { PopupCopy } from '../data/popupCopyByLanguage'
import type { TranslationRecord } from '../data/translationData'
import {
  defaultLookupOptions,
  getLookupResultId,
  getEnabledOptions,
  getLookupMetadata,
  hasEnabledLookupOptions,
  type LookupOptionKey,
  type LookupOptionsState,
  type LookupResult,
  type PopupState,
} from './translationLookup'

type Params = {
  translations: TranslationRecord[]
  popupCopy: PopupCopy
}

export default function useTranslationLookup(params: Params) {
  const { translations, popupCopy } = params
  const [popup, setPopup] = useState<PopupState | null>(null)
  const [lookupOptions, setLookupOptions] =
    useState<LookupOptionsState>(defaultLookupOptions)
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

  const handleLookupOptionChange = (option: LookupOptionKey) => {
    setLookupOptions((current) => ({
      ...current,
      [option]: !current[option],
    }))
  }

  const handleLookupResultDelete = (id: string) => {
    setLookupResults((current) => current.filter((result) => result.id !== id))
  }

  const handleLookUp = () => {
    if (!popup || !hasEnabledLookupOptions(lookupOptions)) {
      return
    }

    const { partOfSpeech, lemma } = getLookupMetadata(
      translations,
      popup.uid,
      popup.selectedText
    )
    const resultId = getLookupResultId(popup.uid, popup.selectedText)
    const nextResult = {
      uid: popup.uid,
      id: resultId,
      selectedText: popup.selectedText,
      partOfSpeech,
      lemma,
      enabledOptions: getEnabledOptions(lookupOptions, popupCopy),
    }

    setLookupResults((current) => {
      const existingIndex = current.findIndex((result) => result.id === resultId)

      if (existingIndex === -1) {
        return [...current, nextResult]
      }

      return current.map((result, index) =>
        index === existingIndex ? nextResult : result
      )
    })

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
      setLookupOptions(defaultLookupOptions)
    }, 0)
  }

  return {
    popup,
    popupRef,
    lookupOptions,
    lookupResults,
    canLookUp: hasEnabledLookupOptions(lookupOptions),
    closePopup,
    handleLookupOptionChange,
    handleLookupResultDelete,
    handleLookUp,
    handleSentenceSelection,
  }
}
