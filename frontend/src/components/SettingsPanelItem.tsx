import { Select } from 'antd'

import { CollapsiblePanelItem } from './CollapsiblePanel'
import targetLanguageNames from '../data/targetLanguageNames.json'
import {
  targetLanguageOptions,
  type TargetLanguage,
} from './targetLanguages'

type SettingsPanelItemProps = {
  targetLanguage: TargetLanguage | ''
  onTargetLanguageChange: (value: TargetLanguage | '') => void
}

export default function SettingsPanelItem(props: SettingsPanelItemProps) {
  const { targetLanguage, onTargetLanguageChange } = props

  const selectedLanguageLabel =
    (targetLanguage ? targetLanguageNames[targetLanguage].targetLanguageName : undefined) ??
    'Not selected'

  return (
    <CollapsiblePanelItem
      title="Settings"
      description="Configure translation preferences for the current workspace."
    >
      <div className="space-y-3">
        <label
          htmlFor="target-language-select"
          className="block text-sm font-medium text-[var(--text-main)]"
        >
          Target language
        </label>

        <Select
          id="target-language-select"
          value={targetLanguage}
          options={targetLanguageOptions}
          onChange={(value) => onTargetLanguageChange(value ?? '')}
          className="w-full"
          size="large"
          placeholder="Select a target language"
          allowClear
        />

        <p className="m-0 text-sm text-slate-600">
          Current selection: <span className="font-medium">{selectedLanguageLabel}</span>
        </p>
      </div>
    </CollapsiblePanelItem>
  )
}
