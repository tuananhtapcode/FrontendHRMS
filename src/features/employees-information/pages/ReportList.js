import { CCard, CCardBody, CCol, CRow, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilChartLine } from '@coreui/icons'
import styles from '../css.module.scss'

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
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h4 className="fw-bold mb-4">Danh sách báo cáo (Đang phát triển)</h4>

      <CRow xs={{ cols: 1, gutter: 3 }} md={{ cols: 2 }} lg={{ cols: 3 }}>
        {reports.map((report, index) => (
          <CCol key={index}>
            <CCard
              className={`h-100 shadow-sm border-0 ${styles.hoverCard}`} // dùng CSS module
              onClick={() => navigate(report.to)}
            >
              <CCardBody className="d-flex align-items-center gap-3">
                <div className={styles.iconWrapper}>
                  <CIcon icon={cilChartLine} size="lg" className="text-info" />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-semibold">{report.name}</h6>
                  <small className="text-muted">Nhấn để xem chi tiết</small>
                </div>
                <CButton color="info" variant="ghost" size="sm" shape="rounded-pill">
                  →
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  )
}

export default ReportList
