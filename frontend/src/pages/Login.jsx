import React, { useState } from 'react'
import { Form, Input, Button, Card, App } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { message } = App.useApp()

  const onFinish = async (values) => {
    setLoading(true)
    const result = await login(values.email, values.password)
    
    if (result.success) {
      message.success('Login successful!')
    } else {
      message.error(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="GearGuard Login" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </div>
      </Card>
    </div>
  )
}

export default Login