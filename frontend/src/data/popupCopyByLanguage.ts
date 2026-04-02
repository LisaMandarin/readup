import type { TargetLanguage } from '../components/targetLanguages'

export type PopupCopy = {
  englishDefinition: string
  targetLanguageTranslation: string
  exampleSentence: string
  cefrLevel: string
  lookUp: string
  cancel: string
}

const popupCopyByLanguage: Record<TargetLanguage, PopupCopy> = {
  spanish: {
    englishDefinition: 'Definicion en ingles',
    targetLanguageTranslation: 'Español',
    exampleSentence: 'Frase de ejemplo',
    cefrLevel: 'Nivel MCER',
    lookUp: 'Buscar',
    cancel: 'Cancelar',
  },
  french: {
    englishDefinition: 'Definition anglaise',
    targetLanguageTranslation: 'Français',
    exampleSentence: "Phrase d'exemple",
    cefrLevel: 'Niveau CECR',
    lookUp: 'Rechercher',
    cancel: 'Annuler',
  },
  chinese: {
    englishDefinition: '英文定義',
    targetLanguageTranslation: '中文',
    exampleSentence: '例句',
    cefrLevel: 'CEFR等级',
    lookUp: '查詢',
    cancel: '取消',
  },
  german: {
    englishDefinition: 'Englische Definition',
    targetLanguageTranslation: 'Deutsch',
    exampleSentence: 'Beispielsatz',
    cefrLevel: 'GER-Niveau',
    lookUp: 'Nachschlagen',
    cancel: 'Abbrechen',
  },
}

export default popupCopyByLanguage
