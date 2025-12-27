import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Equipment from './pages/Equipment'
import Requests from './pages/Requests'
import Teams from './pages/Teams'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'

const { Content } = Layout

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/*" element={
        user ? (
          <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Layout>
              <Sidebar />
              <Layout style={{ padding: '24px' }}>
                <Content style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/equipment" element={<Equipment />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  )
}

export default App