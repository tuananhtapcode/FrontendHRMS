import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCol, CRow } from '@coreui/react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { cilCheckCircle, cilExitToApp } from '@coreui/icons'
import { checkIn, checkOut } from '../api/api'

const TimesheetTimekeepingRemote = () => {
  const handleCheckIn = async () => {
    try {
      const res = await checkIn()
    } catch (error) {
      alert(error.response.data.message)
      console.error('Error during check-in:', error)
    }
  }

  const handleCheckOut = async () => {
    try {
      const res = await checkOut()
    } catch (error) {
      alert(error.response.data.message)
      console.error('Error during check-out:', error)
    }
  }

  return (
    <>
      {/* Header */}
      <CRow className="align-items-center mb-4">
        <CCol>
          <h2 className="m-0 fw-bold">Chấm công trên ứng dụng</h2>
        </CCol>
      </CRow>

      {/* Check-in / Check-out buttons */}
      <CCard className="p-4 mb-4">
        <CRow>
          <CCol className="d-flex justify-content-between gap-3">
            <CButton
              color="success"
              className="flex-fill py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              onClick={handleCheckIn}
            >
              <CIcon icon={cilCheckCircle} />
              Check-in
            </CButton>

            <CButton
              color="danger"
              className="flex-fill py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              onClick={handleCheckOut}
            >
              <CIcon icon={cilExitToApp} />
              Check-out
            </CButton>
          </CCol>
        </CRow>
      </CCard>

      {/* Calendar */}
      <CCard className="p-4 shadow-sm rounded-3">
        <h4 className="mb-3 fw-bold">Lịch sử chấm công</h4>

        <div style={{ overflow: 'hidden', borderRadius: 10 }}>
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" height="auto" />
        </div>
      </CCard>
    </>
  )
}

export default TimesheetTimekeepingRemote
