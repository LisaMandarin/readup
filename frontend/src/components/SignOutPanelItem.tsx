import { Button, Spin } from 'antd'
import { LogoutOutlined, SaveOutlined } from '@ant-design/icons'

import { CollapsiblePanelItem } from './CollapsiblePanel'

type SignOutPanelItemProps = {
  isSigningOut: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function SignOutPanelItem(props: SignOutPanelItemProps) {
  const { isSigningOut, onConfirm, onCancel } = props

  const handleSaveClick = () => {
    window.alert('Save button clicked')
  }

  return (
    <div className="space-y-4">
      <CollapsiblePanelItem
        title="Sign Out"
        description="Save your progress before signing out."
        className="border-[rgba(127,29,29,0.18)]"
      >
        <div className="space-y-4">
          {isSigningOut ? (
            <div className="rounded-xl border border-[rgba(127,29,29,0.18)] bg-white/70 px-4 py-6 text-center shadow-sm">
              <Spin size="large" />
              <p className="mt-4 mb-0 text-sm text-slate-600">Signing you out...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                onClick={handleSaveClick}
                block
              >
                Save
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                icon={<LogoutOutlined />}
                onClick={onConfirm}
                block
              >
                Sign Out
              </Button>
              <Button size="large" onClick={onCancel} block>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CollapsiblePanelItem>
    </div>
  )
}
