import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CButton, CButtonGroup, CCard, CCol, CRow } from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { getEmployeeShiftPlan, getMyEmployeeInformation } from '../api/api'
import dayjs from 'dayjs'

const TimesheetShiftPlan = () => {
  const [events, setEvents] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await getMyEmployeeInformation()
        const employeeId = employeeData.employeeId

        const date = new Date()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        const res = await getEmployeeShiftPlan(employeeId, month, year)
        // console.log('Shift Plan:', res)
        const formattedEvents = res.map((shift) => ({
          title: shift.shiftName,
          date: shift.assignmentDate,
          backgroundColor: '#cce5ff',
          borderColor: '#66b0ff',
          textColor: '#000',
          extendedProps: {
            startTime: shift.startTime,
            endTime: shift.endTime,
          },
        }))

        setEvents(formattedEvents)
      } catch (error) {
        console.error('Error fetching shift plan:', error)
      }
    }
    fetchData()
  }, [])

  const [calendarView, setCalendarView] = useState('dayGridMonth')
  const calendarRef = useRef()

  const handleCalendarView = (view) => {
    setCalendarView(view)
    calendarRef.current.getApi().changeView(view)
  }

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Bảng phân ca</h2>
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
            const { title, extendedProps } = arg.event
            const start = dayjs(extendedProps.startTime, 'HH:mm:ss').format('HH:mm')
            const end = dayjs(extendedProps.endTime, 'HH:mm:ss').format('HH:mm')
            return (
              <div style={{ padding: '2px', borderRadius: 4, backgroundColor: '#cce5ff' }}>
                <div style={{ fontWeight: 'bold' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>
                  {start} - {end}
                </div>
              </div>
            )
          }}
        />
      </CCard>
    </>
  )
}

export default TimesheetShiftPlan
