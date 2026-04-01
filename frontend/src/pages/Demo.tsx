/*
 * DEMO FILE - FOR MEETING PRESENTATION ONLY
 * 
 * This file demonstrates the Session History functionality implemented 
 * by Johnathan Babb for CSE499. It shows the UI components and features
 * without requiring user authentication or database setup.
 * 
 * TO REMOVE AFTER MEETING:
 * 1. Delete this entire file (Demo.tsx)
 * 2. Remove Demo import from App.tsx  
 * 3. Remove /demo route from App.tsx
 * 4. Remove demo link from SignIn.tsx
 */

import { useState } from 'react'
import { ConfigProvider, Card, Typography, Row, Col, Tag, List } from 'antd'
import { EyeOutlined, BookOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

// Sample sessions data
const sampleSessions = [
  {
    id: 1,
    title: "The quick brown fox jumps...",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet...",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    title: "To be or not to...",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export default function Demo() {
  const [selectedSession, setSelectedSession] = useState(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} min ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`
    }
  }

  return (
    <ConfigProvider>
      <div className="flex flex-col px-6 py-6 min-h-screen">
        <Row gutter={16} className="flex-1">
          {/* Main Content */}
          <Col span={16}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <EyeOutlined className="text-blue-500" />
                <Tag color="blue">DEMO MODE</Tag>
              </div>
              
              <Title level={2}>ReadUp - Session History Demo</Title>
              
              <Card className="mb-4" size="small">
                <Title level={5}>✨ Implemented Features</Title>
                <ul>
                  <li>📊 <strong>Database Schema</strong>: Sessions & Passages tables with proper relationships</li>
                  <li>🔗 <strong>Foreign Keys</strong>: Sessions tied to users, passages tied to sessions</li>
                  <li>📝 <strong>Auto Title Generation</strong>: Session titles from first 5 words</li>
                  <li>🕐 <strong>Smart Time Display</strong>: Relative time formatting</li>
                  <li>🎨 <strong>Professional UI</strong>: Clean sidebar with selection states</li>
                  <li>🔄 <strong>Real-time Updates</strong>: History refreshes when new sessions created</li>
                </ul>
              </Card>

              {selectedSession && (
                <Card size="small">
                  <Text strong>Selected Session: </Text>
                  <Text>{selectedSession.title}</Text>
                </Card>
              )}

            </Card>
          </Col>

          {/* Session History Sidebar */}
          <Col span={8}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <BookOutlined />
                  <Title level={5} className="m-0">Session History</Title>
                  <Tag color="blue">DEMO</Tag>
                </div>
              }
            >
              <List
                dataSource={sampleSessions}
                renderItem={(session) => (
                  <List.Item
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedSession?.id === session.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="w-full">
                      <Text strong className="block">{session.title}</Text>
                      <Text type="secondary" className="text-xs">
                        {formatDate(session.updated_at)}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <footer className="text-center text-gray-500 pt-4">
          <EyeOutlined /> CSE499 Team 5 - ReadUp Demo Mode &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </ConfigProvider>
  )
}