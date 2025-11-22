import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CButton, CButtonGroup, CCard, CCol, CRow } from '@coreui/react'
import { useRef, useState } from 'react'

const TimesheetShiftPlan = () => {
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
          events={[
            { title: 'event 1', date: '2025-11-22' },
            { title: 'event 2', date: '2025-11-23' },
          ]}
        />
      </CCard>
    </>
  )
}

export default TimesheetShiftPlan
