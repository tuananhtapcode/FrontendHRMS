import { CCard, CCol, CRow } from '@coreui/react'
import { SearchableTable } from '../../../components/zReuse/zComponents'
import { logsCols } from '../components/tableColumns'
import { getLogs } from '../api/api'

const Logs = () => {
  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Nhật ký hệ thống</h2>
        </CCol>
      </CRow>
      <CCard>
        <SearchableTable columns={logsCols} getAPI={getLogs} noActions />
      </CCard>
    </>
  )
}

export default Logs
