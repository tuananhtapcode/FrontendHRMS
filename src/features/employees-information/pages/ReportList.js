import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const reports = [
  {
    to: '/employees-information/report/employee-amount',
    name: 'Báo cáo thống kê số lượng nhân sự',
  },
  {
    to: '/employees-information/report/employee-fluctuation-situation',
    name: 'Báo cáo tình hình biến động nhân sự',
  },
  {
    to: '/employees-information/report/employee-new-recruit-termination',
    name: 'Báo cáo tình hình tuyển mới, nghỉ việc theo thời gian',
  },
  {
    to: '/employees-information/report/employee-in-department-over-time',
    name: 'Báo cáo số lượng nhân viên từng phòng ban theo thời gian',
  },
  {
    to: '/employees-information/report/employee-birthday',
    name: 'Báo cáo thống kê nhân viên sinh nhật',
  },
  {
    to: '/employees-information/report/employee-termination',
    name: 'Báo cáo thống kê nhân viên nghỉ việc',
  },
  {
    to: '/employees-information/report/employee-anniversary',
    name: 'Báo cáo kỷ niệm ngày vào làm việc',
  },
  {
    to: '/employees-information/report/change-salary-history',
    name: 'Báo cáo lịch sử lương của nhân viên',
  },
  {
    to: '/employees-information/report/employee-salary-adjustment',
    name: 'Báo cáo tình hình điều chỉnh lương của nhân viên',
  },
  {
    to: '/employees-information/report/vaccination-status',
    name: 'Báo cáo tình hình tiêm chủng của nhân viên',
  },
  {
    to: '/employees-information/report/statistic-schedule-vaccination',
    name: 'Báo cáo thống kê nhân viên đến lịch tiêm chủng',
  },
  {
    to: '/employees-information/report/employee-retirement',
    name: 'Báo cáo thống kê nhân viên đến tuổi nghỉ hưu',
  },
  {
    to: '/employees-information/report/employee-lack-of-paper',
    name: 'Báo cáo nhân viên chưa nộp đủ giấy tờ',
  },
]

const ReportList = () => {
  const navigate = useNavigate()

  return (
    <>
      <CTable hover responsive bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Tên báo cáo</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {reports.map((report, index) => (
            <CTableRow
              key={index}
              onClick={() => navigate(report.to)}
              style={{ cursor: 'pointer' }}
            >
              <CTableDataCell>{report.name}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default ReportList
