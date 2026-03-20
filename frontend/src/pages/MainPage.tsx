import { useState } from 'react'
import { ConfigProvider } from 'antd'

import Passage from './Passage'

export default function MainPage() {
  const [passage, setPassage] = useState('')

  return (
    <ConfigProvider>
      <div className='flex flex-col px-6 py-6 min-h-screen justify-between'>
        <div className='border-4 border-[var(--card-border)] rounded-lg p-4'>
          {/* welcome message */}
          <div className='mb-4'>
            <p className='m-0 text-sm'>Welcome, testuser</p>
            <p className='m-0 text-sm text-gray-600'>testuser@example.com</p>
          </div>

          {/* Application introduction */}
          <h1 className='text-4xl font-extrabold text-center m-4'>Read Up</h1>
          <p className='text-center'>Turn any text into an interactive learning experience — translate, explore vocabulary, and truly understand what you read.</p>
          
          <Passage
            passage={passage}
            onPassageChange={setPassage}
            onClear={() => setPassage('')}
          />

        </div>
        <footer className="px-6 py-4 text-center text-gray-500">
          CSE499 Team 5 -ReadUp &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </ConfigProvider>
  )
}
