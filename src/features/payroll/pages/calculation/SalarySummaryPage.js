import { useMemo, useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom' // ❌ Không cần dùng navigate nữa
import {
  cilPlus,
  cilSearch,
  cilFilter,
  cilSettings,
  cilChevronLeft,
  cilChevronRight,
  cilWarning,
  cilReload,
  cilArrowLeft, // ✅ Thêm icon quay lại
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

// ✅ API thật
import { fetchPayrollPeriods } from '../../api/masterDataApi'
import { calculatePayrollBatch, createPayrollPeriod } from '../../api/payrollApi'
import SalaryDetailModal from '../../components/SalaryDetailModal'
import '../../scss/salary-summary-page.scss'

// --- CẤU HÌNH CỘT ---
const COLUMN_CONFIG = [
  { key: 'summaryDate', label: 'Ngày tổng hợp' },
  { key: 'name', label: 'Tên bảng tổng hợp' },
  { key: 'period', label: 'Kỳ lương' },
  { key: 'unit', label: 'Đơn vị áp dụng' },
  { key: 'position', label: 'Vị trí áp dụng' },
]

const INITIAL_VISIBLE_COLUMNS = COLUMN_CONFIG.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {})

// --- CẤU HÌNH BỘ LỌC ---
const FILTER_CONFIG = [
  { key: 'name', label: 'Tên bảng lương' },
  { key: 'period', label: 'Kỳ lương' },
  { key: 'position', label: 'Vị trí áp dụng' },
]

const formatMonth = (yyyyMm) => {
  if (!yyyyMm || yyyyMm.length < 7) return ''
  const [y, m] = yyyyMm.split('-')
  return `Tháng ${m}/${y}`
}

const formatDateDDMMYYYY = (yyyyMmDd) => {
  if (!yyyyMmDd || yyyyMmDd.length < 10) return ''
  const [y, m, d] = yyyyMmDd.split('-')
  return `${d}/${m}/${y}`
}

// ===== Helpers cho API =====
const ymToRange = (yyyyMm) => {
  const [yStr, mStr] = (yyyyMm || '').split('-')
  const year = Number(yStr)
  const month = Number(mStr) 
  if (!year || !month) return null
  const mm = String(month).padStart(2, '0')
  const startDate = `${year}-${mm}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`
  return { year, month, startDate, endDate }
}

const unwrapApi = (res) => (res?.data?.data ?? res?.data ?? res)

// ============================================================================
// COMPONENT CON: GIAO DIỆN CHI TIẾT (HIỂN THỊ KHI CLICK VÀO HÀNG)
// ============================================================================
const SalaryDetailSection = ({ detailId, detailData, onBack }) => {
  // Ở đây bạn có thể gọi API lấy chi tiết dựa vào detailId
  // Ví dụ: const [detail, setDetail] = useState(null)...
  
  return (
    <div className="salary-detail-container fade-in">
      {/* Header chi tiết */}
      <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
        <CButton color="light" variant="outline" onClick={onBack} title="Quay lại danh sách">
           <CIcon icon={cilArrowLeft} /> Quay lại
        </CButton>
        <div>
           <h4 className="mb-0">Chi tiết bảng lương</h4>
           <div className="text-medium-emphasis small">ID: {detailId} | {detailData?.name}</div>
        </div>
      </div>

      {/* Nội dung chi tiết (Ví dụ) */}
      <CCard className="shadow-sm border-0">
        <CCardBody>
           <div className="text-center py-5">
              <h5>Nội dung chi tiết bảng lương sẽ hiển thị ở đây</h5>
              <p>Bạn có thể đưa component bảng tính lương chi tiết vào khu vực này.</p>
              <div className="p-3 bg-light d-inline-block rounded">
                 Dữ liệu mẫu: {JSON.stringify(detailData)}
              </div>
           </div>
        </CCardBody>
      </CCard>
    </div>
  )
}


// ============================================================================
// COMPONENT CHÍNH: SALARY SUMMARY PAGE
// ============================================================================
const SalarySummaryPage = () => {
  // const navigate = useNavigate() // ❌ Bỏ navigate

  // =========================
  // STATE: DỮ LIỆU & VIEW MODE
  // =========================
  const [data, setData] = useState([])
  const [periods, setPeriods] = useState([]) 
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  // 2. STATE CHO MODAL CHI TIẾT
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState(null) // Lưu object row được chọn

  // 3. HÀM XỬ LÝ KHI CLICK VÀO HÀNG
  const handleViewDetail = (item) => {
    // item.__raw là object gốc từ API fetchPayrollPeriods (chứa payrollPeriodId)
    // Hoặc item.id nếu bạn đã map id = payrollPeriodId
    setSelectedSummary(item)
    setShowDetailModal(true)
  }

  // ✅ State mới để quản lý việc xem chi tiết
  // viewId = null (xem danh sách), viewId = '123' (xem chi tiết)
  const [viewId, setViewId] = useState(null) 
  const [viewData, setViewData] = useState(null) // Lưu thông tin row đang chọn để hiển thị tiêu đề

  // =========================
  // LOAD DATA TỪ API
  // =========================
  const mapPeriodToRow = (p) => {
    const summaryDate = (p?.paymentDate || p?.endDate || p?.startDate || '')?.toString()?.slice(0, 10)
    const periodLabel = p?.name || '—'
    return {
      id: p?.payrollPeriodId || p?.id,
      summaryDate: summaryDate || '',
      name: `Bảng tổng hợp lương - ${periodLabel}`,
      period: periodLabel,
      unit: 'Toàn công ty',
      position: 'Tất cả các vị trí trong đơn vị',
      __raw: p,
    }
  }

  const loadSummaryFromApi = async () => {
    setLoading(true)
    setApiError('')
    try {
      const list = await fetchPayrollPeriods()
      const sorted = (list || []).slice().sort((a, b) => {
        const ad = (a?.startDate || a?.paymentDate || a?.endDate || '')
        const bd = (b?.startDate || b?.paymentDate || b?.endDate || '')
        return String(bd).localeCompare(String(ad))
      })
      setPeriods(sorted)
      setData(sorted.map(mapPeriodToRow))
    } catch (e) {
      console.log(e)
      setApiError(e?.response?.data?.message || 'Không tải được danh sách tổng hợp lương.')
      setPeriods([])
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummaryFromApi()
  }, [])

  // =========================
  // STATE: SELECTION & FILTER & MODALS
  // =========================
  const [selectedIds, setSelectedIds] = useState([])
  const [q, setQ] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)
  const [unitFilterHeader, setUnitFilterHeader] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [tempVisibleColumns, setTempVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [settingSearch, setSettingSearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [filterSearch, setFilterSearch] = useState('')
  const [draftActiveFilters, setDraftActiveFilters] = useState([]) 
  const [draftFilterValues, setDraftFilterValues] = useState({ name: '', period: '', position: '' })
  const [appliedFilters, setAppliedFilters] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false)
  const [formPeriod, setFormPeriod] = useState('2025-12')
  const [formSummaryDate, setFormSummaryDate] = useState('2025-12-13')
  const [formUnit, setFormUnit] = useState('Thuận Nguyễn Phúc')
  const [formPosition, setFormPosition] = useState('Tất cả các vị trí trong đơn vị')
  const [formName, setFormName] = useState('')
  const [formPayrollPicked, setFormPayrollPicked] = useState(false)

  // =========================
  // COMPUTED VALUES
  // =========================
  const filterOptions = useMemo(() => {
    return {
      period: Array.from(new Set(data.map(d => d.period))).filter(Boolean),
      position: Array.from(new Set(data.map(d => d.position))).filter(Boolean),
    }
  }, [data])

  const displayedFilters = useMemo(() => {
    if (!filterSearch) return FILTER_CONFIG
    return FILTER_CONFIG.filter(f => f.label.toLowerCase().includes(filterSearch.toLowerCase()))
  }, [filterSearch])

  const filteredData = useMemo(() => {
    let result = [...data]
    if (q.trim()) {
      const s = q.toLowerCase().trim()
      result = result.filter(x => (x.name || '').toLowerCase().includes(s) || (x.unit || '').toLowerCase().includes(s))
    }
    if (unitFilterHeader) result = result.filter((x) => x.unit === unitFilterHeader)
    Object.keys(appliedFilters).forEach(key => {
      const value = appliedFilters[key]
      if (value) {
        if (key === 'name') result = result.filter(item => item.name?.toLowerCase().includes(value.toLowerCase()))
        else result = result.filter(item => item[key] === value)
      }
    })
    return result
  }, [data, q, unitFilterHeader, appliedFilters])

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startRange = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const endRange = Math.min(page * pageSize, totalItems)
  const paginatedView = filteredData.slice((page - 1) * pageSize, page * pageSize)

  // =========================
  // HANDLERS
  // =========================
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const currentIds = paginatedView.map(item => item.id)
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])))
    } else {
      const currentIds = paginatedView.map(item => item.id)
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)))
    }
  }

  const handleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ✅ LOGIC XEM CHI TIẾT MỚI
  // const handleViewDetail = (item) => {
  //   setViewData(item)
  //   setViewId(item.id) // Kích hoạt chế độ xem chi tiết
  // }

  const handleBackToList = () => {
    setViewId(null) // Quay về chế độ xem danh sách
    setViewData(null)
  }
  


  // ... (Giữ nguyên các handler Filter, Settings, Add giống code cũ) ...
  const toggleDraftFilterKey = (key) => setDraftActiveFilters(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  const setDraftValue = (key, value) => setDraftFilterValues(prev => ({ ...prev, [key]: value }))
  const handleResetFilter = () => { setDraftActiveFilters([]); setDraftFilterValues({ name: '', period: '', position: '' }); setAppliedFilters({}); setFilterSearch('') }
  const handleApplyFilter = () => {
    const newApplied = {}; draftActiveFilters.forEach(key => { if (draftFilterValues[key]) newApplied[key] = draftFilterValues[key] })
    setAppliedFilters(newApplied); setShowFilter(false); setPage(1)
  }
  const handleOpenSettings = () => { setTempVisibleColumns({ ...visibleColumns }); setSettingSearch(''); setShowSettings(true) }
  const handleSaveSettings = () => { setVisibleColumns(tempVisibleColumns); setShowSettings(false) }
  const toggleColumn = (key) => setTempVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))
  const handleOpenAdd = () => { setFormPeriod('2025-12'); setFormSummaryDate('2025-12-13'); setFormUnit('Thuận Nguyễn Phúc'); setFormPosition('Tất cả các vị trí trong đơn vị'); setFormPayrollPicked(false); setFormName(''); setShowAddModal(true) }
  
  const handleSaveSummary = async () => {
    const nameFinal = formName.trim() || `Bảng tổng hợp lương ${formatMonth(formPeriod)} - ${formUnit}`
    const range = ymToRange(formPeriod)
    setShowSaveConfirmModal(false)
    if (!range) { setApiError('Kỳ lương không hợp lệ.'); return }
    setLoading(true); setApiError('')
    try {
      const periodPayload = { name: nameFinal, startDate: range.startDate, endDate: range.endDate, paymentDate: formSummaryDate }
      const createdRes = await createPayrollPeriod(periodPayload)
      const created = unwrapApi(createdRes)
      const periodId = created?.payrollPeriodId ?? created?.id
      if (!periodId) throw new Error('Lỗi tạo kỳ lương.')
      await calculatePayrollBatch({ periodId, month: range.month, year: range.year })
      await loadSummaryFromApi()
      setShowAddModal(false)
    } catch (e) { setApiError(e?.response?.data?.message || 'Lỗi xử lý.') } finally { setLoading(false) }
  }

  const isAllSelected = paginatedView.length > 0 && paginatedView.every(item => selectedIds.includes(item.id))
  const isIndeterminate = paginatedView.some(item => selectedIds.includes(item.id)) && !isAllSelected

  // ============================================================================
  // RENDER MAIN
  // ============================================================================
  return (
    <div className="payroll-components position-relative">
      
      {/* ========================= HEADER ========================= */}
      <div className="pc-header">
        <div className="left">
          <div className="title">Bảng tổng hợp lương</div>
          <div className="filters">
            <div className="filter-left">
              <div className="position-relative" style={{ width: 280 }}>
                <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 9, color: '#adb5bd' }} />
                <CFormInput
                  placeholder="Tìm kiếm" size="sm" style={{ paddingLeft: 28, borderRadius: 6 }}
                  value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }}
                />
              </div>
            </div>
            <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
              <CFormSelect
                size="sm" className="w-auto" style={{ minWidth: 240 }}
                value={unitFilterHeader} onChange={(e) => { setUnitFilterHeader(e.target.value); setPage(1) }}
              >
                <option value="">Tất cả đơn vị</option>
                {Array.from(new Set(data.map(d => d.unit))).map(u => <option key={u} value={u}>{u}</option>)}
              </CFormSelect>

              <CButton color="light" variant="ghost" size="sm" title="Bộ lọc" onClick={() => setShowFilter(true)}>
                <CIcon icon={cilFilter} size="lg" />
              </CButton>
              <CButton color="light" variant="ghost" size="sm" title="Cài đặt" onClick={handleOpenSettings}>
                <CIcon icon={cilSettings} size="lg" />
              </CButton>
            </div>
          </div>
        </div>
        <div className="right d-flex align-items-center gap-2">
          <CButton color="success" size="sm" className="text-white d-flex align-items-center fw-semibold text-nowrap" onClick={handleOpenAdd} style={{ height: 32 }}>
            <CIcon icon={cilPlus} className="me-2" /> Thêm mới
          </CButton>
        </div>
      </div>

      {/* ========================= TABLE ========================= */}
      <CCard className="pc-table shadow-sm border-0 mt-3" style={{ minHeight: 600 }}>
        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light" className="text-nowrap small fw-bold text-secondary bg-light border-bottom">
              <CTableRow>
                <CTableHeaderCell className="py-3 ps-3" style={{ width: 42 }}>
                  <CFormCheck 
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </CTableHeaderCell>
                {visibleColumns.summaryDate && <CTableHeaderCell className="py-3">Ngày tổng hợp</CTableHeaderCell>}
                {visibleColumns.name && <CTableHeaderCell className="py-3">Tên bảng tổng hợp</CTableHeaderCell>}
                {visibleColumns.period && <CTableHeaderCell className="py-3">Kỳ lương</CTableHeaderCell>}
                {visibleColumns.unit && <CTableHeaderCell className="py-3">Đơn vị áp dụng</CTableHeaderCell>}
                {visibleColumns.position && <CTableHeaderCell className="py-3">Vị trí áp dụng</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loading ? (
                <CTableRow><CTableDataCell colSpan={6} className="text-center py-5 text-medium-emphasis">Đang tải dữ liệu...</CTableDataCell></CTableRow>
              ) : totalItems === 0 ? (
                <CTableRow><CTableDataCell colSpan={6} className="text-center py-5 text-medium-emphasis">{apiError || 'Không có dữ liệu'}</CTableDataCell></CTableRow>
              ) : (
                paginatedView.map((item) => (
                  <CTableRow 
                    key={item.id} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleViewDetail(item)} // ✅ Giữ lại sự kiện mở Modal
                  >
                    <CTableDataCell className="ps-3" onClick={(e) => e.stopPropagation()}>
                      <CFormCheck 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </CTableDataCell>
                    {visibleColumns.summaryDate && <CTableDataCell>{formatDateDDMMYYYY(item.summaryDate)}</CTableDataCell>}
                    {visibleColumns.name && <CTableDataCell className="fw-semibold text-primary">{item.name}</CTableDataCell>}
                    {visibleColumns.period && <CTableDataCell>{formatMonth(item.period)}</CTableDataCell>}
                    {visibleColumns.unit && <CTableDataCell>{item.unit}</CTableDataCell>}
                    {visibleColumns.position && <CTableDataCell>{item.position}</CTableDataCell>}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>

        <div className="pc-pagination d-flex justify-content-between align-items-center p-3 border-top">
          <div className="small text-medium-emphasis">Tổng số bản ghi: {totalItems}</div>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-medium-emphasis">Số bản ghi/trang</span>
            <CFormSelect size="sm" style={{ width: 80 }} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </CFormSelect>
            <span className="small text-medium-emphasis ms-2">{totalItems > 0 ? `${startRange} - ${endRange} bản ghi` : '0 bản ghi'}</span>
            <CButton color="light" variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><CIcon icon={cilChevronLeft} /></CButton>
            <CButton color="light" variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><CIcon icon={cilChevronRight} /></CButton>
          </div>
        </div>
      </CCard>

      {/* ========================= MODALS ========================= */}
      
      {/* 1. Modal Chi Tiết (Mới thêm) */}
      <SalaryDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        periodId={selectedSummary?.id}
        periodName={selectedSummary?.name}
      />

      {/* 2. Modal Bộ Lọc */}
      <COffcanvas placement="end" visible={showFilter} onHide={() => setShowFilter(false)} className="filter-sidebar" backdrop={false} style={{ width: 400 }} scroll={true}>
        <COffcanvasHeader>
          <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setShowFilter(false)} />
        </COffcanvasHeader>
        <COffcanvasBody className="d-flex flex-column h-100">
          <div className="mb-3 position-relative">
            <CFormInput type="text" placeholder="Tìm kiếm..." className="ps-5" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
            <CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          </div>
          <div className="filter-list">
            {displayedFilters.map((item) => (
              <CFormCheck key={item.key} id={`filter-${item.key}`} label={item.label} checked={draftActiveFilters.includes(item.key)} onChange={() => toggleDraftFilterKey(item.key)} className="mb-2" style={{ cursor: 'pointer' }} />
            ))}
          </div>
          <div className="mt-3 pt-3 border-top flex-grow-1 overflow-auto custom-scrollbar">
            {draftActiveFilters.length === 0 ? <div className="text-medium-emphasis small text-center mt-3">Chọn điều kiện ở trên để lọc dữ liệu.</div> : (
              <div className="d-flex flex-column gap-3">
                {draftActiveFilters.includes('name') && <div><div className="small fw-semibold mb-1">Tên bảng lương</div><CFormInput placeholder="Nhập tên..." value={draftFilterValues.name} onChange={(e) => setDraftValue('name', e.target.value)} /></div>}
                {draftActiveFilters.includes('period') && <div><div className="small fw-semibold mb-1">Kỳ lương</div><CFormSelect value={draftFilterValues.period} onChange={(e) => setDraftValue('period', e.target.value)}><option value="">Tất cả</option>{filterOptions.period.map((p) => <option key={p} value={p}>{formatMonth(p)}</option>)}</CFormSelect></div>}
                {draftActiveFilters.includes('position') && <div><div className="small fw-semibold mb-1">Vị trí áp dụng</div><CFormSelect value={draftFilterValues.position} onChange={(e) => setDraftValue('position', e.target.value)}><option value="">Tất cả</option>{filterOptions.position.map((p) => <option key={p} value={p}>{p}</option>)}</CFormSelect></div>}
              </div>
            )}
          </div>
          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={handleResetFilter}>Bỏ lọc</CButton>
            <CButton color="success" className="text-white w-50" onClick={handleApplyFilter}>Áp dụng</CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      {/* 3. Modal Cài Đặt Cột */}
      <CModal visible={showSettings} onClose={() => setShowSettings(false)} alignment="center" scrollable={false}>
         <CModalHeader className="position-relative border-bottom-0 pb-0"><h5 className="modal-title fw-bold">Tùy chỉnh cột</h5><div className="position-absolute" style={{ right: '50px', top: '18px', cursor: 'pointer', color: '#6c757d' }} title="Đặt lại mặc định" onClick={() => setTempVisibleColumns(INITIAL_VISIBLE_COLUMNS)}><CIcon icon={cilReload} size="lg" /></div></CModalHeader>
        <CModalBody><div className="mb-3"><CFormInput placeholder="Tìm kiếm" value={settingSearch} onChange={(e) => setSettingSearch(e.target.value)} className="mb-3" /></div><div className="column-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>{COLUMN_CONFIG.filter(col => col.label.toLowerCase().includes(settingSearch.toLowerCase())).map((col) => (<div key={col.key} className="mb-3"><CFormCheck id={`col-${col.key}`} label={col.label} checked={tempVisibleColumns[col.key]} onChange={() => toggleColumn(col.key)} style={{ cursor: 'pointer' }} /></div>))}</div></CModalBody>
        <CModalFooter className="bg-light border-top-0"><CButton color="success" className="text-white w-100" onClick={handleSaveSettings}>Lưu</CButton></CModalFooter>
      </CModal>

      {/* 4. Modal Thêm Mới */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg" backdrop="static" alignment="center">
        <CModalHeader onClose={() => setShowAddModal(false)}><CModalTitle>Thêm bảng tổng hợp lương</CModalTitle></CModalHeader>
        <CModalBody><CForm><CRow className="mb-3"><CCol md={6}><CFormLabel>Kỳ lương <span className="text-danger">*</span></CFormLabel><CFormInput type="month" value={formPeriod} onChange={(e) => setFormPeriod(e.target.value)} /></CCol><CCol md={6}><CFormLabel>Ngày tổng hợp</CFormLabel><CFormInput type="date" value={formSummaryDate} onChange={(e) => setFormSummaryDate(e.target.value)} /></CCol></CRow><CRow className="mb-3"><CCol md={12}><CFormLabel>Bảng lương <span className="text-danger">*</span></CFormLabel><div><CButton variant="ghost" color="primary" onClick={() => setFormPayrollPicked(true)} className="px-0"><CIcon icon={cilPlus} className="me-2" />Thêm bảng lương</CButton>{formPayrollPicked && <div className="small text-success mt-1">Đã chọn 1 bảng lương (demo)</div>}</div></CCol></CRow><CRow className="mb-3"><CCol md={6}><CFormLabel>Đơn vị</CFormLabel><CFormSelect value={formUnit} onChange={(e) => setFormUnit(e.target.value)}><option value="Thuận Nguyễn Phúc">Thuận Nguyễn Phúc</option><option value="Khối Văn Phòng">Khối Văn Phòng</option><option value="Khối Kinh Doanh">Khối Kinh Doanh</option></CFormSelect></CCol><CCol md={6}><CFormLabel>Vị trí</CFormLabel><CFormSelect value={formPosition} onChange={(e) => setFormPosition(e.target.value)}><option value="Tất cả các vị trí trong đơn vị">Tất cả các vị trí trong đơn vị</option><option value="Sale / CSKH">Sale / CSKH</option></CFormSelect></CCol></CRow><CRow className="mb-1"><CCol md={12}><CFormLabel>Tên bảng tổng hợp <span className="text-danger">*</span></CFormLabel><CFormInput value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={`VD: Bảng tổng hợp lương ${formatMonth(formPeriod)} - ${formUnit}`} /></CCol></CRow></CForm></CModalBody>
        <CModalFooter><CButton color="secondary" variant="outline" onClick={() => setShowAddModal(false)}>Hủy bỏ</CButton><CButton color="success" onClick={() => { if (!formName.trim()) setFormName(`Bảng tổng hợp lương ${formatMonth(formPeriod)} - ${formUnit}`); setShowSaveConfirmModal(true) }}>Lưu</CButton></CModalFooter>
      </CModal>

      {/* 5. Modal Xác Nhận Lưu */}
      <CModal visible={showSaveConfirmModal} onClose={() => setShowSaveConfirmModal(false)} alignment="center"><CModalHeader onClose={() => setShowSaveConfirmModal(false)}><CModalTitle>Xác nhận lưu</CModalTitle></CModalHeader><CModalBody className="py-4"><div className="d-flex align-items-start gap-3"><CIcon icon={cilWarning} size="3xl" className="text-warning mt-1" /><div><div className="fw-semibold mb-1">Bạn có chắc chắn muốn lưu bảng tổng hợp lương này không?</div><div className="text-medium-emphasis small">{formName}</div></div></div></CModalBody><CModalFooter><CButton color="secondary" onClick={() => setShowSaveConfirmModal(false)}>Hủy</CButton><CButton color="success" onClick={handleSaveSummary}>Đồng ý</CButton></CModalFooter></CModal>

    </div>
  )
}

export default SalarySummaryPage