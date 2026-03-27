import { Button, Spin } from 'antd'
import { BookOutlined, LogoutOutlined } from '@ant-design/icons'

import { CollapsiblePanelItem } from './CollapsiblePanel'

type SignOutPanelItemProps = {
  username?: string
  email?: string
  isSigningOut: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function SignOutPanelItem(props: SignOutPanelItemProps) {
  const { username, email, isSigningOut, onConfirm, onCancel } = props

  return (
    <div className="space-y-4">
      <CollapsiblePanelItem
        title="Sign Out"
        description="Confirm this session before leaving Read Up."
        className="border-[rgba(127,29,29,0.18)] bg-[linear-gradient(145deg,rgba(220,38,38,0.10),rgba(255,255,255,0.94))]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-lg text-white">
            <BookOutlined />
          </div>
          <div className="text-sm text-slate-600">
            Keep your progress safe by signing out before leaving a shared device.
          </div>
        </div>
      </CollapsiblePanelItem>

      <CollapsiblePanelItem
        title="Signed In Account"
        description="This is the account that will be signed out from the current device."
        className="border-[rgba(127,29,29,0.18)]"
      >
        <div className="space-y-1">
          <p className="m-0 text-base font-semibold text-[var(--text-main)]">
            {username ?? 'Unknown user'}
          </p>
          <p className="m-0 text-sm text-slate-600">{email}</p>
        </div>
      </CollapsiblePanelItem>

      {isSigningOut ? (
        <div className="rounded-xl border border-[rgba(127,29,29,0.18)] bg-white/70 px-4 py-6 text-center shadow-sm">
          <Spin size="large" />
          <p className="mt-4 mb-0 text-sm text-slate-600">Signing you out...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            type="primary"
            danger
            size="large"
            icon={<LogoutOutlined />}
            onClick={onConfirm}
            block
          >
            Yes, Sign Me Out
          </Button>
          <Button size="large" onClick={onCancel} block>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
