import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ConfigProvider, Spin } from 'antd'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const SignOut = lazy(() => import('./pages/SignOut'))
const Home = lazy(() => import('./pages/Home'))

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <Spin size="large" />
              </div>
            }
          >
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signout" element={<SignOut />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
