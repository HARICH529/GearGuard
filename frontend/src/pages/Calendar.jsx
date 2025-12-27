import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Modal, Form, Input, Select, DatePicker, message, Button, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import api from '../services/api'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const CalendarView = () => {
  const [events, setEvents] = useState([])
  const [equipment, setEquipment] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [calendarRes, equipmentRes] = await Promise.all([
        api.get('/requests/calendar'),
        api.get('/equipment')
      ])
      
      const formattedEvents = calendarRes.data.data.map(request => ({
        id: request._id,
        title: `${request.subject} - ${request.equipment.name}`,
        start: new Date(request.scheduledDate),
        end: new Date(request.scheduledDate),
        resource: request,
        allDay: true
      }))
      
      setEvents(formattedEvents)
      setEquipment(equipmentRes.data.data)
    } catch (error) {
      message.error('Failed to fetch calendar data')
    }
  }

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start)
    setModalVisible(true)
    form.setFieldsValue({ scheduledDate: moment(start) })
  }

  const handleCreateRequest = async (values) => {
    try {
      await api.post('/requests', {
        ...values,
        scheduledDate: values.scheduledDate.toDate()
      })
      message.success('Preventive maintenance scheduled')
      setModalVisible(false)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error('Failed to schedule maintenance')
    }
  }

  const eventStyleGetter = (event) => {
    const request = event.resource
    let backgroundColor = '#1890ff'
    
    if (request.status === 'Repaired') backgroundColor = '#52c41a'
    else if (request.status === 'In Progress') backgroundColor = '#faad14'
    else if (new Date(request.scheduledDate) < new Date()) backgroundColor = '#ff4d4f'
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const EventComponent = ({ event }) => (
    <div>
      <strong>{event.resource.subject}</strong>
      <br />
      <small>{event.resource.equipment.name}</small>
      <br />
      <Tag size="small" color={event.resource.status === 'Repaired' ? 'green' : 'blue'}>
        {event.resource.status}
      </Tag>
    </div>
  )

  return (
    <div style={{ height: '600px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Maintenance Calendar</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Schedule Maintenance
        </Button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent
        }}
        views={['month', 'week', 'day']}
        defaultView="month"
      />

      <Modal
        title="Schedule Preventive Maintenance"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRequest}>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input placeholder="e.g., Monthly inspection" />
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
          
          <Form.Item name="scheduledDate" label="Scheduled Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Maintenance details..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CalendarView