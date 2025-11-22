import { CCol, CRow, CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
import First from './timekeepingRemotePages/First'
import Second from './timekeepingRemotePages/Second'
import Third from './timekeepingRemotePages/Third'

const TimesheetTimekeepingRemote = () => {
  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Chấm công trên ứng dụng</h2>
        </CCol>
      </CRow>

      <CTabs defaultActiveItemKey={1}>
        <CTabList variant="underline-border">
          <CTab itemKey={1}>Của tôi</CTab>
          <CTab itemKey={2}>Tôi duyệt</CTab>
          <CTab itemKey={3}>Chuyển tiếp</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-3" itemKey={1}>
            <First />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={2}>
            <Second />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={3}>
            <Third />
          </CTabPanel>
        </CTabContent>
      </CTabs>
    </>
  )
}

export default TimesheetTimekeepingRemote
