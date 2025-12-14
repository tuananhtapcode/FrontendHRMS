import {
  cilDescription,
  cilFilter,
  cilInfo,
  cilPlus,
  cilReload,
  cilSearch,
  cilSettings,
  cilWarning,
  cilCalendar,
  cilTrash,
  cilChevronBottom,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../../scss/components-page.scss'

// ✅ API thật
import { fetchPayrollPeriods } from '../../api/masterDataApi';
import { calculatePayrollBatch, fetchPayrolls } from '../../api/payrollApi'
import PayrollDetailModal from '../../components/PayrollDetailModal'

// --- 1. CẤU HÌNH CỘT ---
const COLUMN_CONFIG = [
  { key: 'name', label: 'Tên bảng lương' },
  { key: 'unit', label: 'Đơn vị áp dụng' },
  { key: 'period', label: 'Kỳ lương' },
  { key: 'position', label: 'Vị trí áp dụng' },
  { key: 'laborType', label: 'Tính chất lao động' },
  { key: 'payrollType', label: 'Loại bảng lương' },
  { key: 'inReport', label: 'Tính vào báo cáo' },
  { key: 'ruleName', label: 'Quy tắc tính lương' },
  { key: 'status', label: 'Trạng thái' },
]

const INITIAL_VISIBLE_COLUMNS = COLUMN_CONFIG.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {})

// --- 2. CẤU HÌNH BỘ LỌC ---
const FILTER_CONFIG = [
  { key: 'name', label: 'Tên bảng lương' },
  { key: 'period', label: 'Kỳ lương' },
  { key: 'position', label: 'Vị trí áp dụng' },
  { key: 'laborType', label: 'Tính chất lao động' },
  { key: 'inReport', label: 'Tính vào báo cáo' },
  { key: 'ruleName', label: 'Quy tắc tính lương' },
  { key: 'status', label: 'Trạng thái' },
]

const DEFAULT_FILTER_VALUES = {
  name: '',
  period: '',
  position: '',
  laborType: '',
  inReport: '',
  ruleName: '',
  status: '',
}

// ===== helpers =====
const formatVND = (n) => {
  if (n == null) return '—'
  try {
    return new Intl.NumberFormat('vi-VN').format(Number(n)) + ' đ'
  } catch {
    return String(n)
  }
}

const getDefaultMonth = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

const PayrollPage = () => {
  const navigate = useNavigate()

  // --- DATA ---
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // ✅ Periods (API thật)
  const [periods, setPeriods] = useState([])
  
  // ❌ ĐÃ XÓA: const [periodId, setPeriodId] = useState(null) -> Không cần thiết nữa

  // --- MODALS & OFFCANVAS ---
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // --- HEADER FILTERS ---
  const [q, setQ] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)
  const [unitFilter, setUnitFilter] = useState('')
  const [scopeFilter, setScopeFilter] = useState('all')

  // --- SETTINGS CỘT ---
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [tempColumns, setTempColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [colSearch, setColSearch] = useState('')

  // --- OFFCANVAS FILTER ---
  const [filterSearch, setFilterSearch] = useState('')
  const [draftActiveFilters, setDraftActiveFilters] = useState([])
  const [draftFilterValues, setDraftFilterValues] = useState(DEFAULT_FILTER_VALUES)
  const [appliedActiveFilters, setAppliedActiveFilters] = useState([])
  const [appliedFilterValues, setAppliedFilterValues] = useState(DEFAULT_FILTER_VALUES)

  // =========================
  // ADD MODAL FORM STATE
  // =========================
  const [addExcludeFromReport, setAddExcludeFromReport] = useState(false)
  const [addPayrollKind, setAddPayrollKind] = useState('detail')
  const [addPeriodIndex, setAddPeriodIndex] = useState(1)
  const [addMonth, setAddMonth] = useState(getDefaultMonth())
  const [addUnit, setAddUnit] = useState('Thuận Nguyễn Phúc')
  const [addPosition, setAddPosition] = useState('')
  const [addLaborType, setAddLaborType] = useState('')
  const [addPayrollName, setAddPayrollName] = useState('')
  const [addSalaryData, setAddSalaryData] = useState(
    'Bảng chấm công tổng hợp 01/12/2025 - 31/12/2025 - Thuận Nguyễn Phúc',
  )

  const monthLabel = useMemo(() => {
    if (!addMonth || addMonth.length < 7) return ''
    const [y, m] = addMonth.split('-')
    return `${m}/${y}`
  }, [addMonth])

  useEffect(() => {
    const unitPart = addUnit ? ` - ${addUnit}` : ''
    const name = `Bảng lương Kỳ ${addPeriodIndex} - Tháng ${monthLabel}${unitPart}`
    setAddPayrollName(name)
  }, [addPeriodIndex, monthLabel, addUnit])

  const resetAddForm = () => {
    setAddExcludeFromReport(false)
    setAddPayrollKind('detail')
    setAddPeriodIndex(1)
    setAddMonth(getDefaultMonth())
    setAddUnit('Thuận Nguyễn Phúc')
    setAddPosition('')
    setAddLaborType('')
    setAddSalaryData('Bảng chấm công tổng hợp 01/12/2025 - 31/12/2025 - Thuận Nguyễn Phúc')
  }

  // ... bên trong component PayrollPage
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPayrollId, setSelectedPayrollId] = useState(null)

  // Hàm xử lý khi click vào dòng
  const handleRowClick = (item) => {
    // item là object data của dòng trong bảng (chứa payrollId)
    if (item.payrollId) {
      setSelectedPayrollId(item.payrollId)
      setShowDetailModal(true)
    }
  }

  // =========================================================
  // ✅ LOGIC TẢI DỮ LIỆU MỚI (TẢI TẤT CẢ VÀ GỘP)
  // =========================================================

  const mapApiPayrollToUIRow = (item, periodLabel) => {
    const employeeName = item?.employeeName || `NV#${item?.employeeId ?? '—'}`
    const totalSalaryText = formatVND(item?.totalSalary)

    return {
      // Tạo ID duy nhất bằng cách kết hợp ID và tên kỳ (đề phòng trùng ID giữa các kỳ)
      id: `${item.payrollId}_${periodLabel}`, 
      payrollId: item.payrollId,
      employeeId: item.employeeId,
      name: `Bảng lương - ${employeeName} (${totalSalaryText})`,
      
      // Placeholder data cho UI
      unit: addUnit || '—',
      period: periodLabel || '—', // ✅ Hiển thị tên kỳ lương tương ứng
      position: addPosition || 'Tất cả',
      laborType: addLaborType || 'Toàn thời gian',
      payrollType: addPayrollKind === 'summary' ? 'Tổng hợp' : 'Chi tiết',
      inReport: !addExcludeFromReport,
      ruleName: 'Quy tắc tính lương mặc định',
      status: 'Đang áp dụng',
    }
  }

  // Hàm helper: Fetch toàn bộ trang của 1 kỳ
  const fetchAllPayrollsByPeriod = async (pId) => {
    const size = 200
    const first = await fetchPayrolls({ periodId: pId, page: 0, size })
    const content = first?.content || []
    const totalPages = first?.totalPages || 1

    // Giới hạn fetch tối đa 5 trang để tránh quá tải
    const MAX_PAGES = 5
    const pagesToFetch = []
    for (let i = 1; i < totalPages && i < MAX_PAGES; i++) pagesToFetch.push(i)

    if (pagesToFetch.length === 0) return content

    const rest = await Promise.all(
      pagesToFetch.map((pg) => fetchPayrolls({ periodId: pId, page: pg, size }).catch(() => null)),
    )

    const merged = [...content]
    rest.forEach((r) => {
      if (r?.content?.length) merged.push(...r.content)
    })
    return merged
  }

  // ✅ Hàm chính: Load Period -> Load All Data -> Gộp
  const loadDataSequence = async () => {
    setLoading(true)
    setApiError('')
    try {
      // 1. Lấy danh sách kỳ lương
      const listPeriods = await fetchPayrollPeriods()
      setPeriods(listPeriods || [])

      if (!listPeriods || listPeriods.length === 0) {
        setData([])
        setLoading(false)
        return
      }

      // 2. Duyệt qua từng kỳ và tải dữ liệu
      let allPayrollData = []
      
      const promises = listPeriods.map(async (p) => {
         // Tải data của kỳ p.payrollPeriodId
         const payrolls = await fetchAllPayrollsByPeriod(p.payrollPeriodId)
         // Map luôn tại đây để gắn đúng tên kỳ (p.name)
         return payrolls.map(item => mapApiPayrollToUIRow(item, p.name))
      })

      const results = await Promise.all(promises)
      
      // Gộp mảng 2 chiều thành 1 chiều
      results.forEach(arr => {
        allPayrollData = [...allPayrollData, ...arr]
      })

      setData(allPayrollData)

    } catch (e) {
      console.log(e)
      setApiError('Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối.')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  // Chạy 1 lần khi vào trang
  useEffect(() => {
    loadDataSequence()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // =========================================================
  // SETTINGS CỘT & FILTER (Giữ nguyên logic)
  // =========================================================
  const handleOpenSettings = () => {
    setTempColumns({ ...visibleColumns })
    setColSearch('')
    setShowSettings(true)
  }
  const toggleColumn = (key) => setTempColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  const handleSaveSettings = () => {
    setVisibleColumns(tempColumns)
    setShowSettings(false)
  }
  const handleResetSettings = () => {
    setTempColumns(INITIAL_VISIBLE_COLUMNS)
    setColSearch('')
  }

  const filterOptions = useMemo(() => {
    const uniq = (arr) => [...new Set(arr.filter(Boolean))]
    return {
      period: uniq(data.map((x) => x.period)),
      position: uniq(data.map((x) => x.position)),
      laborType: uniq(data.map((x) => x.laborType)),
      status: uniq(data.map((x) => x.status)),
    }
  }, [data])

  const displayedFilters = useMemo(() => {
    const s = filterSearch.trim().toLowerCase()
    if (!s) return FILTER_CONFIG
    return FILTER_CONFIG.filter((f) => f.label.toLowerCase().includes(s))
  }, [filterSearch])

  const toggleDraftFilterKey = (key) => {
    setDraftActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const setDraftValue = (key, value) => {
    setDraftFilterValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilter = () => {
    setAppliedActiveFilters(draftActiveFilters)
    setAppliedFilterValues(draftFilterValues)
    setPage(1)
    setShowFilter(false)
  }

  const handleResetFilter = () => {
    setDraftActiveFilters([])
    setDraftFilterValues(DEFAULT_FILTER_VALUES)
    setAppliedActiveFilters([])
    setAppliedFilterValues(DEFAULT_FILTER_VALUES)
    setFilterSearch('')
    setPage(1)
    setShowFilter(false)
  }

  const filteredData = useMemo(() => {
    let result = [...data]

    if (q.trim()) {
      const s = q.toLowerCase().trim()
      result = result.filter(
        (x) => (x.name && x.name.toLowerCase().includes(s)) || (x.unit && x.unit.toLowerCase().includes(s)),
      )
    }

    if (unitFilter) result = result.filter((x) => x.unit === unitFilter)

    if (scopeFilter === 'active') result = result.filter((x) => x.status === 'Đang áp dụng')
    if (scopeFilter === 'inactive') result = result.filter((x) => x.status === 'Ngừng áp dụng')

    appliedActiveFilters.forEach((key) => {
      const v = appliedFilterValues[key]
      if (v === '' || v == null) return

      if (key === 'name') {
        const s = String(v).toLowerCase()
        result = result.filter((x) => (x.name || '').toLowerCase().includes(s))
        return
      }
      if (key === 'ruleName') {
        const s = String(v).toLowerCase()
        result = result.filter((x) => (x.ruleName || '').toLowerCase().includes(s))
        return
      }
      if (key === 'inReport') {
        const boolVal = v === 'true'
        result = result.filter((x) => Boolean(x.inReport) === boolVal)
        return
      }
      result = result.filter((x) => String(x[key] ?? '') === String(v))
    })

    return result
  }, [data, q, unitFilter, scopeFilter, appliedActiveFilters, appliedFilterValues])

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startRange = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const endRange = Math.min(page * pageSize, totalItems)
  const paginatedView = filteredData.slice((page - 1) * pageSize, page * pageSize)

  // =========================================================
  // HANDLERS
  // =========================================================
  const handleAddNew = () => {
    resetAddForm()
    setShowAddModal(true)
  }

  const handleReload = async () => {
    await loadDataSequence() // Load lại toàn bộ
  }

  const handleSavePayroll = async () => {
    try {
      // Logic cũ dùng periodId, logic mới cần tìm periodId từ addMonth
      // 1. Parse tháng/năm từ form
      if (!addMonth || addMonth.length < 7) {
        setApiError('Tháng tính lương không hợp lệ.')
        setShowSaveConfirmModal(false)
        return
      }
      const [yStr, mStr] = addMonth.split('-')
      const year = Number(yStr)
      const month = Number(mStr)

      // 2. Tìm kỳ lương tương ứng trong danh sách periods
      // Giả sử logic là tìm kỳ có startDate/month khớp. 
      // Ở đây ta đơn giản lấy kỳ đầu tiên có month/year khớp hoặc cảnh báo.
      // Nếu API create payroll period tự tạo thì tốt, còn ở đây là tính batch cho kỳ ĐÃ CÓ.
      
      const targetPeriod = periods.find(p => {
        const d = new Date(p.startDate)
        return d.getMonth() + 1 === month && d.getFullYear() === year
      })

      if (!targetPeriod) {
        setApiError(`Không tìm thấy Kỳ lương cho tháng ${month}/${year}. Vui lòng tạo Kỳ lương trước.`)
        setShowSaveConfirmModal(false)
        return
      }

      setLoading(true)
      setApiError('')

      // ✅ CALL API BATCH CALCULATE
      await calculatePayrollBatch({ 
        periodId: targetPeriod.payrollPeriodId, 
        month, 
        year 
      })

      setShowSaveConfirmModal(false)
      setShowAddModal(false)

      // Reload lại toàn bộ dữ liệu
      await loadDataSequence()
    } catch (e) {
      console.log(e)
      setApiError(e?.response?.data?.message || e?.message || 'Tính lương thất bại.')
      setShowSaveConfirmModal(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payroll-components">
      {/* ========================= HEADER ========================= */}
      <div className="pc-header">
        <div className="left">
          <div className="title">Bảng lương</div>

          {/* ❌ Đã xóa Dropdown chọn kỳ lương ở đây */}
          <div className="mt-2 text-medium-emphasis small">
             Dữ liệu tổng hợp tất cả các kỳ lương
          </div>

          <div className="filters mt-3">
            <div className="filter-left">
              <div className="position-relative" style={{ width: '220px' }}>
                <CIcon
                  icon={cilSearch}
                  size="sm"
                  className="position-absolute"
                  style={{ left: 10, top: 9, color: '#adb5bd' }}
                />
                <CFormInput
                  placeholder="Tìm kiếm"
                  size="sm"
                  style={{ paddingLeft: 28, borderRadius: 6 }}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
            </div>

            <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
              <CFormSelect
                size="sm"
                className="w-auto"
                style={{ minWidth: '160px' }}
                value={scopeFilter}
                onChange={(e) => {
                  setScopeFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Tất cả bảng lương</option>
                <option value="active">Đang áp dụng</option>
                <option value="inactive">Ngừng áp dụng</option>
              </CFormSelect>

              <CFormSelect
                size="sm"
                className="w-auto"
                style={{ minWidth: '140px' }}
                value={unitFilter}
                onChange={(e) => {
                  setUnitFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Tất cả đơn vị</option>
                <option value="Khối Văn Phòng">Khối Văn Phòng</option>
                <option value="Khối Sản Xuất">Khối Sản Xuất</option>
                <option value="Khối Kinh Doanh">Khối Kinh Doanh</option>
                <option value="Khối Vận Hành">Khối Vận Hành</option>
              </CFormSelect>

              <div className="d-flex border-start ps-2 gap-1">
                <CButton
                  color="light"
                  variant="ghost"
                  size="sm"
                  title="Tải lại"
                  onClick={handleReload}
                  disabled={loading}
                >
                  <CIcon icon={cilReload} size="lg" />
                </CButton>

                <CButton
                  color="light"
                  variant="ghost"
                  size="sm"
                  title="Bộ lọc"
                  onClick={() => setShowFilter((v) => !v)}
                >
                  <CIcon icon={cilFilter} size="lg" />
                </CButton>

                <CButton color="light" variant="ghost" size="sm" title="Cài đặt" onClick={handleOpenSettings}>
                  <CIcon icon={cilSettings} size="lg" />
                </CButton>
              </div>
            </div>
          </div>

          {apiError ? (
            <div className="mt-2 small text-danger">{apiError}</div>
          ) : null}
        </div>

        <div className="right d-flex align-items-center gap-2">
          <CButton
            color="light"
            variant="outline"
            size="sm"
            className="d-flex align-items-center border-secondary text-secondary text-nowrap"
            style={{ height: '32px' }}
          >
            <CIcon icon={cilDescription} className="me-2" /> Quy tắc tính lương
          </CButton>

          <CButton
            color="success"
            size="sm"
            className="text-white d-flex align-items-center fw-semibold text-nowrap"
            onClick={handleAddNew}
            style={{ height: '32px' }}
            disabled={loading}
          >
            <CIcon icon={cilPlus} className="me-2" /> Thêm mới
          </CButton>
        </div>
      </div>

      {/* ========================= TABLE ========================= */}
      <CCard className="pc-table shadow-sm border-0 mt-3" style={{ minHeight: '600px' }}>
        <CCardHeader className="bg-light small text-medium-emphasis">
          {loading ? 'Đang tải dữ liệu...' : `Tổng số bản ghi: ${totalItems}`}
        </CCardHeader>

        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light" className="text-nowrap small fw-bold text-secondary bg-light border-bottom">
              <CTableRow>
                {visibleColumns.name && (
                  <CTableHeaderCell className="py-3 ps-3">
                    Tên bảng lương <span className="ms-1 text-success">📌</span>
                  </CTableHeaderCell>
                )}
                {visibleColumns.unit && <CTableHeaderCell className="py-3">Đơn vị áp dụng</CTableHeaderCell>}
                {visibleColumns.period && <CTableHeaderCell className="py-3">Kỳ lương</CTableHeaderCell>}
                {visibleColumns.position && <CTableHeaderCell className="py-3">Vị trí áp dụng</CTableHeaderCell>}
                {visibleColumns.laborType && <CTableHeaderCell className="py-3">Tính chất lao động</CTableHeaderCell>}
                {visibleColumns.payrollType && <CTableHeaderCell className="py-3">Loại bảng lương</CTableHeaderCell>}
                {visibleColumns.inReport && <CTableHeaderCell className="py-3">Tính vào báo cáo</CTableHeaderCell>}
                {visibleColumns.ruleName && <CTableHeaderCell className="py-3">Quy tắc tính lương</CTableHeaderCell>}
                {visibleColumns.status && <CTableHeaderCell className="py-3 text-center">Trạng thái</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center py-5">
                    Đang tải tất cả dữ liệu...
                  </CTableDataCell>
                </CTableRow>
              ) : totalItems === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center align-middle border-0" style={{ height: '420px' }}>
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                      <div className="mb-3">
                        <CIcon icon={cilDescription} size="5xl" style={{ color: '#dcfce7' }} />
                      </div>
                      <span className="text-medium-emphasis">{q.trim() ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}</span>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ) : (
                paginatedView.map((item) => (
                  <CTableRow
                    key={item.id}
                    style={{ cursor: 'pointer' }}
                    hover // thêm hover cho đẹp
                    onClick={() => handleRowClick(item)}
                  >
                    {visibleColumns.name && <CTableDataCell className="ps-3 fw-semibold text-primary">{item.name}</CTableDataCell>}
                    {visibleColumns.unit && <CTableDataCell>{item.unit}</CTableDataCell>}
                    {visibleColumns.period && <CTableDataCell>{item.period}</CTableDataCell>}
                    {visibleColumns.position && <CTableDataCell>{item.position}</CTableDataCell>}
                    {visibleColumns.laborType && <CTableDataCell>{item.laborType}</CTableDataCell>}
                    {visibleColumns.payrollType && <CTableDataCell>{item.payrollType}</CTableDataCell>}
                    {visibleColumns.inReport && <CTableDataCell>{item.inReport ? 'Có' : 'Không'}</CTableDataCell>}
                    {visibleColumns.ruleName && <CTableDataCell>{item.ruleName}</CTableDataCell>}
                    {visibleColumns.status && (
                      <CTableDataCell className="text-center">
                        <span className={`badge rounded-pill ${item.status === 'Đang áp dụng' ? 'bg-success' : 'bg-secondary'}`}>
                          {item.status}
                        </span>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>

        <div className="pc-pagination d-flex justify-content-between align-items-center p-3 border-top">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-medium-emphasis">Số bản ghi/trang</span>
            <CFormSelect
              size="sm"
              style={{ width: '70px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </CFormSelect>

            <span className="small text-medium-emphasis ms-2 border-start ps-3">
              {totalItems > 0 ? `${startRange} - ${endRange} trên tổng số ${totalItems} bản ghi` : '0 bản ghi'}
            </span>
          </div>

          <div className="nav">
            <button
              className="btn btn-sm btn-light border me-1"
              disabled={page <= 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              ‹
            </button>
            <span className="px-2 small fw-bold">
              Trang {page} / {totalPages}
            </span>
            <button
              className="btn btn-sm btn-light border ms-1"
              disabled={page >= totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </CCard>

      {/* ========================= MODALS & OFFCANVAS (Giữ nguyên) ========================= */}
      {/* 1) Modal Settings (Tùy chỉnh cột) */}
      <CModal visible={showSettings} onClose={() => setShowSettings(false)} alignment="center" scrollable={false}>
        <CModalHeader className="position-relative border-bottom-0 pb-0">
          <h5 className="modal-title fw-bold">Tùy chỉnh cột</h5>
          <div
            className="position-absolute"
            style={{ right: '50px', top: '18px', cursor: 'pointer', color: '#6c757d' }}
            title="Đặt lại mặc định"
            onClick={handleResetSettings}
          >
            <CIcon icon={cilReload} size="lg" />
          </div>
        </CModalHeader>
        <CModalBody>
          <CFormInput placeholder="Tìm kiếm" value={colSearch} onChange={(e) => setColSearch(e.target.value)} className="mb-3" />
          <div className="column-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {COLUMN_CONFIG.filter((col) => col.label.toLowerCase().includes(colSearch.toLowerCase())).map((col) => (
              <div key={col.key} className="mb-3">
                <CFormCheck
                  id={`col-${col.key}`}
                  label={col.label}
                  checked={tempColumns[col.key]}
                  onChange={() => toggleColumn(col.key)}
                />
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter className="bg-light border-top-0">
          <CButton color="success" className="text-white w-100" onClick={handleSaveSettings}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 2) Offcanvas Filter */}
      <COffcanvas
        placement="end"
        visible={showFilter}
        onHide={() => setShowFilter(false)}
        className="filter-sidebar"
        backdrop={false}
        style={{ width: 400 }}
        scroll={true}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setShowFilter(false)} />
        </COffcanvasHeader>

        <COffcanvasBody className="d-flex flex-column h-100">
          <div className="mb-3 position-relative">
            <CFormInput
              type="text"
              placeholder="Tìm kiếm..."
              className="ps-5"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
            />
            <CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          </div>

          <div className="filter-list">
            {displayedFilters.map((item) => (
              <CFormCheck
                key={item.key}
                id={`filter-${item.key}`}
                label={item.label}
                checked={draftActiveFilters.includes(item.key)}
                onChange={() => toggleDraftFilterKey(item.key)}
                className="mb-2"
              />
            ))}
          </div>

          <div className="mt-3 pt-3 border-top flex-grow-1 overflow-auto">
            {draftActiveFilters.length === 0 ? (
              <div className="text-medium-emphasis small">Chọn điều kiện ở trên để lọc dữ liệu.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {/* Render các input filter động dựa trên draftActiveFilters */}
                {draftActiveFilters.includes('name') && (
                  <div>
                    <div className="small fw-semibold mb-1">Tên bảng lương</div>
                    <CFormInput value={draftFilterValues.name} onChange={(e) => setDraftValue('name', e.target.value)} />
                  </div>
                )}
                {/* ... (Các trường filter khác giữ nguyên logic) ... */}
                {draftActiveFilters.includes('period') && (
                  <div>
                    <div className="small fw-semibold mb-1">Kỳ lương</div>
                    <CFormSelect value={draftFilterValues.period} onChange={(e) => setDraftValue('period', e.target.value)}>
                      <option value="">Tất cả</option>
                      {filterOptions.period.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </CFormSelect>
                  </div>
                )}
                {/* Copy nốt các trường filter khác từ code cũ nếu cần... */}
              </div>
            )}
          </div>

          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={handleResetFilter}>
              Bỏ lọc
            </CButton>
            <CButton color="success" className="text-white w-50" onClick={handleApplyFilter}>
              Áp dụng
            </CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      {/* 3) Modal Thêm mới */}
      <CModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="xl"
        alignment="center"
        backdrop="static"
      >
        <CModalHeader className="border-bottom">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-3">
              <CModalTitle className="fw-bold">Thêm bảng lương</CModalTitle>
              <div className="d-flex align-items-center gap-2">
                <CFormSwitch
                  id="sw-exclude-report"
                  checked={addExcludeFromReport}
                  onChange={(e) => setAddExcludeFromReport(e.target.checked)}
                />
                <span className="fw-semibold">Không tính vào báo cáo</span>
                <CIcon icon={cilInfo} className="text-secondary" />
              </div>
            </div>
            <CCloseButton className="text-reset" onClick={() => setShowAddModal(false)} />
          </div>
        </CModalHeader>

        <CModalBody className="pt-4 pb-5">
          <CForm>
             {/* ... Form inputs giữ nguyên ... */}
             <CRow className="mb-4 align-items-center">
              <CCol md={3}>
                <CFormLabel className="fw-semibold mb-0">Loại bảng lương</CFormLabel>
              </CCol>
              <CCol md={9} className="d-flex align-items-center gap-5">
                <CFormCheck type="radio" name="payrollKind" label="Bảng lương chi tiết" checked={addPayrollKind === 'detail'} onChange={() => setAddPayrollKind('detail')} />
                <CFormCheck type="radio" name="payrollKind" label="Bảng lương tổng hợp" checked={addPayrollKind === 'summary'} onChange={() => setAddPayrollKind('summary')} />
              </CCol>
            </CRow>
            <CRow className="mb-4 align-items-center">
              <CCol md={3}><CFormLabel className="fw-semibold mb-0">Kỳ lương</CFormLabel></CCol>
              <CCol md={9}>
                <div className="d-flex gap-3">
                  <CFormInput type="number" min={1} value={addPeriodIndex} onChange={(e) => setAddPeriodIndex(Number(e.target.value || 1))} style={{ maxWidth: 120 }} />
                  <CInputGroup style={{ maxWidth: 360 }}>
                    <CFormInput type="month" value={addMonth} onChange={(e) => setAddMonth(e.target.value)} />
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                  </CInputGroup>
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-4 align-items-center">
              <CCol md={3}><CFormLabel className="fw-semibold mb-0">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel></CCol>
              <CCol md={9}>
                 <div className="d-flex align-items-center justify-content-between border rounded px-2 py-2" style={{ minHeight: 38, background: '#fff' }}>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {addUnit ? (
                      <CBadge color="light" className="text-dark d-flex align-items-center gap-2 px-3 py-2">
                        <span>{addUnit}</span>
                        <span className="ms-1" role="button" title="Xóa" onClick={() => setAddUnit('')} style={{ lineHeight: 1 }}>×</span>
                      </CBadge>
                    ) : <span className="text-medium-emphasis">Chọn đơn vị</span>}
                  </div>
                  <CIcon icon={cilChevronBottom} className="text-secondary" />
                </div>
              </CCol>
            </CRow>
            {/* ... Các row khác giữ nguyên ... */}
             <CRow className="mb-4 align-items-center">
              <CCol md={3}><CFormLabel className="fw-semibold mb-0">Tên bảng lương <span className="text-danger">*</span></CFormLabel></CCol>
              <CCol md={9}><CFormInput value={addPayrollName} onChange={(e) => setAddPayrollName(e.target.value)} /></CCol>
            </CRow>
          </CForm>
        </CModalBody>

        <CModalFooter className="border-top bg-white">
          <CButton color="light" className="border" onClick={() => setShowAddModal(false)} disabled={loading}>Hủy bỏ</CButton>
          <CButton color="success" className="text-white" onClick={() => setShowSaveConfirmModal(true)} disabled={loading}>Lưu</CButton>
        </CModalFooter>
      </CModal>

      {/* 4) Modal Confirm Save */}
      <CModal visible={showSaveConfirmModal} onClose={() => setShowSaveConfirmModal(false)} alignment="center">
        <CModalHeader><CModalTitle>Xác nhận lưu</CModalTitle></CModalHeader>
        <CModalBody className="text-center py-4">
          <CIcon icon={cilWarning} size="4xl" className="text-warning mb-3" />
          <p className="fs-5">Bạn có chắc chắn muốn lưu bảng lương này không?</p>
          <div className="small text-medium-emphasis">Thao tác này sẽ chạy <b>tính lương batch</b> cho kỳ lương tháng {addMonth}.</div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowSaveConfirmModal(false)} disabled={loading}>Hủy</CButton>
          <CButton color="success" className="text-white" onClick={handleSavePayroll} disabled={loading}>Đồng ý</CButton>
        </CModalFooter>
      </CModal>
      <PayrollDetailModal
        visible={showDetailModal}
        payrollId={selectedPayrollId}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  )
}

export default PayrollPage