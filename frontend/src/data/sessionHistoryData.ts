import type { TargetLanguage } from '../components/targetLanguages'

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
    passage: 'Reading for even a few minutes each day helps impr',
    targetLanguage: 'spanish',
    createdAt: new Date('2026-03-26T14:20:00+08:00'),
    updatedAt: new Date('2026-03-28T02:02:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-b72c',
    title: 'Healthy Study Routine Notes',
    passage: 'A balanced study routine should include short brea',
    targetLanguage: 'french',
    createdAt: new Date('2026-03-25T11:05:00+08:00'),
    updatedAt: new Date('2026-03-27T18:15:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-a94d',
    title: 'Florida Rip Current Rescue',
    passage: 'The wife of a man who died saving two of their chi',
    targetLanguage: 'chinese',
    createdAt: new Date('2026-03-29T09:40:00+08:00'),
    updatedAt: new Date('2026-03-30T16:25:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-c83f',
    title: 'Beach Rescue Official Statements',
    passage: 'In a separate statement, Palm Beach County Fire Re',
    targetLanguage: 'german',
    createdAt: new Date('2026-03-31T13:10:00+08:00'),
    updatedAt: new Date('2026-04-01T10:35:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-d91e',
    title: 'Emily Jennings Family Memories',
    passage: '"We spent our days walking the beach, grabbing cof',
    targetLanguage: 'portuguese',
    createdAt: new Date('2026-04-02T08:50:00+08:00'),
    updatedAt: new Date('2026-04-03T19:05:00+08:00'),
  },
]

export default sessionHistoryData
