import type { TargetLanguage } from '../components/targetLanguages'

export type TranslationRecord = {
  uid: number
  sentence: string
  translation: string
  targetLanguage: TargetLanguage
  sessionID: string
  vocabItems: {
    word: string
    lemma: string
    pos: 'NOUN' | 'VERB' | 'ADJ' | 'ADV' | 'ADP' | 'SCONJ'
  }[]
}

const translationData: TranslationRecord[] = [
  {
    uid: 0,
    sentence:
      'Reading for even a few minutes each day helps improve vocabulary, focus, and long-term comprehension.',
    translation:
      'Leer incluso unos pocos minutos cada día ayuda a mejorar el vocabulario, la concentración y la comprensión a largo plazo.',
    targetLanguage: 'spanish',
    sessionID: 'session-8f3a',
    vocabItems: [
      { word: 'Reading', lemma: 'read', pos: 'VERB' },
      { word: 'for', lemma: 'for', pos: 'ADP' },
      { word: 'even', lemma: 'even', pos: 'ADV' },
      { word: 'few', lemma: 'few', pos: 'ADJ' },
      { word: 'minutes', lemma: 'minute', pos: 'NOUN' },
      { word: 'day', lemma: 'day', pos: 'NOUN' },
      { word: 'helps', lemma: 'help', pos: 'VERB' },
      { word: 'improve', lemma: 'improve', pos: 'VERB' },
      { word: 'vocabulary', lemma: 'vocabulary', pos: 'NOUN' },
      { word: 'focus', lemma: 'focus', pos: 'NOUN' },
      { word: 'long-term', lemma: 'long-term', pos: 'ADJ' },
      { word: 'comprehension', lemma: 'comprehension', pos: 'NOUN' },
    ],
  },
  {
    uid: 1,
    sentence:
      'It also builds a steady habit of reflection and learning.',
    translation:
      'También construye un hábito constante de reflexión y aprendizaje.',
    targetLanguage: 'spanish',
    sessionID: 'session-8f3a',
    vocabItems: [
      { word: 'also', lemma: 'also', pos: 'ADV' },
      { word: 'builds', lemma: 'build', pos: 'VERB' },
      { word: 'steady', lemma: 'steady', pos: 'ADJ' },
      { word: 'habit', lemma: 'habit', pos: 'NOUN' },
      { word: 'of', lemma: 'of', pos: 'ADP' },
      { word: 'reflection', lemma: 'reflection', pos: 'NOUN' },
      { word: 'learning', lemma: 'learning', pos: 'NOUN' },
    ],
  },
  {
    uid: 1,
    sentence:
      'A balanced study routine should include short breaks and clear goals for each session.',
    translation:
      "Une routine d'étude équilibrée devrait inclure de courtes pauses et des objectifs clairs pour chaque séance.",
    targetLanguage: 'french',
    sessionID: 'session-b72c',
    vocabItems: [
      { word: 'balanced', lemma: 'balanced', pos: 'ADJ' },
      { word: 'study', lemma: 'study', pos: 'NOUN' },
      { word: 'routine', lemma: 'routine', pos: 'NOUN' },
      { word: 'include', lemma: 'include', pos: 'VERB' },
      { word: 'short', lemma: 'short', pos: 'ADJ' },
      { word: 'breaks', lemma: 'break', pos: 'NOUN' },
      { word: 'clear', lemma: 'clear', pos: 'ADJ' },
      { word: 'goals', lemma: 'goal', pos: 'NOUN' },
      { word: 'for', lemma: 'for', pos: 'ADP' },
      { word: 'session', lemma: 'session', pos: 'NOUN' },
    ],
  },
  {
    uid: 2,
    sentence:
      'Enough sleep is also important for memory retention and concentration.',
    translation:
      'Un sommeil suffisant est également important pour la rétention de la mémoire et la concentration.',
    targetLanguage: 'french',
    sessionID: 'session-b72c',
    vocabItems: [
      { word: 'sleep', lemma: 'sleep', pos: 'NOUN' },
      { word: 'also', lemma: 'also', pos: 'ADV' },
      { word: 'important', lemma: 'important', pos: 'ADJ' },
      { word: 'for', lemma: 'for', pos: 'ADP' },
      { word: 'memory', lemma: 'memory', pos: 'NOUN' },
      { word: 'retention', lemma: 'retention', pos: 'NOUN' },
      { word: 'concentration', lemma: 'concentration', pos: 'NOUN' },
    ],
  },
]

export default translationData
