import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  DashboardOutlined, 
  ToolOutlined, 
  FileTextOutlined, 
  TeamOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/equipment',
      icon: <ToolOutlined />,
      label: 'Equipment'
    },
    {
      key: '/requests',
      icon: <FileTextOutlined />,
      label: 'Requests'
    },
    {
      key: '/calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar'
    }
  ]

  if (['Manager', 'Admin'].includes(user?.role)) {
    menuItems.push(
      {
        key: '/teams',
        icon: <TeamOutlined />,
        label: 'Teams'
      },
      {
        key: '/reports',
        icon: <BarChartOutlined />,
        label: 'Reports'
      }
    )
  }

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  )
}

export default Sidebar