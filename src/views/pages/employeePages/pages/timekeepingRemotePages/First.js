import { cilFingerprint } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard } from '@coreui/react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const First = () => {
  return (
    <>
      <CCard className="p-4 d-flex flex-row align-items-center shadow-sm rounded-3 mb-4">
        <div
          className="d-flex justify-content-center align-items-center rounded-circle me-3"
          style={{
            width: 55,
            height: 55,
            background: '#fcb4a8ff',
          }}
        >
          <CIcon icon={cilFingerprint} size="xl" />
        </div>

        <div>
          <h5 className="fw-bold mb-1">Chưa đến giờ chấm công</h5>
          <small className="text-muted">Vui lòng quay lại sau</small>
        </div>
      </CCard>

      <CCard className="p-4 shadow-sm rounded-3">
        <h4 className="mb-3 fw-bold">Lịch sử chấm công</h4>

        <div style={{ overflow: 'hidden', borderRadius: 10 }}>
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" height="auto" />
        </div>
      </CCard>
    </>
  )
}

export default First
