// useTranslationLookup.ts

import { useEffect, useRef, useState } from 'react'

import { fetchWordLookup }        from '../api/lookup'
import type { PopupCopy }         from '../data/popupCopyByLanguage'
import type { TranslationRecord } from '../data/translationData'
import type { TargetLanguage }    from '../components/targetLanguages'
import {
  defaultLookupOptions,
  getLookupResultId,
  getEnabledOptionKeys,
  getLookupMetadata,
  hasEnabledLookupOptions,
  LOOKUP_TYPE_MAP,
  type LookupOptionKey,
  type LookupOptionsState,
  type LookupResult,
  type ResolvedOption,
  type PopupState,
} from './translationLookup'

type Params = {
  translations:   TranslationRecord[]
  popupCopy:      PopupCopy
  targetLanguage: TargetLanguage   // e.g. "spanish"
}

export default function useTranslationLookup(params: Params) {
  const { translations, popupCopy, targetLanguage } = params

  const [popup, setPopup]               = useState<PopupState | null>(null)
  const [lookupOptions, setLookupOptions] = useState<LookupOptionsState>(defaultLookupOptions)
  const [lookupResults, setLookupResults] = useState<LookupResult[]>([])
  const popupRef = useRef<HTMLDivElement | null>(null)

  // ── Close popup on outside click / scroll / resize ──────────────────────
  useEffect(() => {
    if (!popup) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Node && popupRef.current?.contains(target)) return
      window.getSelection()?.removeAllRanges()
      setPopup(null)
    }

    const handleViewportChange = () => setPopup(null)

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
    setLookupResults((current) =>
      current.filter((result) => result.id !== id)
    )
  }

  // ── Core: build a skeleton result immediately, then fill results async ──
  const handleLookUp = async () => {
    if (!popup || !hasEnabledLookupOptions(lookupOptions)) return

    const { partOfSpeech, lemma } = getLookupMetadata(
      translations,
      popup.uid,
      popup.selectedText
    )

    const resultId      = getLookupResultId(popup.uid, popup.selectedText)
    const enabledKeys   = getEnabledOptionKeys(lookupOptions)

    // Find the sentence text for context
    const sentenceRecord = translations.find((t) => t.uid === popup.uid)
    const context        = sentenceRecord?.sentence ?? undefined

    // Build skeleton options — result: null means "loading"
    const skeletonOptions: ResolvedOption[] = enabledKeys.map((key) => ({
      key,
      label:  popupCopy[key],
      result: null,
      error:  null,
    }))

    const skeletonResult: LookupResult = {
      uid:          popup.uid,
      id:           resultId,
      selectedText: popup.selectedText,
      partOfSpeech,
      lemma,
      options:      skeletonOptions,
    }

    // Show the card immediately with loading state
    setLookupResults((current) => {
      const existingIndex = current.findIndex((r) => r.id === resultId)
      if (existingIndex === -1) return [...current, skeletonResult]
      return current.map((r, i) => (i === existingIndex ? skeletonResult : r))
    })

    window.getSelection()?.removeAllRanges()
    setPopup(null)

    // Fire all API calls in parallel
    await Promise.all(
      enabledKeys.map(async (key) => {
        const lookupType = LOOKUP_TYPE_MAP[key]

        try {
          const response = await fetchWordLookup(
            {
              word:            popup.selectedText,
              context,
              lookup_type:     lookupType as Parameters<typeof fetchWordLookup>[0]['lookup_type'],
              target_language: targetLanguage,
            },
          )

          // Patch just this option in the result
          setLookupResults((current) =>
            current.map((r) => {
              if (r.id !== resultId) return r
              return {
                ...r,
                options: r.options.map((opt) =>
                  opt.key === key
                    ? { ...opt, result: response.result, error: null }
                    : opt
                ),
              }
            })
          )
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Something went wrong'

          setLookupResults((current) =>
            current.map((r) => {
              if (r.id !== resultId) return r
              return {
                ...r,
                options: r.options.map((opt) =>
                  opt.key === key
                    ? { ...opt, result: null, error: message }
                    : opt
                ),
              }
            })
          )
        }
      })
    )
  }

  const handleSentenceSelection = (uid: number) => {
    window.setTimeout(() => {
      const selection = window.getSelection()

      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setPopup(null)
        return
      }

      const range           = selection.getRangeAt(0)
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

      if (
        !selectionInsideSentence ||
        selection.toString().trim().length === 0
      ) {
        setPopup(null)
        return
      }

      const rect            = range.getBoundingClientRect()
      const popupWidth      = 320
      const popupHeight     = 520
      const viewportPadding = 16

      const top = Math.min(
        rect.bottom + 12,
        window.innerHeight - popupHeight - viewportPadding
      )
      const left = Math.min(
        Math.max(rect.left, viewportPadding),
        window.innerWidth - popupWidth - viewportPadding
      )

      setPopup({ top, left, uid, selectedText: selection.toString().trim() })
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