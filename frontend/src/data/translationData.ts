import type { TargetLanguage } from '../components/targetLanguages'

export type TranslationRecord = {
  uid: number
  sentence: string
  translation: string
  targetLanguage: TargetLanguage
  sessionID: string
  vocabItems: {
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
      { lemma: 'read', pos: 'VERB' },
      { lemma: 'for', pos: 'ADP' },
      { lemma: 'even', pos: 'ADV' },
      { lemma: 'few', pos: 'ADJ' },
      { lemma: 'minute', pos: 'NOUN' },
      { lemma: 'day', pos: 'NOUN' },
      { lemma: 'help', pos: 'VERB' },
      { lemma: 'improve', pos: 'VERB' },
      { lemma: 'vocabulary', pos: 'NOUN' },
      { lemma: 'focus', pos: 'NOUN' },
      { lemma: 'long-term', pos: 'ADJ' },
      { lemma: 'comprehension', pos: 'NOUN' },
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
      { lemma: 'also', pos: 'ADV' },
      { lemma: 'build', pos: 'VERB' },
      { lemma: 'steady', pos: 'ADJ' },
      { lemma: 'habit', pos: 'NOUN' },
      { lemma: 'of', pos: 'ADP' },
      { lemma: 'reflection', pos: 'NOUN' },
      { lemma: 'learning', pos: 'NOUN' },
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
      { lemma: 'balanced', pos: 'ADJ' },
      { lemma: 'study', pos: 'NOUN' },
      { lemma: 'routine', pos: 'NOUN' },
      { lemma: 'include', pos: 'VERB' },
      { lemma: 'short', pos: 'ADJ' },
      { lemma: 'break', pos: 'NOUN' },
      { lemma: 'clear', pos: 'ADJ' },
      { lemma: 'goal', pos: 'NOUN' },
      { lemma: 'for', pos: 'ADP' },
      { lemma: 'session', pos: 'NOUN' },
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
      { lemma: 'sleep', pos: 'NOUN' },
      { lemma: 'also', pos: 'ADV' },
      { lemma: 'important', pos: 'ADJ' },
      { lemma: 'for', pos: 'ADP' },
      { lemma: 'memory', pos: 'NOUN' },
      { lemma: 'retention', pos: 'NOUN' },
      { lemma: 'concentration', pos: 'NOUN' },
    ],
  },
]

export default translationData
