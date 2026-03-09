import { useState } from 'react'
import { Button, ConfigProvider, Layout, Menu, theme } from 'antd'

const { Header, Content, Footer } = Layout

function App() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null)
  const [checkingHealth, setCheckingHealth] = useState(false)

  const {
    token: { colorBgContainer },
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
      // eslint-disable-next-line no-console
      console.error('Health check failed', error)
    } finally {
      setCheckingHealth(false)
    }
  }

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        <Header className="flex items-center">
          <div className="text-white text-xl font-semibold mr-8">
            ReadUp
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={[{ key: 'home', label: 'Home' }]}
          />
        </Header>
        <Content className="p-6">
          <div
            className="max-w-3xl mx-auto rounded-lg p-8 shadow-sm"
            style={{ background: colorBgContainer }}
          >
            <h1 className="text-3xl font-bold mb-4">
              React + Tailwind CSS + Ant Design
            </h1>
            <p className="text-gray-600 mb-6">
              This page is already set up with Tailwind utility classes and
              Ant Design components, so you can start building your frontend UI here.
            </p>
            <div className="flex items-center gap-4">
              <Button
                onClick={callHealthCheck}
                loading={checkingHealth}
                type="primary" size='large'
              >
                Call Backend Health Check
              </Button>
              {healthStatus && (
                <span className="text-sm text-gray-600">
                  Backend status: {healthStatus}
                </span>
              )}
            </div>
          </div>
        </Content>
        <Footer className="text-center text-gray-500">
          ReadUp © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default App
