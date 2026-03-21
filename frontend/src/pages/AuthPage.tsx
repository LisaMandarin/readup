import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { supabase } from '../supabaseClient'

export default function AuthPage({ isSignUp }: { isSignUp: boolean }) {
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })
      if (error) message.error(error.message)
      else message.success('Check your email for the confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) message.error(error.message)
      else message.success('Signed in successfully!')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create a ReadUp Account' : 'Sign In to ReadUp'}
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="w-full" loading={loading}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form>
        <div className="mt-4 text-center text-sm">
          {isSignUp ? (
            <p>Already have an account? <a href="/signin" className="text-blue-500">Sign in</a></p>
          ) : (
            <p>Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
          )}
        </div>
      </Card>
    </div>
  )
}