import { CCol, CRow } from '@coreui/react'

import QuickStatsChart from '../components/QuickStatsChart'
import HumanResourceStats from '../components/HumanResourceStats'
import EmployeeStructureChart from '../components/EmployeeStructureChart'
import ReminderList from '../components/ReminderList'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'

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
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4}>
          <EmployeeStructureChart title="Cơ cấu nhân sự theo phòng ban" data={null} />
        </CCol>
        <CCol sm={6} xl={4}>
          <EmployeeStructureChart title="Thống kê hợp đồng theo loại" data={undefined} />
        </CCol>
        <CCol>
          <ReminderList />
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
      {/* <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6}>
          <EmployeeStructureChart title="Cơ cấu nhân sự theo phòng ban" data={null} />
        </CCol>
        <CCol sm={6}>
          <EmployeeStructureChart title="Thống kê hợp đồng theo loại" data={undefined} />
        </CCol>
      </CRow> */}
    </>
  )
}

export default Dashboard
