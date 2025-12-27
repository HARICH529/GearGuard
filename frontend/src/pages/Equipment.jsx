import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Badge, Space, Popconfirm, App } from 'antd'
import { PlusOutlined, ToolOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import moment from 'moment'

const Equipment = () => {
  const [equipment, setEquipment] = useState([])
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [requestsModalVisible, setRequestsModalVisible] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [equipmentRequests, setEquipmentRequests] = useState([])
  const [openRequestsCount, setOpenRequestsCount] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [form] = Form.useForm()
  const { user } = useAuth()
  const { message } = App.useApp()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [equipmentRes, teamsRes, usersRes] = await Promise.all([
        api.get('/equipment'),
        api.get('/teams'),
        api.get('/users')
      ])
      setEquipment(equipmentRes.data.data)
      setTeams(teamsRes.data.data)
      setUsers(usersRes.data.data.filter(u => u.role === 'Employee'))
    } catch (error) {
      message.error('Failed to fetch data')
    }
    setLoading(false)
  }

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        purchaseDate: values.purchaseDate.toDate(),
        warranty: values.warranty ? {
          startDate: values.warranty.startDate?.toDate(),
          endDate: values.warranty.endDate?.toDate(),
          provider: values.warranty.provider
        } : undefined
      }

      await api.post('/equipment', data)
      message.success('Equipment created successfully')
      setModalVisible(false)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error('Failed to create equipment')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/equipment/${id}`)
      message.success('Equipment deleted successfully')
      fetchData()
    } catch (error) {
      message.error('Failed to delete equipment')
    }
  }

  const showMaintenanceRequests = async (equipment) => {
    try {
      const response = await api.get(`/equipment/${equipment._id}/requests`)
      setEquipmentRequests(response.data.data.requests)
      setOpenRequestsCount(response.data.data.openCount)
      setSelectedEquipment(equipment)
      setRequestsModalVisible(true)
    } catch (error) {
      message.error('Failed to fetch maintenance requests')
    }
  }

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         eq.serialNumber.toLowerCase().includes(searchText.toLowerCase())
    const matchesDepartment = !departmentFilter || eq.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(equipment.map(eq => eq.department))]

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.department === value
    },
    {
      title: 'Assigned Employee',
      dataIndex: ['assignedEmployee', 'username'],
      key: 'assignedEmployee'
    },
    {
      title: 'Team',
      dataIndex: ['assignedTeam', 'name'],
      key: 'team'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Badge count={0} showZero={false}>
            <Button
              type="primary"
              icon={<ToolOutlined />}
              size="small"
              onClick={() => showMaintenanceRequests(record)}
            >
              Maintenance
            </Button>
          </Badge>
          {user?.role === 'Admin' && (
            <Popconfirm
              title="Delete equipment?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Equipment Management</h1>
        {user?.role === 'Admin' && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Equipment
          </Button>
        )}
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Search by name or serial number"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          allowClear
          style={{ width: 200 }}
        >
          {departments.map(dept => (
            <Select.Option key={dept} value={dept}>{dept}</Select.Option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEquipment}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Add Equipment"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Equipment Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="serialNumber" label="Serial Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="purchaseDate" label="Purchase Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Production">Production</Select.Option>
              <Select.Option value="IT">IT</Select.Option>
              <Select.Option value="Maintenance">Maintenance</Select.Option>
              <Select.Option value="Administration">Administration</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="assignedTeam" label="Assigned Team" rules={[{ required: true }]}>
            <Select>
              {teams.map(team => (
                <Select.Option key={team._id} value={team._id}>
                  {team.name} ({team.specialization})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="assignedEmployee" label="Assigned Employee" rules={[{ required: true }]}>
            <Select>
              {users.map(user => (
                <Select.Option key={user._id} value={user._id}>
                  {user.username} - {user.department}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Warranty Information">
            <Form.Item name={['warranty', 'startDate']} label="Start Date" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['warranty', 'endDate']} label="End Date" style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['warranty', 'provider']} label="Provider">
              <Input />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Maintenance Requests - ${selectedEquipment?.name}`}
        open={requestsModalVisible}
        onCancel={() => setRequestsModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Tag color="blue">Total Requests: {equipmentRequests.length}</Tag>
          <Tag color="orange">Open Requests: {openRequestsCount}</Tag>
        </div>
        
        <Table
          dataSource={equipmentRequests}
          rowKey="_id"
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Subject',
              dataIndex: 'subject',
              key: 'subject'
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => {
                const colors = {
                  'New': 'blue',
                  'In Progress': 'orange',
                  'Repaired': 'green',
                  'Scrap': 'red'
                }
                return <Tag color={colors[status]}>{status}</Tag>
              }
            },
            {
              title: 'Created',
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: (date) => moment(date).format('MMM DD, YYYY')
            },
            {
              title: 'Technician',
              dataIndex: ['assignedTechnician', 'username'],
              key: 'technician',
              render: (name) => name || 'Unassigned'
            }
          ]}
        />
      </Modal>
    </div>
  )
}

export default Equipment