import { useCallback, useEffect, useState } from 'react'

// Import các component của CoreUI
import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'

// (Import biểu đồ, icons, components con... giữ nguyên)
import { cilCalendarCheck, cilMoon, cilWatch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import DashboardWidget from './components/dashboardWidget.jsx'
import EmptyData from './components/emptyData.jsx'
import StatCard from './components/statCard.jsx'

// Import file API (rất quan trọng)
import { timesheetApi } from '../../api/timesheetApi.js'

// (Các component con EmployeeList và FrequencyList giữ nguyên)
const EmployeeList = ({ employees, unit, unitColor = 'text-danger' }) => (
  <CListGroup flush className="w-100 custom-list-widget">
    {employees.map((emp) => (
      <CListGroupItem key={emp.id} className="d-flex justify-content-between">
        <div>
          <div className="fw-bold">{emp.name}</div>
          <small className="text-body-secondary">{emp.position}</small>
        </div>
        <span className={`fw-bold ${unitColor}`}>
          {emp.value} {unit}
        </span>
      </CListGroupItem>
    ))}
  </CListGroup>
)
const FrequencyList = ({ data }) => (
  <CListGroup flush className="w-100 custom-list-widget">
    {data.map((item) => (
      <CListGroupItem key={item.label} className="d-flex justify-content-between">
        <span>{item.label}</span>
        <span className="fw-bold">{item.count} người</span>
      </CListGroupItem>
    ))}
  </CListGroup>
)

// --- COMPONENT CHÍNH ---
const OverviewPage = () => {
  // (State của page, stats, widgets, modal... giữ nguyên)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [stats, setStats] = useState({ late: { value: 0 }, onLeave: { value: 0 }, plannedLeave: { value: 0 } })
  const [leaveByDept, setLeaveByDept] = useState({ loading: true, data: null })
  const [topOnLeave, setTopOnLeave] = useState({ loading: true, data: null })
  const [topLate, setTopLate] = useState({ loading: true, data: null })
  const [leaveType, setLeaveType] = useState({ loading: true, data: null })
  const [lateFrequency, setLateFrequency] = useState({ loading: true, data: null })
  const [activeSettings, setActiveSettings] = useState(null)
  
  // (State của 5 form... giữ nguyên)
  const [leaveByDeptForm, setLeaveByDeptForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'custom',
    startDate: '2025-11-19',
    endDate: '2025-11-30',
    leaveTypes: ['Nghỉ phép', 'Nghỉ không lương'],
    deptCount: 10,
  })
  const [topOnLeaveForm, setTopOnLeaveForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'custom',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    leaveTypes: ['Nghỉ phép', 'Nghỉ không lương', 'Nghỉ kết hôn', 'Nghỉ con kết hôn'],
    limitValue: 0,
  })
  const [topLateForm, setTopLateForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'custom', // Đổi thành 'custom' (Tùy chọn)
    startDate: '2025-11-01', // Thêm ngày
    endDate: '2025-11-30', // Thêm ngày
    statisticType: 'late_and_early', // Thêm loại thống kê
    limitType: 'count', // 'count' hoặc 'value'
    limitCount: 20, // Giới hạn số lượng
    limitValue: 0,
  })
  const [leaveTypeForm, setLeaveTypeForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'custom',
    startDate: '2025-11-01', // Thêm ngày
    endDate: '2025-11-30',
  })
  const [lateFrequencyForm, setLateFrequencyForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'custom',
    startDate: '2025-11-01', // Thêm ngày
    endDate: '2025-11-30', // Thêm ngày
    viewType: 'late_and_early',
  })

  // === 2. SỬA LẠI HÀM TẢI DỮ LIỆU ===
  const fetchAllData = useCallback(async () => {
    try {
      setIsPageLoading(true)
      const [
        statsRes,
        leaveByDeptRes,
        topOnLeaveRes,
        topLateRes,
        leaveTypeRes,
        lateFrequencyRes,
      ] = await Promise.all([
        timesheetApi.getStats(), // Tải với cài đặt mặc định
        timesheetApi.getLeaveByDept(),
        timesheetApi.getTopOnLeave(),
        timesheetApi.getTopLate(),
        timesheetApi.getLeaveTypeAnalysis(),
        timesheetApi.getLateFrequency(),
      ])

      setStats(statsRes.data)
      setLeaveByDept({ loading: false, data: leaveByDeptRes.data })
      setTopOnLeave({ loading: false, data: topOnLeaveRes.data })
      setTopLate({ loading: false, data: topLateRes.data })
      setLeaveType({ loading: false, data: leaveTypeRes.data })
      setLateFrequency({ loading: false, data: lateFrequencyRes.data })
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error)
    } finally {
      setIsPageLoading(false)
    }
  }, []) // <-- SỬA LỖI 1: XÓA HẾT DEPENDENCY. Chỉ chạy 1 lần.

  useEffect(() => {
    fetchAllData() // Tải dữ liệu lần đầu
  }, [fetchAllData])

  // === 3. SỬA LẠI CÁC HÀM RELOAD ===
  // (Xóa dependency array để chúng không bị tạo lại khi state form thay đổi)

  const handleReloadLeaveByDept = useCallback(async (settings = null) => {
    setLeaveByDept((prev) => ({ ...prev, loading: true }))
    try {
      // Dùng 'settings' được truyền vào, HOẶC state 'leaveByDeptForm' MỚI NHẤT
      const response = await timesheetApi.getLeaveByDept(settings || leaveByDeptForm)
      setLeaveByDept({ loading: false, data: response.data })
    } catch (e) {
      setLeaveByDept({ loading: false, data: null })
    }
  }, []) // <-- SỬA LỖI 2: Xóa [leaveByDeptForm]

  const handleReloadTopOnLeave = useCallback(async (settings = null) => {
    setTopOnLeave((prev) => ({ ...prev, loading: true }))
    try {
      const response = await timesheetApi.getTopOnLeave(settings || topOnLeaveForm)
      setTopOnLeave({ loading: false, data: response.data })
    } catch (e) {
      setTopOnLeave({ loading: false, data: null })
    }
  }, []) // <-- SỬA LỖI 3: Xóa [topOnLeaveForm]

  const handleReloadTopLate = useCallback(async (settings = null) => {
    setTopLate((prev) => ({ ...prev, loading: true }))
    try {
      const response = await timesheetApi.getTopLate(settings || topLateForm)
      setTopLate({ loading: false, data: response.data })
    } catch (e) {
      setTopLate({ loading: false, data: null })
    }
  }, []) // <-- SỬA LỖI 4: Xóa [topLateForm]

  const handleReloadLeaveType = useCallback(async (settings = null) => {
    setLeaveType((prev) => ({ ...prev, loading: true }))
    try {
      const response = await timesheetApi.getLeaveTypeAnalysis(settings || leaveTypeForm)
      setLeaveType({ loading: false, data: response.data })
    } catch (e) {
      setLeaveType({ loading: false, data: null })
    }
  }, []) // <-- SỬA LỖI 5: Xóa [leaveTypeForm]

  const handleReloadLateFrequency = useCallback(async (settings = null) => {
    setLateFrequency((prev) => ({ ...prev, loading: true }))
    try {
      const response = await timesheetApi.getLateFrequency(settings || lateFrequencyForm)
      setLateFrequency({ loading: false, data: response.data })
    } catch (e) {
      setLateFrequency({ loading: false, data: null })
    }
  }, []) // <-- SỬA LỖI 6: Xóa [lateFrequencyForm]

  // === 4. HÀM LƯU CÀI ĐẶT (Đã đúng) ===
  const handleSaveSettings = () => {
    console.log(`Lưu cài đặt cho widget: ${activeSettings}`)
    
    // Tùy vào modal nào đang mở, gọi hàm reload tương ứng
    // Hàm reload sẽ tự động đọc state MỚI NHẤT của form
    if (activeSettings === 'leaveByDept') {
      handleReloadLeaveByDept(leaveByDeptForm)
    } else if (activeSettings === 'topOnLeave') {
      handleReloadTopOnLeave(topOnLeaveForm)
    } else if (activeSettings === 'topLate') {
      handleReloadTopLate(topLateForm)
    } else if (activeSettings === 'leaveType') {
      handleReloadLeaveType(leaveTypeForm)
    } else if (activeSettings === 'lateFrequency') {
      handleReloadLateFrequency(lateFrequencyForm)
    }

    setActiveSettings(null) // Đóng modal
  }

  // (Các hàm Modal: open, close, getTitle, renderContent... giữ nguyên)
  const openSettingsModal = (widgetName) => {
    setActiveSettings(widgetName)
  }
  const closeSettingsModal = () => {
    setActiveSettings(null)
  }
  const getModalTitle = () => {
    switch (activeSettings) {
      case 'leaveByDept':
        return 'Thiết lập (Tình hình nghỉ theo phòng ban)'
      case 'topOnLeave':
        return 'Thiết lập (Nhân viên nghỉ nhiều nhất)'
      case 'topLate':
        return 'Thiết lập (Nhân viên đi muộn...)'
      case 'leaveType':
        return 'Thiết lập (Phân tích loại nghỉ)'
      case 'lateFrequency':
        return 'Thiết lập (Tần suất đi muộn)'
      default:
        return 'Thiết lập'
    }
  }

  // Render 5 form đầy đủ (Giữ nguyên)
  const renderModalContent = () => {
    // Case 1: Form "Tình hình nghỉ"
    if (activeSettings === 'leaveByDept') {
      return (
        <CForm>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={leaveByDeptForm.orgStructure}
                onChange={(e) =>
                  setLeaveByDeptForm((f) => ({ ...f, orgStructure: e.target.value }))
                }
              >
                <option value="all">Tất cả đơn vị</option>
                <option value="unit1">Đơn vị 1</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={leaveByDeptForm.reportPeriod}
                onChange={(e) =>
                  setLeaveByDeptForm((f) => ({ ...f, reportPeriod: e.target.value }))
                }
              >
                <option value="today">Hôm nay</option>
                <option value="this_month">Tháng này</option>
                <option value="custom">Tùy chọn</option>
              </CFormSelect>
            </CCol>
          </CRow>
          {leaveByDeptForm.reportPeriod === 'custom' && (
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={leaveByDeptForm.startDate}
                  onChange={(e) =>
                    setLeaveByDeptForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </CCol>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={leaveByDeptForm.endDate}
                  onChange={(e) =>
                    setLeaveByDeptForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </CCol>
            </CRow>
          )}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Loại nghỉ</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={leaveByDeptForm.leaveTypes}
                onChange={(e) =>
                  setLeaveByDeptForm((f) => ({
                    ...f,
                    leaveTypes: Array.from(e.target.selectedOptions, (opt) => opt.value),
                  }))
                }
                multiple
                style={{ height: '100px' }}
              >
                <option value="Nghỉ phép">Nghỉ phép</option>
                <option value="Nghỉ không lương">Nghỉ không lương</option>
                <option value="Nghỉ ốm">Nghỉ ốm</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Số lượng phòng ban</CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="number"
                value={leaveByDeptForm.deptCount}
                onChange={(e) =>
                  setLeaveByDeptForm((f) => ({ ...f, deptCount: e.target.value }))
                }
              />
            </CCol>
          </CRow>
        </CForm>
      )
    }

    // Case 2: Form "Nhân viên nghỉ nhiều nhất"
    if (activeSettings === 'topOnLeave') {
      return (
        <CForm>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={topOnLeaveForm.orgStructure}
                onChange={(e) =>
                  setTopOnLeaveForm((f) => ({ ...f, orgStructure: e.target.value }))
                }
              >
                <option value="all">Tất cả đơn vị</option>
                <option value="unit1">Phòng Kỹ thuật</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={topOnLeaveForm.reportPeriod}
                onChange={(e) =>
                  setTopOnLeaveForm((f) => ({ ...f, reportPeriod: e.target.value }))
                }
              >
                <option value="custom">Tùy chọn</option>
                <option value="today">Hôm nay</option>
                <option value="this_month">Tháng này</option>
              </CFormSelect>
            </CCol>
          </CRow>
          {topOnLeaveForm.reportPeriod === 'custom' && (
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={topOnLeaveForm.startDate}
                  onChange={(e) =>
                    setTopOnLeaveForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </CCol>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={topOnLeaveForm.endDate}
                  onChange={(e) =>
                    setTopOnLeaveForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </CCol>
            </CRow>
          )}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Loại nghỉ</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={topOnLeaveForm.leaveTypes}
                onChange={(e) =>
                  setTopOnLeaveForm((f) => ({
                    ...f,
                    leaveTypes: Array.from(e.target.selectedOptions, (opt) => opt.value),
                  }))
                }
                multiple
                style={{ height: '120px' }}
              >
                <option value="Nghỉ phép">Nghỉ phép</option>
                <option value="Nghỉ không lương">Nghỉ không lương</option>
                <option value="Nghỉ ốm">Nghỉ ốm</option>
                <option value="Nghỉ kết hôn">Nghỉ kết hôn</option>
                <option value="Nghỉ con kết hôn">Nghỉ con kết hôn</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3 align-items-center">
            <CFormLabel className="col-sm-4 col-form-label">Giới hạn hiển thị</CFormLabel>
            <CCol sm={8}>
              <div className="d-flex align-items-center">
                <CFormCheck
                  type="radio"
                  id="limitByDays"
                  name="limitType"
                  label="Theo số ngày nghỉ: Lớn hơn"
                  checked={true} // Luôn được chọn
                  readOnly
                  className="me-2"
                />
                <CFormInput
                  type="number"
                  value={topOnLeaveForm.limitValue}
                  onChange={(e) =>
                    setTopOnLeaveForm((f) => ({ ...f, limitValue: e.target.value }))
                  }
                  style={{ width: '80px' }}
                />
              </div>
            </CCol>
          </CRow>
        </CForm>
      )
    }

    // Case 3: Form "Nhân viên đi muộn"
    if (activeSettings === 'topLate') {
      return (
        <CForm>
          {/* 1. Cơ cấu tổ chức */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={topLateForm.orgStructure}
                onChange={(e) =>
                  setTopLateForm((f) => ({ ...f, orgStructure: e.target.value }))
                }
              >
                <option value="all">Tất cả đơn vị</option>
                <option value="unit1">Phòng Kỹ thuật</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* 2. Kỳ báo cáo */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={topLateForm.reportPeriod}
                onChange={(e) =>
                  setTopLateForm((f) => ({ ...f, reportPeriod: e.target.value }))
                }
              >
                <option value="custom">Tùy chọn</option>
                <option value="today">Hôm nay</option>
                <option value="this_month">Tháng này</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* 3. Ngày (chỉ hiện khi là 'Tùy chọn') */}
          {topLateForm.reportPeriod === 'custom' && (
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={topLateForm.startDate}
                  onChange={(e) =>
                    setTopLateForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </CCol>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={topLateForm.endDate}
                  onChange={(e) =>
                    setTopLateForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </CCol>
            </CRow>
          )}

          {/* 4. Thống kê theo */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Thống kê theo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={topLateForm.statisticType}
                onChange={(e) =>
                  setTopLateForm((f) => ({ ...f, statisticType: e.target.value }))
                }
              >
                <option value="late_and_early">Số lần đi muộn, về sớm</option>
                <option value="late_only">Số lần đi muộn</option>
                <option value="early_only">Số lần về sớm</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* 5. Giới hạn hiển thị (2 radio) */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Giới hạn hiển thị</CFormLabel>
            <CCol sm={8}>
              {/* Radio 1 */}
              <div className="d-flex align-items-center mb-2">
                <CFormCheck
                  type="radio"
                  id="limitByCount"
                  name="limitType"
                  label="Theo số lượng nhân viên"
                  value="count"
                  checked={topLateForm.limitType === 'count'}
                  onChange={(e) => setTopLateForm((f) => ({ ...f, limitType: e.target.value }))}
                  className="me-2"
                />
                <CFormInput
                  type="number"
                  value={topLateForm.limitCount}
                  onChange={(e) =>
                    setTopLateForm((f) => ({ ...f, limitCount: e.target.value }))
                  }
                  disabled={topLateForm.limitType !== 'count'}
                  style={{ width: '80px' }}
                />
              </div>
              {/* Radio 2 */}
              <div className="d-flex align-items-center">
                <CFormCheck
                  type="radio"
                  id="limitByValue"
                  name="limitType"
                  label="Theo số lần đi muộn, về sớm: Lớn hơn"
                  value="value"
                  checked={topLateForm.limitType === 'value'}
                  onChange={(e) => setTopLateForm((f) => ({ ...f, limitType: e.target.value }))}
                  className="me-2"
                />
                <CFormInput
                  type="number"
                  value={topLateForm.limitValue}
                  onChange={(e) =>
                    setTopLateForm((f) => ({ ...f, limitValue: e.target.value }))
                  }
                  disabled={topLateForm.limitType !== 'value'}
                  style={{ width: '80px' }}
                />
              </div>
            </CCol>
          </CRow>
        </CForm>
      )
    }

    // Case 4: Form "Phân tích loại nghỉ" (Form mới theo yêu cầu)
    if (activeSettings === 'leaveType') {
      return (
        <CForm>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={leaveTypeForm.orgStructure}
                onChange={(e) =>
                  setLeaveTypeForm((f) => ({ ...f, orgStructure: e.target.value }))
                }
              >
                <option value="all">Tất cả đơn vị</option>
                <option value="unit1">Phòng Kỹ thuật</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={leaveTypeForm.reportPeriod}
                onChange={(e) =>
                  setLeaveTypeForm((f) => ({ ...f, reportPeriod: e.target.value }))
                }
              >
                <option value="custom">Tùy chọn</option>
                <option value="today">Hôm nay</option>
                <option value="this_month">Tháng này</option>
              </CFormSelect>
            </CCol>
          </CRow>
          {leaveTypeForm.reportPeriod === 'custom' && (
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={leaveTypeForm.startDate}
                  onChange={(e) =>
                    setLeaveTypeForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </CCol>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={leaveTypeForm.endDate}
                  onChange={(e) =>
                    setLeaveTypeForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </CCol>
            </CRow>
          )}
        </CForm>
      )
    }

    // Case 5: Form "Tần suất đi muộn, về sớm" (Form phức tạp như ảnh)
    if (activeSettings === 'lateFrequency') {
      return (
        <CForm>
          {/* 1. Cơ cấu tổ chức */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={lateFrequencyForm.orgStructure}
                onChange={(e) =>
                  setLateFrequencyForm((f) => ({ ...f, orgStructure: e.target.value }))
                }
              >
                <option value="all">Tất cả đơn vị</option>
                <option value="unit1">Phòng Kỹ thuật</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* 2. Kỳ báo cáo */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={lateFrequencyForm.reportPeriod}
                onChange={(e) =>
                  setLateFrequencyForm((f) => ({ ...f, reportPeriod: e.target.value }))
                }
              >
                <option value="custom">Tùy chọn</option>
                <option value="today">Hôm nay</option>
                <option value="this_month">Tháng này</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* 3. Ngày (chỉ hiện khi là 'Tùy chọn') */}
          {lateFrequencyForm.reportPeriod === 'custom' && (
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={lateFrequencyForm.startDate}
                  onChange={(e) =>
                    setLateFrequencyForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </CCol>
              <CCol sm={4}>
                <CFormInput
                  type="date"
                  value={lateFrequencyForm.endDate}
                  onChange={(e) =>
                    setLateFrequencyForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </CCol>
            </CRow>
          )}

          {/* 4. Xem theo */}
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Xem theo</CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                value={lateFrequencyForm.viewType}
                onChange={(e) =>
                  setLateFrequencyForm((f) => ({ ...f, viewType: e.target.value }))
                }
              >
                <option value="late_and_early">Số lần đi muộn, về sớm</option>
                <option value="late_only">Số lần đi muộn</option>
                <option value="early_only">Số lần về sớm</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      )
    }

    return null
  }
  // --- Hết phần render form ---

  // === 5. SỬA LẠI JSX ===

  // Hiển thị loading spinner (chỉ 1 lần đầu)
  if (isPageLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    )
  }

  // Hàm helper để render nội dung widget (Spinner HOẶC Data HOẶC Empty)
  const renderWidgetBody = (widgetState, renderChart, renderList) => {
    // Nếu đang loading (của riêng widget này)
    if (widgetState.loading) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <CSpinner color="primary" />
        </div>
      )
    }
    // Nếu có data
    if (widgetState.data && (!Array.isArray(widgetState.data) || widgetState.data.length > 0)) {
      if (renderChart) return renderChart(widgetState.data)
      if (renderList) return renderList(widgetState.data)
    }
    // Nếu không có data
    return <EmptyData />
  }

  return (
    <>
      <div style={{ padding: '16px' }}>
        {/* HÀNG 1: STATCARD (Sửa lại để dùng state 'stats') */}
        <CRow className="mb-4" gutter={3}>
          <CCol sm={6} lg={4}>
            <StatCard
              variant="orange"
              title="Đi muộn, về sớm"
              initialFilter="Hôm nay"
              icon={<CIcon icon={cilWatch} />}
            >
              {/* Dùng state 'stats' thay vì 'data.stats' */}
              <div className="stat-card-body-main">{stats.late.value}</div>
            </StatCard>
          </CCol>
          <CCol sm={6} lg={4}>
            <StatCard
              variant="blue"
              title="Thực tế nghỉ"
              initialFilter="Hôm nay"
              icon={<CIcon icon={cilMoon} />}
            >
              <div className="stat-card-body-main">{stats.onLeave.value}</div>
            </StatCard>
          </CCol>
          <CCol sm={6} lg={4}>
            <StatCard
              variant="green"
              title="Kế hoạch nghỉ"
              initialFilter="Ngày mai"
              icon={<CIcon icon={cilCalendarCheck} />}
            >
              <div className="stat-card-body-main">{stats.plannedLeave.value}</div>
            </StatCard>
          </CCol>
        </CRow>

        {/* HÀNG 2: 3 WIDGET (Truyền hàm reload CỤ THỂ) */}
        <CRow className="mb-4" gutter={3}>
          <CCol md={4}>
            <DashboardWidget
              title="Tình hình nghỉ theo phòng ban"
              subtitle="Tất cả đơn vị (01/11/2025 - 30/11/2025)"
              unit="ĐVT: Ngày công"
              onReload={handleReloadLeaveByDept} // <-- SỬA LẠI
              onSettingsClick={() => openSettingsModal('leaveByDept')}
            >
              {/* Sửa lại cách render body */}
              {renderWidgetBody(leaveByDept, (data) => <CChartBar data={data} />)}
            </DashboardWidget>
          </CCol>

          <CCol md={4}>
            <DashboardWidget
              title="Nhân viên nghỉ nhiều nhất"
              subtitle="Tất cả đơn vị (01/11/2025 - 30/11/2025)"
              onReload={handleReloadTopOnLeave} // <-- SỬA LẠI
              onSettingsClick={() => openSettingsModal('topOnLeave')}
            >
              {renderWidgetBody(topOnLeave, (data) => (
                <EmployeeList employees={data} unit="ngày" unitColor="text-primary" />
              ))}
            </DashboardWidget>
          </CCol>

          <CCol md={4}>
            <DashboardWidget
              title="Nhân viên đi muộn, về sớm n..."
              subtitle="Tất cả đơn vị (01/11/2025 - 30/11/2025)"
              onReload={handleReloadTopLate} // <-- SỬA LẠI
              onSettingsClick={() => openSettingsModal('topLate')}
            >
              {renderWidgetBody(topLate, (data) => (
                <EmployeeList employees={data} unit="lần" unitColor="text-danger" />
              ))}
            </DashboardWidget>
          </CCol>
        </CRow>

        {/* HÀNG 3: 2 WIDGET (Truyền hàm reload CỤ THỂ) */}
        <CRow className="mb-4" gutter={3}>
          <CCol md={8}>
            <DashboardWidget
              title="Phân tích loại nghỉ"
              subtitle="Tất cả đơn vị (01/11/2025 - 30/11/2025)"
              unit="ĐVT: Đơn"
              onReload={handleReloadLeaveType} // <-- SỬA LẠI
              onSettingsClick={() => openSettingsModal('leaveType')}
            >
              {renderWidgetBody(leaveType, (data) => <CChartDoughnut data={data} />)}
            </DashboardWidget>
          </CCol>

          <CCol md={4}>
            <DashboardWidget
              title="Tần suất đi muộn, về sớm"
              subtitle="Tất cả đơn vị (01/11/2025 - 30/11/2025)"
              onReload={handleReloadLateFrequency} // <-- SỬA LẠI
              onSettingsClick={() => openSettingsModal('lateFrequency')}
            >
              {renderWidgetBody(lateFrequency, (data) => <FrequencyList data={data} />)}
            </DashboardWidget>
          </CCol>
        </CRow>
      </div>

      {/* --- MODAL CHUNG (Giữ nguyên) --- */}
      <CModal
        visible={!!activeSettings}
        onClose={closeSettingsModal}
        alignment="center"
      >
        <CModalHeader onClose={closeSettingsModal}>
          <CModalTitle>{getModalTitle()}</CModalTitle>
        </CModalHeader>
        <CModalBody key={activeSettings}>{renderModalContent()}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={closeSettingsModal}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleSaveSettings}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default OverviewPage