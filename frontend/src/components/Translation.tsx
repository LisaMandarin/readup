import { Card } from 'antd'

import LookupPopup from './LookupPopup'
import TranslationCard from './TranslationCard'
import {
  getLookupMetadata,
} from './translationLookup'
import useTranslationLookup from './useTranslationLookup'
import targetLanguageNames from '../data/targetLanguageNames.json'
import popupCopyByLanguage from '../data/popupCopyByLanguage'
import type { TranslationRecord } from '../data/translationData'

type Props = {
  translations: TranslationRecord[]
}

export default function Translation(props: Props) {
  const { translations } = props
  const firstTranslation = translations[0]

  if (!firstTranslation) {
    return null
  }

  const targetLanguage = firstTranslation.targetLanguage
  const languageLabel =
    targetLanguageNames[targetLanguage].targetLanguageName
  const popupCopy = popupCopyByLanguage[targetLanguage]
  const {
    popup,
    popupRef,
    lookupOptions,
    lookupResults,
    closePopup,
    handleLookupOptionChange,
    handleLookUp,
    handleSentenceSelection,
  } = useTranslationLookup({
    translations,
    popupCopy,
  })
  const popupMetadata = popup
    ? getLookupMetadata(translations, popup.uid, popup.selectedText)
    : null

  return (
    <Card
      className="mt-4"
      title={`Translation (${languageLabel})`}
      style={{ background: 'var(--card-bg)' }}
    >
      <div className="space-y-4">
        {translations.map((item) => (
          <TranslationCard
            key={item.uid}
            item={item}
            results={lookupResults.filter((result) => result.uid === item.uid)}
            onSentenceSelection={handleSentenceSelection}
          />
        ))}
      </div>
      {popup && (
        <LookupPopup
          popup={popup}
          popupRef={popupRef}
          popupCopy={popupCopy}
          lookupOptions={lookupOptions}
          partOfSpeech={popupMetadata?.partOfSpeech ?? 'Unknown'}
          onOptionChange={handleLookupOptionChange}
          onClose={closePopup}
          onLookUp={handleLookUp}
        />
      )}
    </Card>
  )
}
