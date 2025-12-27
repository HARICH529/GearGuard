import React, { useState } from 'react'
import { Form, Input, Button, Card, Select, App } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Set department to 'Management' for Manager role
      if (values.role === 'Manager') {
        values.department = 'Management'
      }
      
      const response = await api.post('/auth/register', values)
      message.success('Registration successful!')
      navigate('/login')
    } catch (error) {
      message.error(error.response?.data?.error || 'Registration failed')
    }
    setLoading(false)
  }

  const handleRoleChange = (value) => {
    setSelectedRole(value)
    // Clear department field when role changes
    form.setFieldsValue({ department: undefined })
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="GearGuard Registration" style={{ width: 450 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full Name" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email!' }]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email Address" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match!'))
                }
              })
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm Password" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select 
              placeholder="Select Role" 
              size="large"
              onChange={handleRoleChange}
            >
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="Technician">Technician</Select.Option>
              <Select.Option value="Employee">Employee</Select.Option>
            </Select>
          </Form.Item>

          {selectedRole && selectedRole !== 'Manager' && (
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select your department!' }]}
            >
              <Select placeholder="Select Department" size="large">
                <Select.Option value="Mechanics">Mechanics</Select.Option>
                <Select.Option value="Electricians">Electricians</Select.Option>
                <Select.Option value="IT Support">IT Support</Select.Option>
              </Select>
            </Form.Item>
          )}
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Already have an account? </span>
          <Link to="/login">Login here</Link>
        </div>
      </Card>
    </div>
  )
}

export default Register