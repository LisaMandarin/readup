import { UpOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, ConfigProvider, Spin } from 'antd'
import { getTranslationSessionById } from '../api/session'
import { translateText } from '../api/translate'
import type { LookupResult } from '../components/translationLookup'
import { useAuth } from '../context/AuthContext'
import type { TargetLanguage } from '../components/targetLanguages'
import type { TranslationRecord } from '../types/translation'
import MainContent from './MainContent'
import Sidebar from './Sidebar'
import type { MenuKey } from './homeTypes'

export default function Home() {
  const { user } = useAuth()
  const [passage, setPassage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage | ''>('')
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const [translations, setTranslations] = useState<TranslationRecord[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false)
  const [lookupResults, setLookupResults] = useState<LookupResult[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setIsBackToTopVisible(window.scrollY > 240)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleMenuSelect = (key: MenuKey) => {
    setActiveMenu((currentKey) => (currentKey === key ? null : key))
  }

  const handleTranslate = async () => {
    if (passage.trim().length === 0 || !targetLanguage) {
      return
    }

    setIsTranslating(true)
    setTranslateError(null)

    try {
      const { data } = await translateText({
        passage: passage.trim(),
        targetLanguage,
      })
      setTranslations(data.translations)
      setLookupResults([])
    } catch (error) {
      setTranslations([])
      setLookupResults([])

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        setTranslateError(
          typeof detail === 'string'
            ? detail
            : 'Translation failed. Please try again.'
        )
      } else {
        setTranslateError('Translation failed. Please try again.')
      }
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSessionSelect = async (sessionID: string) => {
    setTranslateError(null)
    setIsLoadingSession(true)

    try {
      const { data } = await getTranslationSessionById(sessionID)
      setPassage(data.fullPassage)
      setTargetLanguage(data.targetLanguage)
      setTranslations(data.translations)
      setLookupResults(data.lookupResults)
    } catch (error) {
      setTranslations([])
      setLookupResults([])
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail
        setTranslateError(
          typeof detail === 'string'
            ? detail
            : 'Could not load the selected session.'
        )
      } else {
        setTranslateError('Could not load the selected session.')
      }
    } finally {
      setIsLoadingSession(false)
    }
  }

  const handlePassageChange = (value: string) => {
    setPassage(value)
    setTranslations([])
    setLookupResults([])
    setTranslateError(null)
  }

  const handleClear = () => {
    setPassage('')
    setTranslations([])
    setLookupResults([])
    setTranslateError(null)
  }

  const handleTargetLanguageChange = (value: TargetLanguage | '') => {
    setTargetLanguage(value)
    setTranslations([])
    setLookupResults([])
    setTranslateError(null)
  }

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <ConfigProvider>
      <div className="relative min-h-screen">
        <div
          className={[
            'flex min-h-screen flex-col justify-between px-6 py-6 transition-opacity duration-200',
            isSigningOut || isLoadingSession ? 'opacity-50' : 'opacity-100',
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
              lookupResults={lookupResults}
              isTranslating={isTranslating}
              translateError={translateError}
            />
          </div>

          <footer className="px-6 py-4 text-center text-gray-500">
            CSE499 Team 5 - ReadUp &copy; {new Date().getFullYear()}
          </footer>
        </div>

        {(isSigningOut || isLoadingSession) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(243,250,250,0.5)] backdrop-blur-[1px]">
            <div className="rounded-2xl border border-[rgba(127,29,29,0.18)] bg-white/90 px-8 py-6 text-center shadow-lg">
              <Spin size="large" />
              <p className="mt-4 mb-0 text-sm font-medium text-[var(--text-main)]">
                {isSigningOut ? 'Signing you out...' : 'Loading session...'}
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
