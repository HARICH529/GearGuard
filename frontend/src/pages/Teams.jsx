import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const { user } = useAuth()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const response = await api.get('/teams')
      setTeams(response.data.data)
    } catch (error) {
      message.error('Failed to fetch teams')
    }
    setLoading(false)
  }

  const handleSubmit = async (values) => {
    try {
      await api.post('/teams', values)
      message.success('Team created successfully')
      setModalVisible(false)
      form.resetFields()
      fetchTeams()
    } catch (error) {
      message.error('Failed to create team')
    }
  }

  const columns = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (specialization) => (
        <Tag color="blue">{specialization}</Tag>
      )
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members) => members?.length || 0
    },
    {
      title: 'Team Lead',
      dataIndex: ['teamLead', 'username'],
      key: 'teamLead'
    }
  ]

  if (!['Manager', 'Admin'].includes(user?.role)) {
    return <div>Access denied. Manager or Admin role required.</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Maintenance Teams</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Team
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teams}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title="Add Team"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Team Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Mechanics">Mechanics</Select.Option>
              <Select.Option value="Electricians">Electricians</Select.Option>
              <Select.Option value="IT Support">IT Support</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Teams