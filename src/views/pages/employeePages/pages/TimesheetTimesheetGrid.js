import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CButton, CButtonGroup, CCard, CCol, CRow } from '@coreui/react'
import { useRef, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cil4k } from '@coreui/icons'

const CustomCard = ({ title, quantity, icon, backgroundIcon }) => {
  return (
    <CCard
      className="p-3 d-flex flex-row justify-content-between align-items-center shadow-sm rounded-3"
      style={{ minHeight: 120 }}
    >
      <div>
        <h6 className="text-muted mb-1">{title}</h6>
        <h3 className="fw-bold mb-0">{quantity}</h3>
      </div>
      <div
        className="d-flex justify-content-center align-items-center rounded-circle"
        style={{
          width: 50,
          height: 50,
          background: backgroundIcon,
        }}
      >
        <CIcon icon={icon} size="xl" />
      </div>
    </CCard>
  )
}

const TimesheetTimesheetGrid = () => {
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

      <CRow className="mb-4">
        <CCol>
          <CustomCard
            title="Tổng công hưởng lương"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#e8f0ff"
          />
        </CCol>
        <CCol>
          <CustomCard
            title="Tổng giờ làm thêm"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#e8fff3"
          />
        </CCol>
        <CCol>
          <CustomCard
            title="Số lần đi muộn / về sớm"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#fff6e8"
          />
        </CCol>
        <CCol>
          <CustomCard title="Tổng số ca nghỉ" quantity={0} icon={cil4k} backgroundIcon="#ffe8e8" />
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

export default TimesheetTimesheetGrid
