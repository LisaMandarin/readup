import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  Empty,
  Tag,
  message,
  Popconfirm,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EyeOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { getSessions, deleteSession, type SessionListItem } from '../api/session'

const { Title, Paragraph, Text } = Typography

export default function SessionHistory() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<SessionListItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadSessions = async () => {
    try {
      setLoading(true)
      const { data } = await getSessions()
      setSessions(data)
    } catch (error) {
      console.error(error)
      message.error('Failed to load sessions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleDelete = async (sessionID: string) => {
    try {
      await deleteSession(sessionID)
      setSessions((prev) => prev.filter((item) => item.sessionID !== sessionID))
      message.success('Session deleted successfully.')
    } catch (error) {
      console.error(error)
      message.error('Failed to delete session.')
    }
  }

  const handleView = (sessionID: string) => {
    navigate(`/sessions/${sessionID}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              <HistoryOutlined style={{ marginRight: 8 }} />
              Session History
            </Title>
          </Space>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : sessions.length === 0 ? (
          <Empty description="No saved sessions yet" />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sessions.map((session) => (
              <Card
                key={session.sessionID}
                title={session.title || 'Untitled Session'}
                extra={<Tag color="blue">{session.targetLanguage}</Tag>}
                style={{ borderRadius: 12 }}
              >
                <Paragraph ellipsis={{ rows: 3 }} style={{ minHeight: 66 }}>
                  {session.passagePreview}
                </Paragraph>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  Created: {new Date(session.createdAt).toLocaleString()}
                </Text>

                <div className="mt-4">
                  <Space>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(session.sessionID)}
                    >
                      View
                    </Button>

                    <Popconfirm
                      title="Delete this session?"
                      description="This action cannot be undone."
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(session.sessionID)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}