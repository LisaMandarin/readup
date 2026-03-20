import type { ReactNode } from 'react'
import { Button } from 'antd'
import { FolderOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

import type { NavKey } from './mainPageTypes'

type Props = {
  activeKey: NavKey
  onSelect: (key: NavKey) => void
}

function NavIconButton(props: {
  active: boolean
  label: string
  onClick: () => void
  icon: ReactNode
}) {
  const { active, label, onClick, icon } = props
  return (
    <Button
      type="text"
      aria-label={label}
      onClick={onClick}
      className="!w-12 !h-12 flex items-center justify-center !rounded-lg"
      style={{
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#ffffff' : 'var(--text-main)',
      }}
    >
      <span className="text-lg" aria-hidden="true">
        {icon}
      </span>
    </Button>
  )
}

export default function IconBar(props: Props) {
  const { activeKey, onSelect } = props

  const navItems: Array<{ key: NavKey; label: string; icon: ReactNode }> = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { key: 'folder', label: 'Folder', icon: <FolderOutlined /> },
  ]

  return (
    <div className="h-full flex flex-col items-center py-6 gap-5">
      {navItems.map((item) => (
        <NavIconButton
          key={item.key}
          active={activeKey === item.key}
          label={item.label}
          onClick={() => onSelect(item.key)}
          icon={item.icon}
        />
      ))}
    </div>
  )
}

