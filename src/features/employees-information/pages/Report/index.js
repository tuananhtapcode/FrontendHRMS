import { CButton, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { EmployeeTable } from '../../components/common/MyComponents'
import { ReportArgument } from './ReportArgument'

const ReportBase = ({ title, ArgChildren, dataTable }) => {
  const navigate = useNavigate()

  return (
    <>
      <CRow className="align-items-center">
        {/* BÊN TRÁI */}
        <CCol className="d-flex align-items-center gap-2">
          <CButton color="light" onClick={() => navigate(-1)}>
            <CIcon icon={cilArrowLeft} />
          </CButton>
          <h5 className="mb-0 fw-bold">{title}</h5>
        </CCol>

        {/* BÊN PHẢI */}
        <CCol xs="auto">
          <CButton color="info" className="text-white fw-bold">
            Xuất báo cáo
          </CButton>
        </CCol>
      </CRow>
      <CRow className="d-flex" style={{ gap: '12px' }}>
        <CCol md={3} style={{ backgroundColor: 'white' }}>
          <ReportArgument>
            <ArgChildren />
          </ReportArgument>
        </CCol>

        <CCol
          style={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'white',
          }}
        >
          {/* <CRow style={{ flex: 2, marginBottom: 16 }}>
            <EmployeeTable />
          </CRow> */}
          <CRow style={{ flex: 1 }}>
            <EmployeeTable data={dataTable} />
          </CRow>
        </CCol>
      </CRow>
    </>
  )
}

export default ReportBase
