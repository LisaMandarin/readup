// Home.tsx

import { UpOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Alert, ConfigProvider, Spin, message } from 'antd'

import { useAuth }              from '../context/AuthContext'
import {
  translateRequest,
  getSessionDetailRequest,
} from '../api/auth'
import { adaptApiResponse }     from '../utils/adaptTranslation'
import type { TranslationRecord } from '../data/translationData'
import type { TargetLanguage }  from '../components/targetLanguages'
import MainContent              from './MainContent'
import Sidebar                  from './Sidebar'
import type { MenuKey }         from './homeTypes'

export default function Home() {
  const { user } = useAuth()

  const [passage, setPassage]               = useState('')
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage | ''>('')
  const [activeMenu, setActiveMenu]         = useState<MenuKey | null>(null)
  const [isSigningOut, setIsSigningOut]     = useState(false)
  const [signOutError, setSignOutError]     = useState<string | null>(null)
  const [translations, setTranslations]     = useState<TranslationRecord[]>([])
  const [isTranslating, setIsTranslating]   = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsBackToTopVisible(window.scrollY > 240)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuSelect = (key: MenuKey) => {
    setActiveMenu((current) => (current === key ? null : key))
  }

  // ── Translate button ───────────────────────────────────────────────────
const handleTranslate = async () => {
  if (!passage.trim() || !targetLanguage) return

  setIsTranslating(true)
  setTranslateError(null)

  try {
    const { data } = await translateRequest({
      passage,
      targetLanguage,
    })

    console.log('✅ API response:', data)          // ← add this

    const records = adaptApiResponse(data, targetLanguage, passage)

    console.log('✅ Adapted records:', records)    // ← add this

    setTranslations(records)
  } catch (err: unknown) {
    console.error('❌ Full error:', err)           // ← add this

    const detail =
      (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? 'Translation failed. Please try again.'

    setTranslateError(detail)
    setTranslations([])
  } finally {
    setIsTranslating(false)
  }
}

  // ── Session history click ──────────────────────────────────────────────
  const handleSessionSelect = async (sessionID: string) => {
    try {
      const { data } = await getSessionDetailRequest(sessionID)

      const lang = data.targetLanguage as TargetLanguage
      const records = adaptApiResponse(
        { sessionID: data.sessionID, translations: data.translations },
        lang,
        '',
      )

      setPassage('')
      setTargetLanguage(lang)
      setTranslations(records)
    } catch {
      message.error('Could not load session. Please try again.')
    }
  }

  const handlePassageChange = (value: string) => {
    setPassage(value)
    setTranslations([])
    setTranslateError(null)
  }

  const handleClear = () => {
    setPassage('')
    setTranslations([])
    setTranslateError(null)
  }

  const handleTargetLanguageChange = (value: TargetLanguage | '') => {
    setTargetLanguage(value)
    setTranslations([])
    setTranslateError(null)
  }

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <ConfigProvider>
      <div className="relative min-h-screen">
        <div
          className={[
            'flex min-h-screen flex-col justify-between px-6 py-6 transition-opacity duration-200',
            isSigningOut ? 'opacity-50' : 'opacity-100',
          ].join(' ')}
        >
          {/* Sign-out error */}
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

          {/* Translation error */}
          {translateError && (
            <div className="mb-4">
              <Alert
                type="error"
                showIcon
                message="Translation failed"
                description={translateError}
                closable
                onClose={() => setTranslateError(null)}
              />
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:flex-none lg:flex-row">
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
              isTranslating={isTranslating}   // ← pass loading state down
            />
          </div>

          <footer className="px-6 py-4 text-center text-gray-500">
            CSE499 Team 5 - ReadUp &copy; {new Date().getFullYear()}
          </footer>
        </div>

        {/* Sign-out overlay */}
        {isSigningOut && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(243,250,250,0.5)] backdrop-blur-[1px]">
            <div className="rounded-2xl border border-[rgba(127,29,29,0.18)] bg-white/90 px-8 py-6 text-center shadow-lg">
              <Spin size="large" />
              <p className="mt-4 mb-0 text-sm font-medium text-[var(--text-main)]">
                Signing you out...
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          aria-label="Back to top"
          onClick={handleBackToTop}
          className={[
            'fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--accent)] text-lg text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:brightness-95',
            isBackToTopVisible
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-3 opacity-0',
          ].join(' ')}
        >
          <UpOutlined />
        </button>
      </div>
    </ConfigProvider>
  )
}