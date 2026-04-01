import type { TargetLanguage } from './targetLanguages'

export type SessionHistoryRecord = {
  userID: string
  sessionID: string
  title: string
  passage: string
  targetLanguage: TargetLanguage
  createdAt: Date
  updatedAt: Date
}

const sessionHistoryData: SessionHistoryRecord[] = [
  {
    userID: 'user-1042',
    sessionID: 'session-8f3a',
    title: 'The Benefits of Reading Daily',
    passage:
      'Reading for even a few minutes each day helps improve vocabulary, focus, and long-term comprehension. It also builds a steady habit of reflection and learning.',
    targetLanguage: 'spanish',
    createdAt: new Date('2026-03-26T14:20:00+08:00'),
    updatedAt: new Date('2026-03-28T02:02:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-b72c',
    title: 'Healthy Study Routine Notes',
    passage:
      'A balanced study routine should include short breaks, clear goals for each session.  Enough sleep is also important for memory retention and concentration.',
    targetLanguage: 'french',
    createdAt: new Date('2026-03-25T11:05:00+08:00'),
    updatedAt: new Date('2026-03-27T18:15:00+08:00'),
  },
]

export default sessionHistoryData
