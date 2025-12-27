import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, message, Spin } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ToolOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import api from '../services/api'

const Reports = () => {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState({
    requestsByTeam: [],
    requestsByEquipment: []
  })
  const [kanbanData, setKanbanData] = useState({})

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const [reportsRes, kanbanRes] = await Promise.all([
        api.get('/requests/reports'),
        api.get('/requests/kanban')
      ])
      setReportData(reportsRes.data.data)
      setKanbanData(kanbanRes.data.data)
    } catch (error) {
      message.error('Failed to fetch report data')
    }
    setLoading(false)
  }

  const getTotalRequests = () => {
    return Object.values(kanbanData).reduce((total, requests) => total + requests.length, 0)
  }

  const getCompletedRequests = () => {
    return kanbanData['Repaired']?.length || 0
  }

  const getInProgressRequests = () => {
    return kanbanData['In Progress']?.length || 0
  }

  const getOverdueRequests = () => {
    const today = new Date()
    let overdueCount = 0
    
    Object.values(kanbanData).forEach(requests => {
      requests.forEach(request => {
        if (request.scheduledDate && 
            new Date(request.scheduledDate) < today && 
            request.status !== 'Repaired') {
          overdueCount++
        }
      })
    })
    
    return overdueCount
  }

  const statusColors = ['#1890ff', '#faad14', '#52c41a', '#ff4d4f']
  
  const statusData = Object.entries(kanbanData).map(([status, requests]) => ({
    name: status,
    value: requests.length
  }))

  const teamColumns = [
    {
      title: 'Team',
      dataIndex: '_id',
      key: 'team'
    },
    {
      title: 'Total Requests',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      sorter: (a, b) => a.completed - b.completed
    },
    {
      title: 'Completion Rate',
      key: 'rate',
      render: (_, record) => `${((record.completed / record.count) * 100).toFixed(1)}%`
    }
  ]

  const equipmentColumns = [
    {
      title: 'Department',
      dataIndex: '_id',
      key: 'department'
    },
    {
      title: 'Total Requests',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count
    },
    {
      title: 'Avg Duration (Hours)',
      dataIndex: 'avgDuration',
      key: 'avgDuration',
      render: (duration) => duration ? duration.toFixed(1) : 'N/A'
    }
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Maintenance Reports & Analytics</h1>
      
      {/* Key Metrics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Requests"
              value={getTotalRequests()}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed"
              value={getCompletedRequests()}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={getInProgressRequests()}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Overdue"
              value={getOverdueRequests()}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Requests by Team">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.requestsByTeam}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1890ff" name="Total" />
                <Bar dataKey="completed" fill="#52c41a" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Request Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Data Tables */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Team Performance">
            <Table
              dataSource={reportData.requestsByTeam}
              columns={teamColumns}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Equipment by Department">
            <Table
              dataSource={reportData.requestsByEquipment}
              columns={equipmentColumns}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Reports