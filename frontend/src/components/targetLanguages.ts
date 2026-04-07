export type TargetLanguage =
  | 'spanish'
  | 'french'
  | 'chinese'
  | 'german'
  | 'portuguese'
  | 'japanese'

export const targetLanguageOptions: Array<{
  value: TargetLanguage
  label: string
}> = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'german', label: 'German' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'japanese', label: 'Japanese' },
]

export function getTargetLanguageLabel(value: string): string {
  const match = targetLanguageOptions.find((item) => item.value === value)
  return match?.label ?? value
}