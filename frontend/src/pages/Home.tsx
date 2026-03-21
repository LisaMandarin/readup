import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfigProvider, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import Passage from './Passage'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [passage, setPassage] = useState('')

  const handleSignOut = () => {
    navigate('/signout')
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