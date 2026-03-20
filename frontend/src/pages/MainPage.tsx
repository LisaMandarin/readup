import { useEffect, useRef, useState } from 'react'
import { ConfigProvider, Layout, theme } from 'antd'

import IconBar from './IconBar'
import MainDisplay from './MainDisplay'
import type { NavKey } from './mainPageTypes'

const { Footer, Sider } = Layout

export default function MainPage() {
  const [activeKey, setActiveKey] = useState<NavKey>('profile')
  const [displayKey, setDisplayKey] = useState<NavKey>('profile')
  const [panelPhase, setPanelPhase] = useState<'in' | 'out'>('in')
  const transitionTimerRef = useRef<number | null>(null)

  const [healthStatus, setHealthStatus] = useState<string | null>(null)
  const [checkingHealth, setCheckingHealth] = useState(false)

  const {
    token: { colorBgContainer, colorTextSecondary },
  } = theme.useToken()

  const callHealthCheck = async () => {
    try {
      setCheckingHealth(true)
      setHealthStatus(null)

      const response = await fetch('http://127.0.0.1:8000/health')
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data: { status?: string } = await response.json()
      setHealthStatus(data.status ?? 'unknown')
    } catch (error) {
      setHealthStatus('error')
      console.error('Health check failed', error)
    } finally {
      setCheckingHealth(false)
    }
  }

  useEffect(() => {
    if (activeKey === displayKey) return

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }

    setPanelPhase('out')

    transitionTimerRef.current = window.setTimeout(() => {
      setDisplayKey(activeKey)
      requestAnimationFrame(() => setPanelPhase('in'))
    }, 180)

    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current)
        transitionTimerRef.current = null
      }
    }
  }, [activeKey, displayKey])

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        <Sider
          width={92}
          style={{
            background: 'var(--card-bg)',
            borderRight: '1px solid var(--card-border)',
          }}
        >
          <IconBar activeKey={activeKey} onSelect={setActiveKey} />
        </Sider>

        <Layout>
          <MainDisplay
            displayKey={displayKey}
            panelPhase={panelPhase}
            colorBgContainer={colorBgContainer}
            colorTextSecondary={colorTextSecondary}
            callHealthCheck={callHealthCheck}
            checkingHealth={checkingHealth}
            healthStatus={healthStatus}
          />

          <Footer className="text-center text-gray-500">
            CSE499 Team 5 -ReadUp &copy; {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
