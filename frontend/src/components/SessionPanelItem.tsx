import { format, formatDistanceToNowStrict, isToday } from 'date-fns'
import targetLanguageNames from './targetLanguageNames.json'

import { CollapsiblePanelItem } from './CollapsiblePanel'
import sessionHistoryData from './sessionHistoryData'

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

function formatSessionUpdatedAt(updatedAt: Date) {
  const minutesSinceUpdate = Math.floor((Date.now() - updatedAt.getTime()) / 60000)

  if (isToday(updatedAt) && minutesSinceUpdate >= 0 && minutesSinceUpdate < 60) {
    return formatDistanceToNowStrict(updatedAt, { addSuffix: true })
  }

  if (isToday(updatedAt)) {
    return format(updatedAt, 'p')
  }

  return format(updatedAt, 'MMM d, yyyy p')
}

export default function SessionPanelItem() {
  const sessions = [...sessionHistoryData].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  )

  return (
    <CollapsiblePanelItem
      title="Session History"
      description="Your previous work is tracked here. Click a session to continue working."
      className="border-[rgba(24,57,57,0.18)]"
    >
      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[rgba(24,57,57,0.18)] bg-[rgba(24,57,57,0.04)] px-4 py-6 text-center">
          <p className="m-0 text-sm font-medium text-[var(--text-main)]">
            No sessions have been retrieved yet.
          </p>
          <p className="mt-2 mb-0 text-sm text-slate-600">
            Start a translation to create your first session.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <button
              key={session.sessionID}
              type="button"
              className="block w-full rounded-xl border border-[rgba(24,57,57,0.16)] bg-[rgba(24,57,57,0.04)] px-4 py-4 text-left transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[rgba(15,95,92,0.08)]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="m-0 text-base font-semibold text-[var(--text-main)]">
                    {truncateText(session.title, 15)}
                  </p>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                    {
                      targetLanguageNames[session.targetLanguage]
                        .targetLanguageName
                    }
                  </span>
                </div>

                <p className="m-0 text-sm leading-6 text-slate-600">
                  {truncateText(session.passage, 100)}
                </p>

                <p className="m-0 text-xs text-slate-500">
                  {formatSessionUpdatedAt(session.updatedAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </CollapsiblePanelItem>
  )
}
