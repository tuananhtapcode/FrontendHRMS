
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

// Import Icons
// Đã loại bỏ cilChevronBottom vì dùng style mặc định của form-select
import {
  cilCalendarCheck,
  cilCheck,
  cilMoon,
  cilWatch,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'

// Import Components con
import DashboardWidget from './components/dashboardWidget.jsx'
import EmptyData from './components/emptyData.jsx'
import StatCard from './components/statCard.jsx'

// Import API
import { timesheetApi } from '../../api/timesheetApi.js'

// === 1. HÀM TIỆN ÍCH NGÀY THÁNG ===
const getTodayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getMonthRange = () => {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return { start: formatDate(firstDay), end: formatDate(lastDay) }
}

const formatDateVN = (dateString) => {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-')
  return `${d}/${m}/${y}`
}

// === 2. COMPONENT CUSTOM MULTI-SELECT (ĐÃ SỬA: Dùng class form-select) ===
const CustomMultiSelect = ({ options, value, onChange, placeholder = "Chọn..." }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]
    onChange(newValue)
  }

  const removeTag = (e, option) => {
    e.stopPropagation()
    onChange(value.filter((item) => item !== option))
  }

  return (
    <div className="position-relative">
      {/* SỬ DỤNG CLASS 'form-select':
        - Tự động có mũi tên (background-image) chuẩn ở góc phải.
        - Padding phải tự động chừa chỗ cho mũi tên.
      */}
      <div 
        className="form-select d-flex flex-wrap gap-2 align-items-center" 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          height: 'auto', 
          minHeight: '38px', 
          cursor: 'pointer', 
          backgroundColor: '#fff',
          paddingRight: '2.5rem' // Đảm bảo text dài không đè lên mũi tên
        }}
      >
        {value.length === 0 && <span className="text-muted small">{placeholder}</span>}
        
        {value.map((item) => (
          <span key={item} className="badge bg-light text-dark border d-flex align-items-center px-2 py-1">
            {item}
            <CIcon 
              icon={cilX} 
              size="sm" 
              className="ms-2 text-secondary" 
              onClick={(e) => removeTag(e, item)}
              style={{ width: '12px', height: '12px', cursor: 'pointer' }}
            />
          </span>
        ))}
        {/* Không cần thêm icon mũi tên thủ công nữa */}
      </div>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1000 }} onClick={() => setIsOpen(false)}></div>
          <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 1001, maxHeight: '200px', overflowY: 'auto' }}>
            {options.map((opt) => {
              const isSelected = value.includes(opt)
              return (
                <div 
                  key={opt} 
                  className={`p-2 px-3 d-flex justify-content-between align-items-center ${isSelected ? 'bg-light text-primary fw-bold' : ''}`}
                  onClick={() => toggleOption(opt)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#f8f9fa' }}
                  onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span>{opt}</span>
                  {isSelected && <CIcon icon={cilCheck} size="sm" className="text-primary"/>}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// === 3. CÁC COMPONENT HIỂN THỊ DANH SÁCH ===
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

// === 4. COMPONENT CHÍNH ===
const OverviewPage = () => {
  const defaultMonth = getMonthRange() 

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [stats, setStats] = useState({ late: { value: 0 }, onLeave: { value: 0 }, plannedLeave: { value: 0 } })

  // Data States (Có currentPeriod)
  const [leaveByDept, setLeaveByDept] = useState({ loading: true, data: null, currentPeriod: defaultMonth })
  const [topOnLeave, setTopOnLeave] = useState({ loading: true, data: null, currentPeriod: defaultMonth })
  const [topLate, setTopLate] = useState({ loading: true, data: null, currentPeriod: defaultMonth })
  const [leaveType, setLeaveType] = useState({ loading: true, data: null, currentPeriod: defaultMonth })
  const [lateFrequency, setLateFrequency] = useState({ loading: true, data: null, currentPeriod: defaultMonth })
  
  const [activeSettings, setActiveSettings] = useState(null)
  
  // Form States
  const [leaveByDeptForm, setLeaveByDeptForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'this_month',
    startDate: defaultMonth.start,
    endDate: defaultMonth.end,
    leaveTypes: ['Nghỉ phép', 'Nghỉ không lương'],
    deptCount: 10,
  })

  const [topOnLeaveForm, setTopOnLeaveForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'this_month',
    startDate: defaultMonth.start,
    endDate: defaultMonth.end,
    leaveTypes: ['Nghỉ phép', 'Nghỉ không lương', 'Nghỉ kết hôn'],
    limitValue: 0,
  })

  const [topLateForm, setTopLateForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'this_month',
    startDate: defaultMonth.start,
    endDate: defaultMonth.end,
    statisticType: 'late_and_early',
    limitType: 'count',
    limitCount: 20,
    limitValue: 0,
  })

  const [leaveTypeForm, setLeaveTypeForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'this_month',
    startDate: defaultMonth.start,
    endDate: defaultMonth.end,
  })

  const [lateFrequencyForm, setLateFrequencyForm] = useState({
    orgStructure: 'all',
    reportPeriod: 'this_month',
    startDate: defaultMonth.start,
    endDate: defaultMonth.end,
    viewType: 'late_and_early',
  })

  // === FETCH ALL DATA ===
  const fetchAllData = useCallback(async () => {
    try {
      setIsPageLoading(true)
      const [statsRes, leaveByDeptRes, topOnLeaveRes, topLateRes, leaveTypeRes, lateFrequencyRes] = await Promise.all([
        timesheetApi.getStats(),
        timesheetApi.getLeaveByDept(leaveByDeptForm),
        timesheetApi.getTopOnLeave(topOnLeaveForm),
        timesheetApi.getTopLate(topLateForm),
        timesheetApi.getLeaveTypeAnalysis(leaveTypeForm),
        timesheetApi.getLateFrequency(lateFrequencyForm),
      ])

      setStats(statsRes.data)
      setLeaveByDept({ loading: false, data: leaveByDeptRes.data, currentPeriod: defaultMonth })
      setTopOnLeave({ loading: false, data: topOnLeaveRes.data, currentPeriod: defaultMonth })
      setTopLate({ loading: false, data: topLateRes.data, currentPeriod: defaultMonth })
      setLeaveType({ loading: false, data: leaveTypeRes.data, currentPeriod: defaultMonth })
      setLateFrequency({ loading: false, data: lateFrequencyRes.data, currentPeriod: defaultMonth })
    } catch (error) {
      console.error('Lỗi tải dữ liệu dashboard:', error)
    } finally {
      setIsPageLoading(false)
    }
  }, []) 

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // === RELOAD HANDLERS ===
  const handleReloadLeaveByDept = useCallback(async (settings = null) => {
    setLeaveByDept((prev) => ({ ...prev, loading: true }))
    try {
      const activeParams = settings || leaveByDeptForm
      const response = await timesheetApi.getLeaveByDept(activeParams)
      setLeaveByDept({ loading: false, data: response.data, currentPeriod: { start: activeParams.startDate, end: activeParams.endDate } })
    } catch (e) { setLeaveByDept((prev) => ({ ...prev, loading: false, data: null })) }
  }, [leaveByDeptForm])

  const handleReloadTopOnLeave = useCallback(async (settings = null) => {
    setTopOnLeave((prev) => ({ ...prev, loading: true }))
    try {
      const activeParams = settings || topOnLeaveForm
      const response = await timesheetApi.getTopOnLeave(activeParams)
      setTopOnLeave({ loading: false, data: response.data, currentPeriod: { start: activeParams.startDate, end: activeParams.endDate } })
    } catch (e) { setTopOnLeave((prev) => ({ ...prev, loading: false, data: null })) }
  }, [topOnLeaveForm])

  const handleReloadTopLate = useCallback(async (settings = null) => {
    setTopLate((prev) => ({ ...prev, loading: true }))
    try {
      const activeParams = settings || topLateForm
      const response = await timesheetApi.getTopLate(activeParams)
      setTopLate({ loading: false, data: response.data, currentPeriod: { start: activeParams.startDate, end: activeParams.endDate } })
    } catch (e) { setTopLate((prev) => ({ ...prev, loading: false, data: null })) }
  }, [topLateForm])

  const handleReloadLeaveType = useCallback(async (settings = null) => {
    setLeaveType((prev) => ({ ...prev, loading: true }))
    try {
      const activeParams = settings || leaveTypeForm
      const response = await timesheetApi.getLeaveTypeAnalysis(activeParams)
      setLeaveType({ loading: false, data: response.data, currentPeriod: { start: activeParams.startDate, end: activeParams.endDate } })
    } catch (e) { setLeaveType((prev) => ({ ...prev, loading: false, data: null })) }
  }, [leaveTypeForm])

  const handleReloadLateFrequency = useCallback(async (settings = null) => {
    setLateFrequency((prev) => ({ ...prev, loading: true }))
    try {
      const activeParams = settings || lateFrequencyForm
      const response = await timesheetApi.getLateFrequency(activeParams)
      setLateFrequency({ loading: false, data: response.data, currentPeriod: { start: activeParams.startDate, end: activeParams.endDate } })
    } catch (e) { setLateFrequency((prev) => ({ ...prev, loading: false, data: null })) }
  }, [lateFrequencyForm])

  // === FORM LOGIC ===
  const handlePeriodChange = (e, setFormFunc) => {
    const value = e.target.value
    let newStart = ''
    let newEnd = ''
    if (value === 'today') { newStart = getTodayString(); newEnd = getTodayString() } 
    else if (value === 'this_month') { const range = getMonthRange(); newStart = range.start; newEnd = range.end }
    
    setFormFunc(prev => ({
      ...prev,
      reportPeriod: value,
      startDate: value === 'custom' ? prev.startDate : newStart,
      endDate: value === 'custom' ? prev.endDate : newEnd
    }))
  }

  const handleSaveSettings = () => {
    if (activeSettings === 'leaveByDept') handleReloadLeaveByDept(leaveByDeptForm)
    else if (activeSettings === 'topOnLeave') handleReloadTopOnLeave(topOnLeaveForm)
    else if (activeSettings === 'topLate') handleReloadTopLate(topLateForm)
    else if (activeSettings === 'leaveType') handleReloadLeaveType(leaveTypeForm)
    else if (activeSettings === 'lateFrequency') handleReloadLateFrequency(lateFrequencyForm)
    setActiveSettings(null)
  }

  const openSettingsModal = (widgetName) => setActiveSettings(widgetName)
  const closeSettingsModal = () => setActiveSettings(null)
  
  const getModalTitle = () => {
    switch (activeSettings) {
      case 'leaveByDept': return 'Thiết lập (Tình hình nghỉ theo phòng ban)'
      case 'topOnLeave': return 'Thiết lập (Nhân viên nghỉ nhiều nhất)'
      case 'topLate': return 'Thiết lập (Nhân viên đi muộn...)'
      case 'leaveType': return 'Thiết lập (Phân tích loại nghỉ)'
      case 'lateFrequency': return 'Thiết lập (Tần suất đi muộn)'
      default: return 'Thiết lập'
    }
  }

  // === RENDER FORM ===
  const renderModalContent = () => {
    if (activeSettings === 'leaveByDept') {
      return (
        <CForm>
          <CRow className="mb-3">
             <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
             <CCol sm={8}><CFormSelect value={leaveByDeptForm.orgStructure} onChange={(e) => setLeaveByDeptForm(f => ({ ...f, orgStructure: e.target.value }))}><option value="all">Tất cả đơn vị</option><option value="unit1">Đơn vị 1</option></CFormSelect></CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}><CFormSelect value={leaveByDeptForm.reportPeriod} onChange={(e) => handlePeriodChange(e, setLeaveByDeptForm)}><option value="today">Hôm nay</option><option value="this_month">Tháng này</option><option value="custom">Tùy chọn</option></CFormSelect></CCol>
          </CRow>
          <CRow className="mb-3" style={{ display: leaveByDeptForm.reportPeriod === 'custom' ? 'flex' : 'none' }}>
            <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
            <CCol sm={4}><CFormInput type="date" value={leaveByDeptForm.startDate} onChange={(e) => setLeaveByDeptForm(f => ({ ...f, startDate: e.target.value }))} /></CCol>
            <CCol sm={4}><CFormInput type="date" value={leaveByDeptForm.endDate} onChange={(e) => setLeaveByDeptForm(f => ({ ...f, endDate: e.target.value }))} /></CCol>
          </CRow>
          
           <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Loại nghỉ</CFormLabel>
            <CCol sm={8}>
              <CustomMultiSelect 
                options={['Nghỉ phép', 'Nghỉ không lương', 'Nghỉ thai sản', 'Nghỉ bù', 'Nghỉ free']}
                value={leaveByDeptForm.leaveTypes}
                onChange={(newVal) => setLeaveByDeptForm(f => ({ ...f, leaveTypes: newVal }))}
                placeholder="Chọn loại nghỉ..."
              />
            </CCol>
          </CRow>
          
           <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Số lượng</CFormLabel>
            <CCol sm={8}><CFormInput type="number" value={leaveByDeptForm.deptCount} onChange={(e) => setLeaveByDeptForm(f => ({ ...f, deptCount: e.target.value }))} /></CCol>
          </CRow>
        </CForm>
      )
    }

    if (activeSettings === 'topOnLeave') {
      return (
        <CForm>
           <CRow className="mb-3">
             <CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel>
             <CCol sm={8}><CFormSelect value={topOnLeaveForm.orgStructure} onChange={(e) => setTopOnLeaveForm(f => ({ ...f, orgStructure: e.target.value }))}><option value="all">Tất cả đơn vị</option></CFormSelect></CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel>
            <CCol sm={8}><CFormSelect value={topOnLeaveForm.reportPeriod} onChange={(e) => handlePeriodChange(e, setTopOnLeaveForm)}><option value="today">Hôm nay</option><option value="this_month">Tháng này</option><option value="custom">Tùy chọn</option></CFormSelect></CCol>
          </CRow>
          <CRow className="mb-3" style={{ display: topOnLeaveForm.reportPeriod === 'custom' ? 'flex' : 'none' }}>
            <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
            <CCol sm={4}><CFormInput type="date" value={topOnLeaveForm.startDate} onChange={(e) => setTopOnLeaveForm(f => ({ ...f, startDate: e.target.value }))} /></CCol>
            <CCol sm={4}><CFormInput type="date" value={topOnLeaveForm.endDate} onChange={(e) => setTopOnLeaveForm(f => ({ ...f, endDate: e.target.value }))} /></CCol>
          </CRow>

           <CRow className="mb-3">
            <CFormLabel className="col-sm-4 col-form-label">Loại nghỉ</CFormLabel>
            <CCol sm={8}>
              <CustomMultiSelect 
                options={['Nghỉ phép', 'Nghỉ không lương', 'Nghỉ thai sản', 'Nghỉ bù', 'Nghỉ free', 'Nghỉ kết hôn', 'Nghỉ con kết hôn']}
                value={topOnLeaveForm.leaveTypes}
                onChange={(newVal) => setTopOnLeaveForm(f => ({ ...f, leaveTypes: newVal }))}
                placeholder="Chọn loại nghỉ..."
              />
            </CCol>
          </CRow>
          
          <CRow className="mb-3 align-items-center">
             <CFormLabel className="col-sm-4 col-form-label">Giới hạn hiển thị</CFormLabel>
             <CCol sm={8}><div className="d-flex align-items-center"><CFormCheck type="radio" label="Lớn hơn" checked={true} readOnly className="me-2" /><CFormInput type="number" value={topOnLeaveForm.limitValue} onChange={(e) => setTopOnLeaveForm(f => ({ ...f, limitValue: e.target.value }))} style={{ width: '80px' }} /></div></CCol>
          </CRow>
        </CForm>
      )
    }

    if (activeSettings === 'topLate') {
      return (
        <CForm>
          <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel><CCol sm={8}><CFormSelect value={topLateForm.orgStructure} onChange={(e) => setTopLateForm(f => ({ ...f, orgStructure: e.target.value }))}><option value="all">Tất cả đơn vị</option></CFormSelect></CCol></CRow>
          <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel><CCol sm={8}><CFormSelect value={topLateForm.reportPeriod} onChange={(e) => handlePeriodChange(e, setTopLateForm)}><option value="today">Hôm nay</option><option value="this_month">Tháng này</option><option value="custom">Tùy chọn</option></CFormSelect></CCol></CRow>
          <CRow className="mb-3" style={{ display: topLateForm.reportPeriod === 'custom' ? 'flex' : 'none' }}><CFormLabel className="col-sm-4 col-form-label"></CFormLabel><CCol sm={4}><CFormInput type="date" value={topLateForm.startDate} onChange={(e) => setTopLateForm(f => ({ ...f, startDate: e.target.value }))} /></CCol><CCol sm={4}><CFormInput type="date" value={topLateForm.endDate} onChange={(e) => setTopLateForm(f => ({ ...f, endDate: e.target.value }))} /></CCol></CRow>
           <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Thống kê theo</CFormLabel><CCol sm={8}><CFormSelect value={topLateForm.statisticType} onChange={(e) => setTopLateForm(f => ({ ...f, statisticType: e.target.value }))}><option value="late_and_early">Cả hai</option><option value="late_only">Đi muộn</option></CFormSelect></CCol></CRow>
           <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Giới hạn hiển thị</CFormLabel><CCol sm={8}><CFormInput type="number" value={topLateForm.limitCount} onChange={(e) => setTopLateForm(f => ({...f, limitCount: e.target.value}))}/></CCol></CRow>
        </CForm>
      )
    }

    if (activeSettings === 'leaveType') {
      return (
        <CForm>
          <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel><CCol sm={8}><CFormSelect value={leaveTypeForm.orgStructure} onChange={(e) => setLeaveTypeForm(f => ({ ...f, orgStructure: e.target.value }))}><option value="all">Tất cả đơn vị</option></CFormSelect></CCol></CRow>
          <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel><CCol sm={8}><CFormSelect value={leaveTypeForm.reportPeriod} onChange={(e) => handlePeriodChange(e, setLeaveTypeForm)}><option value="today">Hôm nay</option><option value="this_month">Tháng này</option><option value="custom">Tùy chọn</option></CFormSelect></CCol></CRow>
          <CRow className="mb-3" style={{ display: leaveTypeForm.reportPeriod === 'custom' ? 'flex' : 'none' }}><CFormLabel className="col-sm-4 col-form-label"></CFormLabel><CCol sm={4}><CFormInput type="date" value={leaveTypeForm.startDate} onChange={(e) => setLeaveTypeForm(f => ({ ...f, startDate: e.target.value }))} /></CCol><CCol sm={4}><CFormInput type="date" value={leaveTypeForm.endDate} onChange={(e) => setLeaveTypeForm(f => ({ ...f, endDate: e.target.value }))} /></CCol></CRow>
        </CForm>
      )
    }

    if (activeSettings === 'lateFrequency') {
      return (
        <CForm>
          <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Cơ cấu tổ chức</CFormLabel><CCol sm={8}><CFormSelect value={lateFrequencyForm.orgStructure} onChange={(e) => setLateFrequencyForm(f => ({ ...f, orgStructure: e.target.value }))}><option value="all">Tất cả đơn vị</option></CFormSelect></CCol></CRow>
          <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Kỳ báo cáo</CFormLabel><CCol sm={8}><CFormSelect value={lateFrequencyForm.reportPeriod} onChange={(e) => handlePeriodChange(e, setLateFrequencyForm)}><option value="today">Hôm nay</option><option value="this_month">Tháng này</option><option value="custom">Tùy chọn</option></CFormSelect></CCol></CRow>
          <CRow className="mb-3" style={{ display: lateFrequencyForm.reportPeriod === 'custom' ? 'flex' : 'none' }}><CFormLabel className="col-sm-4 col-form-label"></CFormLabel><CCol sm={4}><CFormInput type="date" value={lateFrequencyForm.startDate} onChange={(e) => setLateFrequencyForm(f => ({ ...f, startDate: e.target.value }))} /></CCol><CCol sm={4}><CFormInput type="date" value={lateFrequencyForm.endDate} onChange={(e) => setLateFrequencyForm(f => ({ ...f, endDate: e.target.value }))} /></CCol></CRow>
           <CRow className="mb-3"><CFormLabel className="col-sm-4 col-form-label">Xem theo</CFormLabel><CCol sm={8}><CFormSelect value={lateFrequencyForm.viewType} onChange={(e) => setLateFrequencyForm(f => ({ ...f, viewType: e.target.value }))}><option value="late_and_early">Cả hai</option></CFormSelect></CCol></CRow>
        </CForm>
      )
    }
    return null
  }

  // === MAIN RENDER ===
  if (isPageLoading) return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>

  const renderWidgetBody = (widgetState, renderChart, renderList) => {
    if (widgetState.loading) return <div className="d-flex justify-content-center align-items-center h-100"><CSpinner color="primary" /></div>
    if (widgetState.data && (!Array.isArray(widgetState.data) || widgetState.data.length > 0)) {
      if (renderChart) return renderChart(widgetState.data)
      if (renderList) return renderList(widgetState.data)
    }
    return <EmptyData />
  }

  return (
    <>
      <div style={{ padding: '16px' }}>
        <CRow className="mb-4" gutter={3}>
          <CCol sm={6} lg={4}><StatCard variant="orange" title="Đi muộn, về sớm" initialFilter="Hôm nay" icon={<CIcon icon={cilWatch} />}><div className="stat-card-body-main">{stats.late.value}</div></StatCard></CCol>
          <CCol sm={6} lg={4}><StatCard variant="blue" title="Thực tế nghỉ" initialFilter="Hôm nay" icon={<CIcon icon={cilMoon} />}><div className="stat-card-body-main">{stats.onLeave.value}</div></StatCard></CCol>
          <CCol sm={6} lg={4}><StatCard variant="green" title="Kế hoạch nghỉ" initialFilter="Ngày mai" icon={<CIcon icon={cilCalendarCheck} />}><div className="stat-card-body-main">{stats.plannedLeave.value}</div></StatCard></CCol>
        </CRow>

        <CRow className="mb-4" gutter={3}>
          <CCol md={4}>
            <DashboardWidget title="Tình hình nghỉ theo phòng ban" subtitle={`Tất cả đơn vị (${formatDateVN(leaveByDept.currentPeriod?.start)} - ${formatDateVN(leaveByDept.currentPeriod?.end)})`} unit="ĐVT: Ngày công" onReload={handleReloadLeaveByDept} onSettingsClick={() => openSettingsModal('leaveByDept')}>
              {renderWidgetBody(leaveByDept, (data) => <CChartBar data={data} />)}
            </DashboardWidget>
          </CCol>
          <CCol md={4}>
            <DashboardWidget title="Nhân viên nghỉ nhiều nhất" subtitle={`Tất cả đơn vị (${formatDateVN(topOnLeave.currentPeriod?.start)} - ${formatDateVN(topOnLeave.currentPeriod?.end)})`} onReload={handleReloadTopOnLeave} onSettingsClick={() => openSettingsModal('topOnLeave')}>
              {renderWidgetBody(topOnLeave, (data) => <EmployeeList employees={data} unit="ngày" unitColor="text-primary" />)}
            </DashboardWidget>
          </CCol>
          <CCol md={4}>
            <DashboardWidget title="Nhân viên đi muộn, về sớm" subtitle={`Tất cả đơn vị (${formatDateVN(topLate.currentPeriod?.start)} - ${formatDateVN(topLate.currentPeriod?.end)})`} onReload={handleReloadTopLate} onSettingsClick={() => openSettingsModal('topLate')}>
              {renderWidgetBody(topLate, (data) => <EmployeeList employees={data} unit="lần" unitColor="text-danger" />)}
            </DashboardWidget>
          </CCol>
        </CRow>

        <CRow className="mb-4" gutter={3}>
          <CCol md={8}>
            <DashboardWidget title="Phân tích loại nghỉ" subtitle={`Tất cả đơn vị (${formatDateVN(leaveType.currentPeriod?.start)} - ${formatDateVN(leaveType.currentPeriod?.end)})`} unit="ĐVT: Đơn" onReload={handleReloadLeaveType} onSettingsClick={() => openSettingsModal('leaveType')}>
              {renderWidgetBody(leaveType, (data) => <CChartDoughnut data={data} />)}
            </DashboardWidget>
          </CCol>
          <CCol md={4}>
            <DashboardWidget title="Tần suất đi muộn, về sớm" subtitle={`Tất cả đơn vị (${formatDateVN(lateFrequency.currentPeriod?.start)} - ${formatDateVN(lateFrequency.currentPeriod?.end)})`} onReload={handleReloadLateFrequency} onSettingsClick={() => openSettingsModal('lateFrequency')}>
              {renderWidgetBody(lateFrequency, (data) => <FrequencyList data={data} />)}
            </DashboardWidget>
          </CCol>
        </CRow>
      </div>

      <CModal visible={!!activeSettings} onClose={closeSettingsModal} alignment="center">
        <CModalHeader onClose={closeSettingsModal}><CModalTitle>{getModalTitle()}</CModalTitle></CModalHeader>
        <CModalBody style={{ minHeight: '300px' }}>
          {renderModalContent()}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={closeSettingsModal}>Hủy</CButton>
          <CButton color="primary" onClick={handleSaveSettings}>Lưu</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default OverviewPage