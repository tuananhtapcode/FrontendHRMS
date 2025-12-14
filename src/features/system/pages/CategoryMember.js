import {
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CRow,
  CCol,
  CButton,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { accountCols } from '../components/tableColumns'
import { getAccounts } from '../api/api'
import { SearchableTable } from '../../../components/zReuse/zComponents'
import { employeeColumns } from '../../employees-information/pages/components/tableColumns'
import { getEmployees } from '../../employees-information/api/api'

const CategoryMember = () => {
  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Đối tượng
        </CCol>
        {/* <CCol className="gap-2 d-flex justify-content-end align-items-center">
          <CTooltip content="Xuất file Excel" placement="bottom">
            <CButton color="secondary">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CTooltip>
        </CCol> */}
      </CRow>
      <CTabs defaultActiveItemKey={1}>
        <CTabList variant="underline-border">
          <CTab itemKey={1}>Người dùng</CTab>
          <CTab itemKey={2}>Nhân viên</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-3" itemKey={1}>
            <SearchableTable columns={accountCols} getAPI={getAccounts} />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={2}>
            <SearchableTable columns={employeeColumns} getAPI={getEmployees} />
          </CTabPanel>
        </CTabContent>
      </CTabs>
    </>
  )
}

export default CategoryMember
