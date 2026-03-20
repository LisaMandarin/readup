import { useState } from 'react'
import { Button, Card, ConfigProvider, Input, Space } from 'antd'

export default function MainPage() {
  const [passage, setPassage] = useState('')

  return (
    <ConfigProvider>
      <div className='flex flex-col px-6 py-6 min-h-screen justify-between'>
        <div>
          {/* welcome message */}
          <div className='mb-4'>
            <p className='m-0 text-sm'>Welcome, testuser</p>
            <p className='m-0 text-sm text-gray-600'>testuser@example.com</p>
          </div>

          {/* Application introduction */}
          <h1 className='text-4xl font-extrabold text-center m-4'>Read Up</h1>
          <p>Turn any text into an interactive learning experience — translate, explore vocabulary, and truly understand what you read.</p>
          
          {/* Textarea for passage */}
          <Card
            className='mt-4'
            style={{
              background: 'var(--card-bg)',
            }}
          >
            <Input.TextArea
              rows={5}
              value={passage}
              onChange={(event) => setPassage(event.target.value)}
              placeholder='Enter the passage you want to translate'
            />

            <Space className='mt-4'>
              <Button type='primary'>Translation</Button>
              <Button onClick={() => setPassage('')}>Clear</Button>
            </Space>
          </Card>

        </div>
        <footer className="px-6 py-4 text-center text-gray-500">
          CSE499 Team 5 -ReadUp &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </ConfigProvider>
  )
}
