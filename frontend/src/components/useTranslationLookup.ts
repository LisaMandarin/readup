import { useEffect, useRef, useState } from 'react'

import { fetchWordLookup } from '../api/lookup'
import { deleteTranslationLookupResult } from '../api/session'
import type { TranslationRecord } from '../types/translation'
import {
  defaultLookupOptions,
  getLookupResultId,
  getLookupMetadata,
  hasEnabledLookupOptions,
  toVocabOptionsRequest,
  type LookupOptionKey,
  type LookupOptionsState,
  type LookupResult,
  type PopupState,
} from './translationLookup'

type Params = {
  translations: TranslationRecord[]
  initialLookupResults: LookupResult[]
}

export default function useTranslationLookup(params: Params) {
  const { translations, initialLookupResults } = params
  const [popup, setPopup] = useState<PopupState | null>(null)
  const [lookupOptions, setLookupOptions] =
    useState<LookupOptionsState>(defaultLookupOptions)
  const [lookupResults, setLookupResults] =
    useState<LookupResult[]>(initialLookupResults)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const sessionID = translations[0]?.sessionID ?? ''

  useEffect(() => {
    setLookupResults(initialLookupResults)
    setPopup(null)
    setLookupOptions(defaultLookupOptions)
  }, [initialLookupResults, sessionID])

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

  const handleLookupResultDelete = async (id: string) => {
    if (sessionID) {
      await deleteTranslationLookupResult(sessionID, id)
    }

    setLookupResults((current) => current.filter((result) => result.id !== id))
  }

  const handleLookUp = async () => {
    if (!popup || !hasEnabledLookupOptions(lookupOptions)) {
      return
    }

    const { partOfSpeech, lemma } = getLookupMetadata(
      translations,
      popup.uid,
      popup.selectedText
    )
    const targetLanguage = translations[0]?.targetLanguage
    const requestedOptions = { ...lookupOptions }

    if (!targetLanguage || !sessionID) {
      return
    }

    const fallbackResultId = getLookupResultId(sessionID, popup.uid, lemma)

    setIsLookingUp(true)

    try {
      const response = await fetchWordLookup({
        session_id: sessionID,
        uid: popup.uid,
        selected_text: popup.selectedText,
        word: popup.selectedText,
        lemma,
        pos: partOfSpeech,
        target_language: targetLanguage,
        options: toVocabOptionsRequest(requestedOptions),
      })

      const nextResult: LookupResult = {
        uid: popup.uid,
        id: response.id,
        selectedText: popup.selectedText,
        partOfSpeech,
        lemma,
        requestedOptions,
        translation: response.translation,
        definition: response.definition,
        example: response.example,
        level: response.level,
      }

      setLookupResults((current) => {
        const existingIndex = current.findIndex((result) => result.id === response.id)

        if (existingIndex === -1) {
          return [...current, nextResult]
        }

        return current.map((result, index) =>
          index === existingIndex ? nextResult : result
        )
      })
      window.getSelection()?.removeAllRanges()
      setPopup(null)
    } catch (error) {
      const nextResult: LookupResult = {
        uid: popup.uid,
        id: fallbackResultId,
        selectedText: popup.selectedText,
        partOfSpeech,
        lemma,
        requestedOptions,
        translation: '',
        definition: '',
        example: '',
        level: '',
        error: error instanceof Error ? error.message : 'Lookup failed.',
      }

      setLookupResults((current) => {
        const existingIndex = current.findIndex((result) => result.id === fallbackResultId)

        if (existingIndex === -1) {
          return [...current, nextResult]
        }

        return current.map((result, index) =>
          index === existingIndex ? nextResult : result
        )
      })
    } finally {
      setIsLookingUp(false)
    }
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
    isLookingUp,
    canLookUp: hasEnabledLookupOptions(lookupOptions),
    closePopup,
    handleLookupOptionChange,
    handleLookupResultDelete,
    handleLookUp,
    handleSentenceSelection,
  }
}
