import React, { useState, useEffect } from 'react'
import { Card, Tag, Avatar, Badge, Button, Modal, Form, Input, Select, DatePicker, App } from 'antd'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { UserOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

// Suppress react-beautiful-dnd defaultProps warning
const originalError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('defaultProps')) {
    return
  }
  originalError.call(console, ...args)
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState({})
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const { user } = useAuth()
  const { message } = App.useApp()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [kanbanRes, equipmentRes] = await Promise.all([
        api.get('/requests/kanban'),
        api.get('/equipment')
      ])
      setColumns(kanbanRes.data.data)
      setEquipment(equipmentRes.data.data)
    } catch (error) {
      message.error('Failed to fetch data')
    }
    setLoading(false)
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return
    }

    // Validate status transitions
    const validTransitions = {
      'New': ['In Progress'],
      'In Progress': ['Repaired', 'Scrap'],
      'Repaired': [],
      'Scrap': []
    }

    const currentStatus = source.droppableId
    const newStatus = destination.droppableId

    if (!validTransitions[currentStatus].includes(newStatus)) {
      message.error(`Cannot move from ${currentStatus} to ${newStatus}`)
      return
    }

    try {
      const updateData = { status: newStatus }
      
      // If moving to Repaired, prompt for duration
      if (newStatus === 'Repaired') {
        const duration = prompt('Enter duration in hours:')
        if (duration && !isNaN(duration)) {
          updateData.durationHours = parseFloat(duration)
        }
      }

      await api.put(`/requests/${draggableId}/status`, updateData)
      fetchData()
      message.success(`Request moved to ${newStatus}`)
    } catch (error) {
      message.error('Failed to update status')
    }
  }

  const handleCreateRequest = async (values) => {
    try {
      await api.post('/requests', values)
      message.success('Request created successfully')
      setModalVisible(false)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error('Failed to create request')
    }
  }

  const getColumnColor = (status) => {
    const colors = {
      'New': '#1890ff',
      'In Progress': '#faad14',
      'Repaired': '#52c41a',
      'Scrap': '#ff4d4f'
    }
    return colors[status] || '#d9d9d9'
  }

  const isOverdue = (request) => {
    if (!request.scheduledDate) return false
    return new Date(request.scheduledDate) < new Date() && 
           request.status !== 'Repaired'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Maintenance Requests</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Create Request
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
          {Object.entries(columns).map(([status, requests]) => (
            <div key={status} style={{ minWidth: '300px', flex: 1 }}>
              <div 
                style={{ 
                  backgroundColor: getColumnColor(status),
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h3 style={{ margin: 0, color: 'white' }}>{status}</h3>
                <Badge count={requests.length} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minHeight: '400px',
                      backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : '#fafafa',
                      padding: '8px',
                      borderRadius: '0 0 8px 8px'
                    }}
                  >
                    {requests.map((request, index) => (
                      <Draggable 
                        key={request._id} 
                        draggableId={request._id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '8px'
                            }}
                          >
                            <Card
                              size="small"
                              title={request.subject}
                              style={{
                                border: isOverdue(request) ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
                                cursor: 'grab'
                              }}
                              extra={
                                <Tag color={request.category === 'Corrective' ? 'red' : 'blue'}>
                                  {request.category}
                                </Tag>
                              }
                            >
                              <div>
                                <p><strong>Equipment:</strong> {request.equipment?.name}</p>
                                <p><strong>Serial:</strong> {request.equipment?.serialNumber}</p>
                                
                                {request.scheduledDate && (
                                  <p>
                                    <ClockCircleOutlined /> 
                                    {new Date(request.scheduledDate).toLocaleDateString()}
                                  </p>
                                )}
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                  {request.assignedTechnician ? (
                                    <Avatar 
                                      size="small" 
                                      icon={<UserOutlined />}
                                      title={request.assignedTechnician.username}
                                    />
                                  ) : (
                                    <Tag>Unassigned</Tag>
                                  )}
                                  
                                  <Tag size="small">
                                    {request.team?.name}
                                  </Tag>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal
        title="Create Maintenance Request"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRequest}>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="equipment" label="Equipment" rules={[{ required: true }]}>
            <Select placeholder="Select equipment">
              {equipment.map(eq => (
                <Select.Option key={eq._id} value={eq._id}>
                  {eq.name} - {eq.serialNumber}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="scheduledDate" label="Scheduled Date (Optional for Preventive)">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default KanbanBoard