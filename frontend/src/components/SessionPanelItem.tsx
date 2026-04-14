import axios from 'axios'
import { format, formatDistanceToNowStrict, isToday, isValid } from 'date-fns'
import { useEffect, useState } from 'react'
import targetLanguageNames from '../data/targetLanguageNames.json'
import { getTranslationSessions, type TranslationSessionSummary } from '../api/session'

import { CollapsiblePanelItem } from './CollapsiblePanel'

type SessionPanelItemProps = {
  onSessionSelect: (sessionID: string) => void
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

function toValidDate(value: Date | string) {
  const normalizedDate = value instanceof Date ? value : new Date(value)

  return isValid(normalizedDate) ? normalizedDate : null
}

function formatSessionUpdatedAt(updatedAt: Date | string) {
  const normalizedDate = toValidDate(updatedAt)

  if (!normalizedDate) {
    return 'Unknown update time'
  }

  const minutesSinceUpdate = Math.floor((Date.now() - normalizedDate.getTime()) / 60000)

  if (isToday(normalizedDate) && minutesSinceUpdate >= 0 && minutesSinceUpdate < 60) {
    return formatDistanceToNowStrict(normalizedDate, { addSuffix: true })
  }

  if (isToday(normalizedDate)) {
    return format(normalizedDate, 'p')
  }

  return format(normalizedDate, 'MMM d, yyyy p')
}

export default function SessionPanelItem(props: SessionPanelItemProps) {
  const { onSessionSelect } = props
  const [sessions, setSessions] = useState<TranslationSessionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data } = await getTranslationSessions()
        setSessions(data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const detail = error.response?.data?.detail
          setError(
            typeof detail === 'string'
              ? detail
              : 'Could not load your session history.'
          )
        } else {
          setError('Could not load your session history.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadSessions()
  }, [])

  const sortedSessions = [...sessions].sort(
    (left, right) =>
      (toValidDate(right.updatedAt)?.getTime() ?? 0) -
      (toValidDate(left.updatedAt)?.getTime() ?? 0)
  )

  return (
    <CollapsiblePanelItem
      title="Session History"
      description="Your previous work is tracked here. Click a session to continue working."
      className="overflow-hidden border-[rgba(24,57,57,0.18)]"
    >
      {isLoading ? (
        <div className="rounded-xl border border-dashed border-[rgba(24,57,57,0.18)] bg-[rgba(24,57,57,0.04)] px-4 py-6 text-center">
          <p className="m-0 text-sm font-medium text-[var(--text-main)]">
            Loading sessions...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-[rgba(127,29,29,0.18)] bg-[rgba(127,29,29,0.04)] px-4 py-6 text-center">
          <p className="m-0 text-sm font-medium text-[var(--text-main)]">
            Could not load sessions.
          </p>
          <p className="mt-2 mb-0 text-sm text-slate-600">
            {error}
          </p>
        </div>
      ) : sortedSessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[rgba(24,57,57,0.18)] bg-[rgba(24,57,57,0.04)] px-4 py-6 text-center">
          <p className="m-0 text-sm font-medium text-[var(--text-main)]">
            No sessions have been retrieved yet.
          </p>
          <p className="mt-2 mb-0 text-sm text-slate-600">
            Start a translation to create your first session.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {sortedSessions.map((session) => (
            <button
              key={session.sessionID}
              type="button"
              onClick={() => onSessionSelect(session.sessionID)}
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
                  {truncateText(session.passagePreview, 50)}
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
