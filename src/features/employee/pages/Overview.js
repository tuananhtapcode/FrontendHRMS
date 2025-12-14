import { cilBookmark, cilCalendar, cilCalendarCheck, cilList, cilNotes } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import { getMyEmployeeInformation } from '../api/api'

const Overview = () => {
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyEmployeeInformation()
      console.log(res)
      setFullName(res.fullName)
    }
    fetchData()
  }, [setFullName])

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Tổng quan</h1>
      <CRow className="gx-3">
        <CCol md={7}>
          <CCard className="p-4 shadow-sm rounded-3xl border-0 h-100">
            <CCard className="p-3 mb-4">
              <h2 className="text-2xl font-semibold mb-2">
                Xin chào, <span className="text-primary">{fullName}</span>
              </h2>
              <small className="text-muted d-block">
                Chúc bạn một ngày làm việc hiệu quả và tràn đầy năng lượng ☀️
              </small>
            </CCard>

            <CRow className="align-items-stretch h-100">
              <CCol>
                <CCard className="h-100">
                  <CCardHeader className="fw-bold mb-2">
                    Cần thực hiện (Đang phát triển)
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column justify-content-center align-items-center text-center text-muted">
                    <CIcon icon={cilList} size="xl" className="mb-2 text-secondary" />
                    <div>Không có công việc cần thực hiện</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol>
                <CCard className="h-100">
                  <CCardHeader className="fw-bold mb-2">
                    Chờ người khác duyệt (Đang phát triển)
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column justify-content-center align-items-center text-center text-muted">
                    <CIcon icon={cilBookmark} size="xl" className="mb-2 text-secondary" />
                    <div>Không có công việc cần chờ duyệt</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCard>
        </CCol>

        <CCol md={5}>
          <CCard className="p-3 mb-3 shadow-sm rounded-3xl border-0">
            <CRow>
              {[
                { label: 'Tổng ngày công', value: 0 },
                { label: 'Ngày phép còn lại cả năm', value: 0 },
                { label: 'Ngày phép còn lại đến hiện tại', value: 0 },
              ].map((item, index) => (
                <CCol xs={12} key={index} className="mb-3">
                  <CCard className="border-0 shadow-sm text-center rounded-3xl hover:shadow-md transition-all duration-300">
                    <CCardBody>
                      <div className="text-3xl fw-bold text-primary mb-2">{item.value}</div>
                      <div className="text-muted">{item.label}</div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCard>

          <CCard className="p-4 shadow-sm rounded-3xl border-0">
            <CCardTitle className="text-xl fw-bold mb-3">Tiện ích</CCardTitle>
            <div className="d-flex flex-wrap gap-2">
              <CButton
                color="primary"
                className="d-flex align-items-center gap-2"
                href="/#/employee/profile"
              >
                <CIcon icon={cilNotes} /> Hồ sơ
              </CButton>
              <CButton
                color="success"
                className="d-flex align-items-center gap-2"
                href="/#/employee/timesheet/timekeeping-remote"
              >
                <CIcon icon={cilCalendarCheck} /> Chấm công
              </CButton>
              <CButton
                color="info"
                className="d-flex align-items-center gap-2"
                href="/#/employee/timesheet/shiftplan"
              >
                <CIcon icon={cilCalendar} /> Bảng phân ca
              </CButton>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Overview
