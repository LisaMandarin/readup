import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfigProvider, Button, Alert, Card, Space, Tag, Typography } from 'antd'
import { LogoutOutlined, ApiOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { databaseHealthCheckRequest, type HealthResponse } from '../api/auth'
import Passage from './Passage'

const { Paragraph, Text } = Typography

type ConnectionState = 'idle' | 'checking' | 'connected' | 'failed'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [passage, setPassage] = useState('')
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const [connectionDetails, setConnectionDetails] = useState<HealthResponse | null>(null)
  const [connectionError, setConnectionError] = useState('')

  const checkBackendConnection = async () => {
    setConnectionState('checking')
    setConnectionError('')

    try {
      const { data } = await databaseHealthCheckRequest()
      setConnectionDetails(data)
      setConnectionState('connected')
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { detail?: string } }; message?: string }
      setConnectionDetails(null)
      setConnectionState('failed')
      setConnectionError(
        apiError.response?.data?.detail ||
          apiError.message ||
          'Could not reach the backend API.'
      )
    }
  }

  useEffect(() => {
    void checkBackendConnection()
  }, [])

  const handleSignOut = () => {
    navigate('/signout')
  }

  const statusTag = () => {
    if (connectionState === 'checking') {
      return (
        <Tag color="processing" icon={<SyncOutlined spin />}>
          Checking API
        </Tag>
      )
    }

    if (connectionState === 'connected') {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          API Connected
        </Tag>
      )
    }

    if (connectionState === 'failed') {
      return <Tag color="error">API Unreachable</Tag>
    }

    return <Tag>Not Checked</Tag>
  }

  return (
    <ConfigProvider>
      <div className="flex flex-col px-6 py-6 min-h-screen justify-between">
        <div className="border-4 border-[var(--card-border)] rounded-lg p-4">

          {/* Welcome message + Sign Out */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="m-0 text-sm">
                Welcome, {user?.username}
              </p>
              <p className="m-0 text-sm text-gray-600">
                {user?.email}
              </p>
            </div>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleSignOut}
              size="small"
              danger
            >
              Sign Out
            </Button>
          </div>

          {/* Application introduction */}
          <h1 className="text-4xl font-extrabold text-center m-4">
            Read Up
          </h1>
          <p className="text-center">
            Turn any text into an interactive learning experience — translate,
            explore vocabulary, and truly understand what you read.
          </p>

          <Card className="mb-6 mt-6" size="small">
            <Space direction="vertical" size="small" className="w-full">
              <div className="flex items-center justify-between gap-4">
                <Space size="small">
                  <ApiOutlined />
                  <Text strong>Backend API status</Text>
                </Space>
                {statusTag()}
              </div>

              <Paragraph className="m-0 text-gray-600">
                This checks whether the frontend can reach the FastAPI backend and whether the backend can reach the database.
              </Paragraph>

              {connectionState === 'connected' && connectionDetails ? (
                <Alert
                  type="success"
                  showIcon
                  message="Frontend, backend, and database are connected"
                  description={`Health status: ${connectionDetails.status}; database: ${connectionDetails.database ?? 'unknown'}`}
                />
              ) : null}

              {connectionState === 'failed' ? (
                <Alert
                  type="error"
                  showIcon
                  message="Could not reach the backend API"
                  description={connectionError}
                />
              ) : null}

              <div>
                <Button onClick={() => void checkBackendConnection()} loading={connectionState === 'checking'}>
                  Check API Connection
                </Button>
              </div>
            </Space>
          </Card>

          <Passage
            passage={passage}
            onPassageChange={setPassage}
            onClear={() => setPassage('')}
          />

        </div>

        <footer className="px-6 py-4 text-center text-gray-500">
          CSE499 Team 5 - ReadUp &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </ConfigProvider>
  )
}