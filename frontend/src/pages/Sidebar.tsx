import { useState, type ReactNode } from 'react'
import { Button, Divider, Spin, Tooltip } from 'antd'
import {
  BookOutlined,
  FolderOutlined,
  LogoutOutlined,
  SwapOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import CollapsiblePanel from '../components/CollapsiblePanel'
import { useAuth } from '../context/AuthContext'
import type { MenuKey } from './homeTypes'

type SidebarProps = {
  activeMenu: MenuKey | null
  onMenuSelect: (key: MenuKey) => void
  username?: string
  email?: string
  passage: string
  onSignOutStateChange: (isSigningOut: boolean) => void
  onSignOutError: (message: string | null) => void
}

export default function Sidebar(props: SidebarProps) {
  const {
    activeMenu,
    onMenuSelect,
    username,
    email,
    passage,
    onSignOutStateChange,
    onSignOutError,
  } = props
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const hasPassage = passage.trim().length > 0
  const passagePreview = hasPassage
    ? `${passage.trim().slice(0, 140)}${passage.trim().length > 140 ? '...' : ''}`
    : 'No passage is queued yet. Add text in the workspace to start a translation session.'

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
  ]

  return (
    <aside className="w-full lg:w-auto lg:flex-shrink-0">
      <div className="flex w-full items-stretch gap-4">
        <div className="flex flex-col items-center gap-3 rounded-lg border-4 border-[var(--card-border)] bg-[var(--card-bg)] p-3">
          <nav aria-label="Sidebar menu" className="flex flex-col gap-3">
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
                      'flex h-12 w-12 items-center justify-center rounded-lg text-xl transition-all',
                      isActive
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm'
                        : 'border-[var(--card-border)] bg-white text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                    ].join(' ')}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                  </button>
                </Tooltip>
              )
            })}
          </nav>

          <Tooltip title="Sign out" placement="right">
            <button
              type="button"
              onClick={() => onMenuSelect('signout')}
              aria-label="Sign out"
              aria-pressed={activeMenu === 'signout'}
              className={[
                'flex h-12 w-12 items-center justify-center rounded-lg text-xl transition-all',
                activeMenu === 'signout'
                  ? 'border border-red-600 bg-red-600 text-white shadow-sm'
                  : 'border border-[var(--card-border)] bg-white text-red-600 hover:border-red-600 hover:bg-red-50',
              ].join(' ')}
            >
              <span aria-hidden="true">
                <LogoutOutlined />
              </span>
            </button>
          </Tooltip>
        </div>

        <CollapsiblePanel isOpen={activeMenu !== null}>
          <div className={activeMenu === null ? 'hidden' : 'block'}>
            {activeMenu === 'profile' && (
              <>
                <h3 className="m-0 text-lg font-semibold">Profile</h3>
                <p className="mt-2 mb-1 text-sm">
                  <span className="font-medium">Username:</span>{' '}
                  {username ?? 'Unknown user'}
                </p>
                <p className="m-0 text-sm text-gray-600">{email}</p>
              </>
            )}

            {activeMenu === 'settings' && (
              <>
                <h3 className="m-0 text-lg font-semibold">Settings</h3>
                <p className="mt-2 mb-0 text-sm text-gray-600">
                  Settings content can be added here when that page is ready.
                </p>
              </>
            )}

            {activeMenu === 'session' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[rgba(24,57,57,0.18)] bg-[linear-gradient(145deg,rgba(15,95,92,0.14),rgba(255,255,255,0.92))] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-lg text-white">
                      <SwapOutlined />
                    </div>
                    <div>
                      <h3 className="m-0 text-lg font-semibold text-[var(--text-main)]">
                        Translation Session
                      </h3>
                      <p className="mt-1 mb-0 text-sm text-slate-600">
                        Track the passage currently being prepared for translation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[rgba(24,57,57,0.18)] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Session status
                  </p>
                  <p className="mt-3 mb-1 text-base font-semibold text-[var(--text-main)]">
                    {hasPassage ? 'Passage ready for translation' : 'Waiting for source passage'}
                  </p>
                  <p className="m-0 text-sm text-slate-600">
                    Target language selection is not configured yet in this view.
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(24,57,57,0.18)] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Current passage
                  </p>
                  <p className="mt-3 mb-0 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {passagePreview}
                  </p>
                </div>

                <Divider className="my-0 border-[rgba(24,57,57,0.12)]" />

                <p className="m-0 text-center text-sm italic text-slate-500">
                  Signed in as {username ?? 'Unknown user'}
                  {email ? ` • ${email}` : ''}
                </p>
              </div>
            )}

            {activeMenu === 'signout' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[rgba(127,29,29,0.18)] bg-[linear-gradient(145deg,rgba(220,38,38,0.10),rgba(255,255,255,0.94))] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-lg text-white">
                      <BookOutlined />
                    </div>
                    <div>
                      <h3 className="m-0 text-lg font-semibold text-[var(--text-main)]">
                        Sign Out
                      </h3>
                      <p className="mt-1 mb-0 text-sm text-slate-600">
                        Confirm this session before leaving Read Up.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[rgba(127,29,29,0.18)] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Signed in as
                  </p>
                  <p className="mt-3 mb-1 text-base font-semibold text-[var(--text-main)]">
                    {username ?? 'Unknown user'}
                  </p>
                  <p className="m-0 text-sm text-slate-600">{email}</p>
                </div>

                {isSigningOut ? (
                  <div className="rounded-xl border border-[rgba(127,29,29,0.18)] bg-white/70 px-4 py-6 text-center shadow-sm">
                    <Spin size="large" />
                    <p className="mt-4 mb-0 text-sm text-slate-600">
                      Signing you out...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      type="primary"
                      danger
                      size="large"
                      icon={<LogoutOutlined />}
                      onClick={handleConfirmSignOut}
                      block
                    >
                      Yes, Sign Me Out
                    </Button>
                    <Button
                      size="large"
                      onClick={() => onMenuSelect('signout')}
                      block
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <Divider className="my-0 border-[rgba(127,29,29,0.12)]" />

                <p className="m-0 text-center text-sm italic text-slate-500">
                  Keep your progress safe by signing out before leaving a shared
                  device.
                </p>
              </div>
            )}
          </div>
        </CollapsiblePanel>
      </div>
    </aside>
  )
}
