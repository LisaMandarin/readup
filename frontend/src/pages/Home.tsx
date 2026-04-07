import { useState } from 'react'
import { Alert, ConfigProvider, Spin, message } from 'antd'
import { useAuth } from '../context/AuthContext'
import type { TargetLanguage } from '../components/targetLanguages'
import MainContent, { type TranslationRecord } from './MainContent'
import Sidebar from './Sidebar'
import type { MenuKey } from './homeTypes'
import { translateText } from '../api/translate'
import { getSessionById } from '../api/session'

export default function Home() {
  const { user } = useAuth()

  const [passage, setPassage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage | ''>('')
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const [translations, setTranslations] = useState<TranslationRecord[]>([])
  const [isTranslating, setIsTranslating] = useState(false)

  const isValidTargetLanguage = (
    value: TargetLanguage | ''
  ): value is TargetLanguage => {
    return value !== ''
  }

  const handleMenuSelect = (key: MenuKey | null) => {
  setActiveMenu(key)
}

  const handleTranslate = async () => {
    if (passage.trim().length === 0) {
      message.warning('Please enter a passage.')
      return
    }

    if (!isValidTargetLanguage(targetLanguage)) {
      message.warning('Please select a target language.')
      return
    }

    try {
      setIsTranslating(true)

      const { data } = await translateText({
        passage,
        targetLanguage,
      })

      setTranslations(data.translations)
      message.success('Translation completed successfully.')
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { detail?: string } }
      }

      console.error('Translation failed:', err.response?.data || error)

      const detail = err.response?.data?.detail
      message.error(
        typeof detail === 'string' ? detail : 'Translation failed.'
      )
      setTranslations([])
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSessionSelect = async (sessionID: string) => {
    try {
      const { data } = await getSessionById(sessionID)

      setPassage(data.session.fullPassage)
      setTargetLanguage(data.session.targetLanguage as TargetLanguage)
      setTranslations(data.translations)
    } catch (error) {
      console.error('Failed to load session:', error)
      message.error('Failed to load session.')
      setTranslations([])
    }
  }

  const handlePassageChange = (value: string) => {
    setPassage(value)
    setTranslations([])
  }

  const handleClear = () => {
    setPassage('')
    setTranslations([])
  }

  const handleTargetLanguageChange = (value: TargetLanguage | '') => {
    setTargetLanguage(value)
    setTranslations([])
  }

  return (
    <ConfigProvider>
      <div className="relative min-h-screen">
        <div
          className={[
            'flex min-h-screen flex-col px-6 py-6 transition-opacity duration-200',
            isSigningOut ? 'opacity-50' : 'opacity-100',
          ].join(' ')}
        >
          {signOutError && (
            <div className="mb-4">
              <Alert
                type="error"
                showIcon
                message="Sign out failed"
                description={signOutError}
                closable
                onClose={() => setSignOutError(null)}
              />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-6 lg:flex-row">
            <Sidebar
              activeMenu={activeMenu}
              onMenuSelect={handleMenuSelect}
              username={user?.username}
              email={user?.email}
              passage={passage}
              targetLanguage={targetLanguage}
              onTargetLanguageChange={handleTargetLanguageChange}
              onSessionSelect={handleSessionSelect}
              onSignOutStateChange={setIsSigningOut}
              onSignOutError={setSignOutError}
            />

            <MainContent
              passage={passage}
              targetLanguage={targetLanguage}
              onPassageChange={handlePassageChange}
              onTranslate={handleTranslate}
              onClear={handleClear}
              translations={translations}
            />
          </div>

          <footer className="px-6 py-4 text-center text-gray-500">
            CSE499 Team 5 - ReadUp &copy; {new Date().getFullYear()}
          </footer>
        </div>

        {(isSigningOut || isTranslating) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(243,250,250,0.5)] backdrop-blur-[1px]">
            <div className="rounded-2xl border border-[rgba(127,29,29,0.18)] bg-white/90 px-8 py-6 text-center shadow-lg">
              <Spin size="large" />
              <p className="mt-4 mb-0 text-sm font-medium text-[var(--text-main)]">
                {isSigningOut ? 'Signing you out...' : 'Translating...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  )
}