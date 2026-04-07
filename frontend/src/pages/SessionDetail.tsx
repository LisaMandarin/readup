import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  Tag,
  Divider,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  CopyOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { getSessionById, type SessionResponse } from '../api/session'

const { Title, Paragraph, Text } = Typography

export default function SessionDetail() {
  const navigate = useNavigate()
  const { sessionId } = useParams<{ sessionId: string }>()
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSession = async () => {
    if (!sessionId) return

    try {
      setLoading(true)
      const { data } = await getSessionById(sessionId)
      setSessionData(data)
    } catch (error) {
      console.error(error)
      message.error('Failed to load session detail.')
      navigate('/sessions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSession()
  }, [sessionId])

  const handleBack = () => {
    navigate('/sessions')
  }

  const handleCopyTranslation = async () => {
    if (!sessionData) return

    const combinedTranslation = sessionData.translations
      .map((item) => item.translation)
      .join(' ')

    try {
      await navigator.clipboard.writeText(combinedTranslation)
      message.success('Translation copied to clipboard.')
    } catch {
      message.error('Failed to copy translation.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!sessionData) {
    return null
  }

  const { session, translations } = sessionData

  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Session Detail
            </Title>
          </Space>

          <Button icon={<CopyOutlined />} onClick={handleCopyTranslation}>
            Copy Full Translation
          </Button>
        </div>

        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Title level={3}>{session.title || 'Untitled Session'}</Title>

          <Space wrap style={{ marginBottom: 12 }}>
            <Tag color="blue">{session.targetLanguage}</Tag>
            <Text type="secondary">
              Created: {new Date(session.createdAt).toLocaleString()}
            </Text>
          </Space>

          <Divider />

          <Title level={5}>Original Passage</Title>
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {session.fullPassage}
          </Paragraph>
        </Card>

        <Card title="Translations" style={{ borderRadius: 12 }}>
          {translations.map((item) => (
            <div key={item.uid} className="mb-6">
              <Text strong>Sentence {item.uid}</Text>

              <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                {item.sentence}
              </Paragraph>

              <Paragraph
                style={{
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                {item.translation}
              </Paragraph>

              <Text type="secondary" style={{ fontSize: 12 }}>
                Lemma: {item.lemma.join(', ')}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                POS: {item.pos.join(', ')}
              </Text>

              <Divider />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}