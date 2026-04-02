import type { TargetLanguage } from '../components/targetLanguages'

export type TranslationRecord = {
  uid: number
  sentence: string
  translation: string
  targetLanguage: TargetLanguage
  sessionID: string
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
  },
  {
    uid: 1,
    sentence:
      'It also builds a steady habit of reflection and learning.',
    translation:
      'También construye un hábito constante de reflexión y aprendizaje.',
    targetLanguage: 'spanish',
    sessionID: 'session-8f3a',
  },
  {
    uid: 1,
    sentence:
      'A balanced study routine should include short breaks and clear goals for each session.',
    translation:
      "Une routine d'étude équilibrée devrait inclure de courtes pauses et des objectifs clairs pour chaque séance.",
    targetLanguage: 'french',
    sessionID: 'session-b72c',
  },
  {
    uid: 2,
    sentence:
      'Enough sleep is also important for memory retention and concentration.',
    translation:
      'Un sommeil suffisant est également important pour la rétention de la mémoire et la concentration.',
    targetLanguage: 'french',
    sessionID: 'session-b72c',
  },
]

export default translationData
