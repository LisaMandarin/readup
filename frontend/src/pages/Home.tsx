import { useState } from 'react'
import { Alert, ConfigProvider, Spin } from 'antd'
import { useAuth } from '../context/AuthContext'
import MainContent from './MainContent'
import Sidebar from './Sidebar'
import type { MenuKey } from './homeTypes'

export default function Home() {
  const { user } = useAuth()
  const [passage, setPassage] = useState('')
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const handleMenuSelect = (key: MenuKey) => {
    setActiveMenu((currentKey) => (currentKey === key ? null : key))
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
              onSignOutStateChange={setIsSigningOut}
              onSignOutError={setSignOutError}
            />

            <MainContent
              username={user?.username}
              email={user?.email}
              passage={passage}
              onPassageChange={setPassage}
              onClear={() => setPassage('')}
            />
          </div>

          <footer className="px-6 py-4 text-center text-gray-500">
            CSE499 Team 5 - ReadUp &copy; {new Date().getFullYear()}
          </footer>
        </div>

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
      </div>
    </ConfigProvider>
  )
}
