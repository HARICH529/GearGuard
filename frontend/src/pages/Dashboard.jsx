import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import { ToolOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import api from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeRequests: 0,
    completedRequests: 0,
    overdueRequests: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [equipmentRes, requestsRes] = await Promise.all([
        api.get('/equipment'),
        api.get('/requests/kanban')
      ])

      const equipment = equipmentRes.data.data
      const requests = requestsRes.data.data

      const allRequests = [
        ...requests.New,
        ...requests['In Progress'],
        ...requests.Repaired,
        ...requests.Scrap
      ]

      setStats({
        totalEquipment: equipment.length,
        activeRequests: requests.New.length + requests['In Progress'].length,
        completedRequests: requests.Repaired.length,
        overdueRequests: allRequests.filter(r => 
          r.scheduledDate && new Date(r.scheduledDate) < new Date() && 
          !['Repaired', 'Scrap'].includes(r.status)
        ).length
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Equipment"
              value={stats.totalEquipment}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Requests"
              value={stats.activeRequests}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completedRequests}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Overdue"
              value={stats.overdueRequests}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard