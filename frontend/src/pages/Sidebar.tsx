import { useState, type ReactNode } from 'react'
import { Tooltip } from 'antd'
import {
  FolderOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import CollapsiblePanel from '../components/CollapsiblePanel'
import ProfilePanelItem from '../components/ProfilePanelItem'
import SettingsPanelItem from '../components/SettingsPanelItem'
import SessionPanelItem from '../components/SessionPanelItem'
import SignOutPanelItem from '../components/SignOutPanelItem'
import type { TargetLanguage } from '../components/targetLanguages'
import { useAuth } from '../context/AuthContext'
import type { MenuKey } from './homeTypes'

type SidebarProps = {
  activeMenu: MenuKey | null
  onMenuSelect: (key: MenuKey) => void
  username?: string
  email?: string
  passage: string
  targetLanguage: TargetLanguage | ''
  onTargetLanguageChange: (value: TargetLanguage | '') => void
  onSessionSelect: (sessionID: string) => void
  onSignOutStateChange: (isSigningOut: boolean) => void
  onSignOutError: (message: string | null) => void
}

export default function Sidebar(props: SidebarProps) {
  const {
    activeMenu,
    onMenuSelect,
    username,
    email,
    targetLanguage,
    onTargetLanguageChange,
    onSessionSelect,
    onSignOutStateChange,
    onSignOutError,
  } = props
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const handleConfirmSignOut = () => {
    setIsSigningOut(true)
    onSignOutError(null)
    onSignOutStateChange(true)

    try {
      logout()
    } catch (error) {
      setIsSigningOut(false)
      onSignOutStateChange(false)
      onSignOutError(
        error instanceof Error
          ? error.message
          : 'We could not sign you out. Please try again.'
      )
    }
  }

  const menuItems: Array<{
    key: MenuKey
    label: string
    icon: ReactNode
  }> = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { key: 'session', label: 'Session', icon: <FolderOutlined /> },
    { key: 'signout', label: 'Sign out', icon: <LogoutOutlined /> },
  ]

  return (
    <aside className="min-h-0 w-full self-stretch lg:w-auto lg:flex-shrink-0">
      <div className="flex h-full min-h-0 w-full items-stretch">
        <div className="flex h-full min-h-0 w-full flex-col gap-3 rounded-lg border-4 border-[var(--card-border)] bg-[var(--card-bg)] p-3 lg:flex-row lg:items-stretch">
          <nav
            aria-label="Sidebar menu"
            className="flex flex-row gap-3 overflow-x-auto py-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {menuItems.map((item) => {
              const isActive = activeMenu === item.key

              return (
                <Tooltip key={item.key} title={item.label} placement="right">
                  <button
                    type="button"
                    onClick={() => onMenuSelect(item.key)}
                    aria-label={item.label}
                    aria-pressed={isActive}
                    className={[
                      'flex h-12 w-12 items-center justify-center rounded-xl border text-xl transition-all duration-200',
                      isActive
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-md shadow-[rgba(15,95,92,0.22)]'
                        : 'border-[rgba(24,57,57,0.18)] bg-white/90 text-[var(--text-main)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[rgba(15,95,92,0.08)] hover:text-[var(--accent)] hover:shadow-sm',
                    ].join(' ')}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                  </button>
                </Tooltip>
              )
            })}
          </nav>

          <CollapsiblePanel
            isOpen={activeMenu !== null}
            className="border-0 bg-transparent p-0 shadow-none"
          >
            <div className={activeMenu === null ? 'hidden h-full' : 'block h-full min-h-0 max-h-full'}>
              {activeMenu === 'profile' && (
                <ProfilePanelItem username={username} email={email} />
              )}

              {activeMenu === 'settings' && (
                <SettingsPanelItem
                  targetLanguage={targetLanguage}
                  onTargetLanguageChange={onTargetLanguageChange}
                />
              )}

              {activeMenu === 'session' && (
                <SessionPanelItem onSessionSelect={onSessionSelect} />
              )}

              {activeMenu === 'signout' && (
                <SignOutPanelItem
                  isSigningOut={isSigningOut}
                  onConfirm={handleConfirmSignOut}
                  onCancel={() => onMenuSelect('signout')}
                />
              )}
            </div>
          </CollapsiblePanel>
        </div>
      </div>
    </aside>
  )
}