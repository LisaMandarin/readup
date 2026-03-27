import { Divider } from 'antd'
import { SwapOutlined } from '@ant-design/icons'

import { CollapsiblePanelItem } from './CollapsiblePanel'
import type { TargetLanguage } from './targetLanguages'

type SessionPanelItemProps = {
  hasPassage: boolean
  passagePreview: string
  targetLanguage: TargetLanguage | ''
  username?: string
  email?: string
}

export default function SessionPanelItem(props: SessionPanelItemProps) {
  const { hasPassage, passagePreview, targetLanguage, username, email } = props
  const targetLanguageLabel = targetLanguage
    ? targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)
    : 'Not selected'

  return (
    <div className="space-y-4">
      <CollapsiblePanelItem
        title="Translation Session"
        description="Track the passage currently being prepared for translation."
        className="border-[rgba(24,57,57,0.18)] bg-[linear-gradient(145deg,rgba(15,95,92,0.14),rgba(255,255,255,0.92))]"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-lg text-white">
            <SwapOutlined />
          </div>
          <div className="space-y-1">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Session status
            </p>
            <p className="m-0 text-base font-semibold text-[var(--text-main)]">
              {hasPassage ? 'Passage ready for translation' : 'Waiting for source passage'}
            </p>
            <p className="m-0 text-sm text-slate-600">
              Target language: {targetLanguageLabel}
            </p>
          </div>
        </div>
      </CollapsiblePanelItem>

      <CollapsiblePanelItem
        title="Current Passage"
        description="Preview of the text currently attached to this translation session."
      >
        <p className="m-0 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
          {passagePreview}
        </p>
      </CollapsiblePanelItem>

      <Divider className="my-0 border-[rgba(24,57,57,0.12)]" />

      <p className="m-0 text-center text-sm italic text-slate-500">
        Signed in as {username ?? 'Unknown user'}
        {email ? ` • ${email}` : ''}
      </p>
    </div>
  )
}
