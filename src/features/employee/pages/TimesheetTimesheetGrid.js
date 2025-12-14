import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CButton, CButtonGroup, CCard, CCol, CRow } from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { getTimeSheet } from '../api/api'

const TimesheetTimesheetGrid = () => {
  const [calendarView, setCalendarView] = useState('dayGridMonth')
  const calendarRef = useRef()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTimeSheet()
        const formattedEvents = res.map((record) => {
          let bgColor = '#cce5ff'
          switch (record.status) {
            case 'PRESENT':
              bgColor = '#cce5ff'
              break
            case 'LATE':
              bgColor = '#fff3b0'
              break
            case 'LEAVE_PAID':
              bgColor = '#e3d7ff'
              break
            case 'ABSENT':
              bgColor = '#ffb3b3'
              break
            default:
              bgColor = '#e0e0e0'
          }
          return {
            title: record.status,
            date: record.date,
            backgroundColor: bgColor,
            borderColor: bgColor,
            textColor: '#000',
            extendedProps: {
              hoursWorked: record.hoursWorked,
              hoursOvertime: record.hoursOvertime,
            },
          }
        })
        setEvents(formattedEvents)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const handleCalendarView = (view) => {
    setCalendarView(view)
    calendarRef.current.getApi().changeView(view)
  }

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Bảng chấm công</h2>
        </CCol>

        <CCol className="text-end">
          <CButtonGroup>
            <CButton
              color="primary"
              onClick={() => handleCalendarView('dayGridWeek')}
              disabled={calendarView === 'dayGridWeek'}
            >
              Tuần
            </CButton>
            <CButton
              color="primary"
              onClick={() => handleCalendarView('dayGridMonth')}
              disabled={calendarView === 'dayGridMonth'}
            >
              Tháng
            </CButton>
          </CButtonGroup>
        </CCol>
      </CRow>

      <CCard className="p-3 shadow-sm">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView={calendarView}
          events={events}
          eventContent={(arg) => {
            const { extendedProps, title } = arg.event
            const { hoursWorked, hoursOvertime } = extendedProps
            return (
              <div
                style={{
                  padding: '2px',
                  borderRadius: 4,
                  backgroundColor: arg.event.backgroundColor,
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>
                  {hoursWorked}h + OT {hoursOvertime}h
                </div>
              </div>
            )
          }}
        />
      </CCard>
    </>
  )
}

export default TimesheetTimesheetGrid
