import { CCol, CRow } from '@coreui/react'

import QuickStatsChart from '../components/dashboard/QuickStatsChart'
import HumanResourceStats from '../components/dashboard/HumanResourceStats'
import EmployeeStructureChart from '../components/dashboard/EmployeeStructureChart'
import ReminderList from '../components/dashboard/ReminderList'
import LineChart from '../components/dashboard/LineChart'
import BarChart from '../components/dashboard/BarChart'

const Dashboard = () => {
  return (
    <>
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4} xxl={3}>
          <QuickStatsChart title="Nhân viên mới" color="success" />
        </CCol>
        <CCol sm={6} xl={4} xxl={3}>
          <QuickStatsChart title="Thử việc thành công" color="warning" />
        </CCol>
        <CCol sm={6} xl={4} xxl={3}>
          <QuickStatsChart title="Nghỉ việc" color="danger" />
        </CCol>
        <CCol sm={6} xl={4} xxl={3}>
          <HumanResourceStats />
        </CCol>
      </CRow>
      <CRow className="mb-4" xs={{ gutter: 4 }} style={{ alignItems: 'stretch' }}>
        <CCol sm={6} xl={4} className="d-flex">
          <EmployeeStructureChart
            title="Cơ cấu nhân sự theo phòng ban"
            data={null}
            className="flex-fill w-100"
          />
        </CCol>
        <CCol sm={6} xl={4} className="d-flex">
          <EmployeeStructureChart
            title="Thống kê hợp đồng theo loại"
            data={undefined}
            className="flex-fill w-100"
          />
        </CCol>
        <CCol className="d-flex">
          <ReminderList className="flex-fill w-100" />
        </CCol>
      </CRow>

      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6}>
          <LineChart title="Biến động nhân sự" data={undefined} />
        </CCol>
        <CCol sm={6}>
          <BarChart title="Số lượng nhân sự" />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
