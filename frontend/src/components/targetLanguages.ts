import targetLanguageNames from '../data/targetLanguageNames.json'

export type TargetLanguage = keyof typeof targetLanguageNames

export const targetLanguageOptions = (
  Object.entries(targetLanguageNames) as Array<
    [TargetLanguage, (typeof targetLanguageNames)[TargetLanguage]]
  >
).map(([value, content]) => ({
  label: content.targetLanguageName,
  value,
}))