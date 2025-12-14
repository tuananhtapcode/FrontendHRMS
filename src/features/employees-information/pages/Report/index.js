import { CButton, CCol, CRow, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilCloudDownload } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { ReportArgument } from './ReportArgument'

const ReportBase = ({ title, ArgChildren, dataTable }) => {
  const navigate = useNavigate()

  return (
    <div className="p-3" style={{ backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <CRow className="align-items-center mb-3">
        <CCol className="d-flex align-items-center gap-2">
          <CButton
            color="light"
            onClick={() => navigate(-1)}
            className="shadow-sm border-0"
            title="Quay lại"
          >
            <CIcon icon={cilArrowLeft} />
          </CButton>
          <h5 className="mb-0 fw-bold text-dark">{title}</h5>
        </CCol>

        <CCol xs="auto">
          <CButton
            color="info"
            className="text-white fw-semibold shadow-sm d-flex align-items-center gap-2"
          >
            <CIcon icon={cilCloudDownload} />
            Xuất báo cáo
          </CButton>
        </CCol>
      </CRow>

      {/* BODY */}
      <CRow className="g-3">
        {/* SIDEBAR ARGUMENT */}
        <CCol md={3}>
          <CCard className="h-100 shadow-sm border-0">
            <CCardBody>
              <ReportArgument>
                <ArgChildren />
              </ReportArgument>
            </CCardBody>
          </CCard>
        </CCol>

        {/* MAIN TABLE */}
        <CCol style={{ width: 1 }}>
          <CCard className="h-100 shadow-sm border-0">
            <CCardBody>{/* <EmployeeTable data={dataTable} /> */}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ReportBase
