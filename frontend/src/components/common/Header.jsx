import React from 'react'
import { Layout, Avatar, Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'

const { Header: AntHeader } = Layout

const Header = () => {
  const { user, logout } = useAuth()

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout
    }
  ]

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
        GearGuard
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{user?.username} ({user?.role})</span>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header