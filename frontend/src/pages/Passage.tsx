import { useState } from 'react'
import { Button, Card, Input, Space, message, Spin } from 'antd'
import { createSession, type SessionResponse } from '../api/sessions'

type Props = {
  passage: string
  onPassageChange: (value: string) => void
  onClear: () => void
  onSessionCreated?: (session: SessionResponse) => void
}

export default function Passage(props: Props) {
  const { passage, onPassageChange, onClear, onSessionCreated } = props
  const [loading, setLoading] = useState(false)

  const handleTranslation = async () => {
    if (!passage.trim()) {
      message.warning('Please enter a passage to translate')
      return
    }

    try {
      setLoading(true)
      const { data: session } = await createSession({ sentence: passage })
      
      message.success('Session created! Translation feature coming soon...')
      onSessionCreated?.(session)
      
      // For now, we just create the session. Translation functionality
      // can be added later when translation API is ready
      
    } catch (error) {
      console.error('Error creating session:', error)
      message.error('Failed to create session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className='mt-4'
      style={{
        background: 'var(--card-bg)',
      }}
    >
      <Input.TextArea
        rows={5}
        value={passage}
        onChange={(event) => onPassageChange(event.target.value)}
        placeholder='Enter the passage you want to translate'
        disabled={loading}
      />

      <Space className='mt-4'>
        <Button 
          type='primary' 
          onClick={() => void handleTranslation()}
          loading={loading}
          disabled={!passage.trim()}
        >
          {loading ? 'Creating Session...' : 'Start Translation Session'}
        </Button>
        <Button onClick={onClear} disabled={loading}>Clear</Button>
      </Space>
    </Card>
  )
}
