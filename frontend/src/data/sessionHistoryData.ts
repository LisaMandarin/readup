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
    passage:
      `Reading for even a few minutes each day helps improve vocabulary, focus, and long-term comprehension. It also builds a steady habit of reflection and learning.`,
    targetLanguage: 'spanish',
    createdAt: new Date('2026-03-26T14:20:00+08:00'),
    updatedAt: new Date('2026-03-28T02:02:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-b72c',
    title: 'Healthy Study Routine Notes',
    passage:
      `A balanced study routine should include short breaks and clear goals for each session. Enough sleep is also important for memory retention and concentration.`,
    targetLanguage: 'french',
    createdAt: new Date('2026-03-25T11:05:00+08:00'),
    updatedAt: new Date('2026-03-27T18:15:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-a94d',
    title: 'Florida Rip Current Rescue',
    passage:
      `The wife of a man who died saving two of their children from a rip current is remembering her husband one week after the tragic accident. Emily Jennings shared a statement on Wednesday, following her husband Ryan Jennings' death on April 1. Ryan Jennings died while saving his two children, who were struggling in the water off of Juno Beach in Florida, according to a report from the Juno Beach Police Department.`,
    targetLanguage: 'chinese',
    createdAt: new Date('2026-03-29T09:40:00+08:00'),
    updatedAt: new Date('2026-03-30T16:25:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-c83f',
    title: 'Beach Rescue Official Statements',
    passage:
      `In a separate statement, Palm Beach County Fire Rescue said Ocean Rescue lifeguards at the beach the day of the incident "initiated a water rescue" and were able to assist in bringing four individuals to shore, three of whom were transported to a local hospital. The statement noted the group "was not swimming in a guarded area" at the time of the rescue, and that "conditions, including low tide and an onshore (east) wind, were consistent with the potential for rip current activity."`,
    targetLanguage: 'german',
    createdAt: new Date('2026-03-31T13:10:00+08:00'),
    updatedAt: new Date('2026-04-01T10:35:00+08:00'),
  },
  {
    userID: 'user-1042',
    sessionID: 'session-d91e',
    title: 'Emily Jennings Family Memories',
    passage:
      `"We spent our days walking the beach, grabbing coffee downtown, and appreciating the little moments by the fireplace," she wrote. "Three months passed while I looked for apartments -- but what really happened in that time is that we fell madly in love and became a family." Eventually, she said, the couple married and moved to Maine, welcoming two more children into their family and learning recently that they were expecting again. Ryan Jennings' 'greatest love' was his family, Emily Jennings wrote. "He was always so proud of us," she said.`,
    targetLanguage: 'portuguese',
    createdAt: new Date('2026-04-02T08:50:00+08:00'),
    updatedAt: new Date('2026-04-03T19:05:00+08:00'),
  },
]

export default sessionHistoryData
