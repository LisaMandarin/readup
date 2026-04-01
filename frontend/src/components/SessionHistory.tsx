import { useEffect, useState } from 'react'
import { Card, List, Typography, Empty, Spin, Button, message } from 'antd'
import { HistoryOutlined, ReloadOutlined } from '@ant-design/icons'
import { getUserSessions, type SessionResponse } from '../api/sessions'

const { Title, Text } = Typography

interface Props {
  onSessionSelect?: (session: SessionResponse) => void
  selectedSessionId?: number | null
}

export default function SessionHistory({ onSessionSelect, selectedSessionId }: Props) {
  const [sessions, setSessions] = useState<SessionResponse[]>([])
  const [loading, setLoading] = useState(true)

  const loadSessions = async () => {
    try {
      setLoading(true)
      const { data } = await getUserSessions()
      setSessions(data)
    } catch (error) {
      console.error('Error loading sessions:', error)
      message.error('Failed to load session history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSessions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <Card
      className="h-full"
      size="small"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HistoryOutlined />
            <Title level={5} className="m-0">
              Session History
            </Title>
          </div>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => void loadSessions()}
            loading={loading}
          />
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : sessions.length === 0 ? (
        <Empty
          className="py-8"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text type="secondary">No previous sessions</Text>
              <br />
              <Text type="secondary" className="text-xs">
                Start by entering a passage to translate
              </Text>
            </div>
          }
        />
      ) : (
        <List
          className="max-h-96 overflow-y-auto"
          dataSource={sessions}
          size="small"
          renderItem={(session) => (
            <List.Item
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedSessionId === session.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
              onClick={() => onSessionSelect?.(session)}
              style={{ padding: '8px 12px' }}
            >
              <div className="w-full">
                <div className="flex justify-between items-start mb-1">
                  <Text strong className="text-sm line-clamp-2">
                    {session.title}
                  </Text>
                </div>
                <Text type="secondary" className="text-xs">
                  {formatDate(session.updated_at)}
                </Text>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}