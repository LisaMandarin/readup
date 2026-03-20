import { Button, Card, Layout } from 'antd'
import type { ReactNode } from 'react'

import type { NavKey } from './mainPageTypes'

const { Content } = Layout

type Props = {
  displayKey: NavKey
  panelPhase: 'in' | 'out'
  colorBgContainer: string
  colorTextSecondary: string
  callHealthCheck: () => void
  checkingHealth: boolean
  healthStatus: string | null
}

function PanelText(props: { children: ReactNode; color: string }) {
  return (
    <p className="text-gray-600" style={{ color: props.color }}>
      {props.children}
    </p>
  )
}

export default function MainDisplay(props: Props) {
  const {
    displayKey,
    panelPhase,
    colorBgContainer,
    colorTextSecondary,
    callHealthCheck,
    checkingHealth,
    healthStatus,
  } = props

  return (
    <Content className="p-6">
      <Card
        style={{
          background: colorBgContainer,
          borderRadius: 12,
          borderColor: 'var(--card-border)',
          borderWidth: 1,
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div
          aria-live="polite"
          className={[
            'overflow-hidden transform-gpu transition-[max-height,opacity,transform] duration-200 ease-in-out',
            panelPhase === 'out'
              ? 'max-h-0 opacity-0 translate-x-4 scale-y-[0.98]'
              : 'max-h-[1000px] opacity-100 translate-x-0 scale-y-100',
          ].join(' ')}
        >
          <div key={displayKey}>
            {displayKey === 'profile' && (
              <>
                <h1 className="text-3xl font-bold mb-4">ReadUp Dashboard</h1>
                <PanelText color={colorTextSecondary}>
                  Use the left icon bar to switch between Profile, Settings,
                  and Folder.
                </PanelText>

                <div className="flex items-center gap-4 mt-6">
                  <Button
                    onClick={callHealthCheck}
                    loading={checkingHealth}
                    type="primary"
                    size="large"
                  >
                    Call Backend Health Check
                  </Button>
                  {healthStatus && (
                    <span className="text-sm" style={{ color: colorTextSecondary }}>
                      Backend status: {healthStatus}
                    </span>
                  )}
                </div>
              </>
            )}

            {displayKey === 'settings' && (
              <>
                <h1 className="text-3xl font-bold mb-4">Settings</h1>
                <PanelText color={colorTextSecondary}>
                  This is where your settings UI will live.
                </PanelText>
              </>
            )}

            {displayKey === 'folder' && (
              <>
                <h1 className="text-3xl font-bold mb-4">Folder</h1>
                <PanelText color={colorTextSecondary}>
                  This is where folders/files can be displayed.
                </PanelText>
              </>
            )}
          </div>
        </div>
      </Card>
    </Content>
  )
}

