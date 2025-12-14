import {
  cilArrowLeft,
  cilCloudDownload,
  cilFilter,
  cilPlus,
  cilReload,
  cilSearch,
  cilSettings,
  cilWarning,
  cilFile
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
  CToaster,
  CToast,
  CToastBody,
  CSpinner, 
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../../scss/components-page.scss'

// ✅ IMPORT API
import { fetchTimekeepingPeriods, fetchMonthlyTimesheets } from '../../api/timekeepingApi'

// --- CẤU HÌNH CỘT LIST VIEW ---
const COLUMN_CONFIG = [
  { key: 'name', label: 'Tên bảng chấm công' },
  { key: 'time', label: 'Thời gian' },
  { key: 'paymentDate', label: 'Ngày chi trả dự kiến' },
  { key: 'status', label: 'Trạng thái' },
]

const INITIAL_VISIBLE_COLUMNS = COLUMN_CONFIG.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {})

const FILTER_CHECKBOX_OPTIONS = [
  { id: 'name', label: 'Tên bảng chấm công' },
  { id: 'status', label: 'Trạng thái' },
]

const TimekeepingPage = () => {
  // Data State
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  // UI States
  const [showDetail, setShowDetail] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Form Data State
  const [formData, setFormData] = useState({
    startDate: '', endDate: '', name: '', 
  })

  // Filter & Pagination States
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState(['name', 'status'])
  
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [tempColumns, setTempColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [colSearch, setColSearch] = useState('')
  
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)

  // Toast
  const [toast, setToast] = useState(0)
  const toaster = useRef()

  // ✅ 1. API: LOAD DANH SÁCH KỲ CÔNG (List View)
  const loadPeriods = async () => {
    setLoading(true)
    try {
      const res = await fetchTimekeepingPeriods()
      // Map dữ liệu từ PayrollPeriod sang định dạng hiển thị
      const mapped = (res || []).map(p => ({
        id: p.payrollPeriodId,
        name: p.name || `Kỳ công tháng ${new Date(p.startDate).getMonth() + 1}/${new Date(p.startDate).getFullYear()}`,
        time: `${p.startDate} - ${p.endDate}`,
        paymentDate: p.paymentDate,
        status: p.isClosed ? 'Đã khóa' : 'Đang theo dõi',
        
        // Lưu lại dữ liệu thô để dùng cho Detail View
        rawMonth: new Date(p.startDate).getMonth() + 1,
        rawYear: new Date(p.startDate).getFullYear(),
        rawStartDate: p.startDate,
        rawEndDate: p.endDate
      }))
      // Sort mới nhất lên đầu
      setData(mapped.sort((a,b) => b.id - a.id))
    } catch (error) {
      console.error("Lỗi tải kỳ công:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeriods()
  }, [])

  // --- LOGIC LỌC ---
  const filteredData = useMemo(() => {
    let result = data
    if (q.trim()) result = result.filter(item => item.name.toLowerCase().includes(q.toLowerCase()))
    if (statusFilter) result = result.filter(item => item.status === statusFilter)
    return result
  }, [data, q, statusFilter])

  const totalItems = filteredData.length
  const startRange = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const endRange = Math.min(page * pageSize, totalItems)
  const paginatedView = filteredData.slice((page - 1) * pageSize, page * pageSize)

  // --- HANDLERS UI ---
  const handleAddNew = () => setShowAddModal(true)
  const handleTriggerSave = () => setShowConfirmModal(true)
  
  const handleConfirmSave = () => {
    setShowConfirmModal(false)
    setShowAddModal(false)
    setToast(<CToast autohide delay={3000} color="success" className="text-white align-items-center"><div className="d-flex"><CToastBody>Đã lưu thành công (Demo)</CToastBody><CCloseButton className="me-2 m-auto" white /></div></CToast>)
  }

  const handleCancelSave = () => setShowConfirmModal(false)
  const handleFormChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
  
  const handleOpenSettings = () => { setTempColumns({ ...visibleColumns }); setColSearch(''); setShowSettings(true) }
  const toggleColumn = (key) => setTempColumns(prev => ({ ...prev, [key]: !prev[key] }))
  const handleSaveSettings = () => { setVisibleColumns(tempColumns); setShowSettings(false) }
  const handleResetSettings = () => { setTempColumns(INITIAL_VISIBLE_COLUMNS); setColSearch('') }
  
  const displayedFilterOptions = useMemo(() => {
    if (!sidebarSearch) return FILTER_CHECKBOX_OPTIONS
    return FILTER_CHECKBOX_OPTIONS.filter(opt => opt.label.toLowerCase().includes(sidebarSearch.toLowerCase()))
  }, [sidebarSearch])

  const handleRowClick = (item) => { setSelectedItem(item); setShowDetail(true); window.scrollTo(0, 0) }
  const handleBackToList = () => { setShowDetail(false); setSelectedItem(null) }

  // ==========================================
  // DETAIL VIEW (GỌI API monthly_timesheet)
  // ==========================================
  const TimekeepingDetailView = ({ item, onBack }) => {
    const [timesheets, setTimesheets] = useState([])
    const [detailLoading, setDetailLoading] = useState(false)

    // ✅ 2. API: LOAD CHI TIẾT BẢNG CÔNG
    useEffect(() => {
        const loadDetail = async () => {
            if (!item.rawMonth || !item.rawYear) return
            setDetailLoading(true)
            try {
                // Gọi API lấy dữ liệu monthly_timesheet
                const res = await fetchMonthlyTimesheets({ month: item.rawMonth, year: item.rawYear })
                
                // Backend trả về: ApiResponse<List<MonthlyTimesheetDTO>>
                // unwrap đã xử lý lấy data, nên res chính là List
                const list = Array.isArray(res) ? res : (res.content || [])
                setTimesheets(list)
            } catch (error) {
                console.error("Lỗi tải chi tiết bảng công:", error)
                setTimesheets([])
            } finally {
                setDetailLoading(false)
            }
        }
        loadDetail()
    }, [item])

    return (
      <div className="timekeeping-detail fade-in">
        {/* HEADER CHI TIẾT */}
        <div className="pc-header border-bottom-0 pb-0">
            <div className="left d-flex align-items-center gap-2" style={{ maxWidth: '70%' }}>
                {/* Nút Quay lại - FIX HOVER */}
                <div 
                    role="button"
                    onClick={onBack} 
                    className="d-flex align-items-center text-secondary fw-semibold border px-3 py-1 rounded bg-white"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                    <CIcon icon={cilArrowLeft} className="me-2" /> Quay lại
                </div>

                <div className="fw-bold fs-5 text-truncate ms-2" title={item.name}>
                    {item.name}
                </div>
                
                <CBadge color={item.status === 'Đã khóa' ? 'secondary' : 'success'} shape="rounded-pill">
                    {item.status}
                </CBadge>
            </div>

            <div className="right d-flex gap-2">
                <CButton color="white" className="border d-flex align-items-center">
                    <CIcon icon={cilCloudDownload} className="me-2" /> Xuất Excel
                </CButton>
            </div>
        </div>

        {/* CONTENT CARD */}
        <CCard className="shadow-sm border-0 mt-3" style={{ minHeight: '600px' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                <strong>Danh sách nhân viên ({item.rawMonth}/{item.rawYear})</strong>
            </div>

            {/* TABLE CHI TIẾT */}
            <CCardBody className="p-0 position-relative">
                <CTable hover responsive bordered className="mb-0 text-center align-middle small-text-table">
                    <CTableHead color="light" className="text-nowrap fw-semibold">
                        <CTableRow>
                            <CTableHeaderCell style={{ width: '50px' }}>STT</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: '100px' }}>Mã NV</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: '200px' }} className="text-start">Họ và tên</CTableHeaderCell>
                            <CTableHeaderCell>Công chuẩn</CTableHeaderCell>
                            <CTableHeaderCell>Công thực tế</CTableHeaderCell>
                            <CTableHeaderCell>Nghỉ có lương</CTableHeaderCell>
                            <CTableHeaderCell>Nghỉ không lương</CTableHeaderCell>
                            <CTableHeaderCell>Đi muộn (phút)</CTableHeaderCell>
                            <CTableHeaderCell>Tổng OT (giờ)</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {detailLoading ? (
                            <CTableRow>
                                <CTableDataCell colSpan={9} className="py-5"><CSpinner color="primary"/></CTableDataCell>
                            </CTableRow>
                        ) : timesheets.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={9} className="text-center py-5">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <CIcon icon={cilFile} size="4xl" className="text-secondary opacity-25 mb-2" />
                                        <span className="text-medium-emphasis">Chưa có dữ liệu chấm công tháng này</span>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            // ✅ MAP DỮ LIỆU TỪ API monthly_timesheet
                            timesheets.map((ts, index) => (
                                <CTableRow key={ts.id || index}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>{ts.employeeCode || `#${ts.employeeId}`}</CTableDataCell>
                                    <CTableDataCell className="text-start fw-semibold">{ts.employeeName || '---'}</CTableDataCell>
                                    <CTableDataCell>{ts.standardWorkDays}</CTableDataCell>
                                    <CTableDataCell className="text-success fw-bold">{ts.actualWorkDays}</CTableDataCell>
                                    <CTableDataCell>{ts.paidLeaveDays}</CTableDataCell>
                                    <CTableDataCell>{ts.unpaidLeaveDays}</CTableDataCell>
                                    <CTableDataCell className={ts.totalLateMinutes > 0 ? 'text-danger' : ''}>
                                        {ts.totalLateMinutes}
                                    </CTableDataCell>
                                    <CTableDataCell>{ts.totalOtHours}</CTableDataCell>
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
      </div>
    )
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="payroll-components">
      
      {showDetail && selectedItem ? (
        <TimekeepingDetailView item={selectedItem} onBack={handleBackToList} />
      ) : (
        // LIST VIEW
        <>
            <div className="pc-header">
                <div className="left">
                <div className="title">Chấm công tổng hợp</div>
                <div className="filters">
                    <div className="filter-left">
                        <div className="position-relative w-100">
                            <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 9, color: '#adb5bd' }} />
                            <CFormInput 
                                value={q} onChange={(e) => setQ(e.target.value)}
                                placeholder="Tìm kiếm" size="sm" style={{ paddingLeft: 28, borderRadius: 6 }} 
                            />
                        </div>
                    </div>
                    <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
                        <CFormSelect size="sm" className="w-auto" style={{ minWidth: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Tất cả trạng thái</option>
                            <option value="Đang theo dõi">Đang theo dõi</option>
                            <option value="Đã khóa">Đã khóa</option>
                        </CFormSelect>
                        
                        <CButton color="white" size="sm" className="border" onClick={loadPeriods} title="Tải lại"><CIcon icon={cilReload} size="lg" /></CButton>
                        <CButton color={showFilter ? "secondary" : "white"} size="sm" className="border" onClick={() => setShowFilter(!showFilter)}><CIcon icon={cilFilter} size="lg" /></CButton>
                        <CButton color="white" size="sm" className="border" onClick={handleOpenSettings}><CIcon icon={cilSettings} size="lg" /></CButton>
                    </div>
                </div>
                </div>
                <div className="right">
                    {/* Nút Thêm mới */}
                    <CButton color="success" size="sm" className="text-white d-flex align-items-center" onClick={handleAddNew}>
                        <CIcon icon={cilPlus} className="me-2" /> Thêm mới
                    </CButton>
                </div>
            </div>

            <CCard className="pc-table shadow-sm border-0 mt-3">
                <CCardHeader className="bg-light small text-medium-emphasis">
                    {loading ? 'Đang tải dữ liệu...' : `Tổng số bản ghi: ${totalItems}`}
                </CCardHeader>
                <CCardBody className="p-0">
                    <CTable hover responsive align="middle" className="mb-0">
                        <CTableHead color="light" className="text-medium-emphasis">
                            <CTableRow>
                                <CTableHeaderCell className="w-1"><input type="checkbox"/></CTableHeaderCell>
                                {visibleColumns.name && <CTableHeaderCell>Tên bảng chấm công</CTableHeaderCell>}
                                {visibleColumns.time && <CTableHeaderCell>Thời gian</CTableHeaderCell>}
                                {visibleColumns.paymentDate && <CTableHeaderCell>Ngày chi trả dự kiến</CTableHeaderCell>}
                                {visibleColumns.status && <CTableHeaderCell>Trạng thái</CTableHeaderCell>}
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {loading ? (
                                <CTableRow><CTableDataCell colSpan={5} className="text-center py-5"><CSpinner/></CTableDataCell></CTableRow>
                            ) : paginatedView.length === 0 ? (
                                <CTableRow><CTableDataCell colSpan={5} className="text-center py-5">Không có dữ liệu</CTableDataCell></CTableRow>
                            ) : (
                                paginatedView.map((item) => (
                                    <CTableRow key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                                        <CTableDataCell onClick={(e) => e.stopPropagation()}><input type="checkbox"/></CTableDataCell>
                                        {visibleColumns.name && <CTableDataCell className="fw-semibold text-primary">{item.name}</CTableDataCell>}
                                        {visibleColumns.time && <CTableDataCell>{item.time}</CTableDataCell>}
                                        {visibleColumns.paymentDate && <CTableDataCell>{item.paymentDate || '—'}</CTableDataCell>}
                                        {visibleColumns.status && <CTableDataCell><CBadge color={item.status === 'Đang theo dõi' ? 'success' : 'secondary'} shape="rounded-pill">{item.status}</CBadge></CTableDataCell>}
                                    </CTableRow>
                                ))
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>
                {/* Pagination */}
                <div className="pc-pagination d-flex justify-content-between align-items-center p-3 border-top">
                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-medium-emphasis">Số bản ghi/trang</span>
                        <CFormSelect size="sm" style={{ width: '70px' }} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}><option value={25}>25</option><option value={50}>50</option></CFormSelect>
                        <span className="small text-medium-emphasis ms-2 border-start ps-3">{totalItems > 0 ? `${startRange} - ${endRange} trên tổng số ${totalItems} bản ghi` : '0 bản ghi'}</span>
                    </div>
                    <div className="nav">
                        <button className="btn btn-sm btn-light border me-1" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
                        <span className="px-2 small fw-bold">Trang {page}</span>
                        <button className="btn btn-sm btn-light border ms-1" disabled={page * pageSize >= totalItems} onClick={() => setPage(page + 1)}>›</button>
                    </div>
                </div>
            </CCard>
        </>
      )}

      {/* CÁC MODAL & TOAST */}
      <CToaster ref={toaster} push={toast} placement="top-end" />
      
      {/* Offcanvas Filter */}
      <COffcanvas placement="end" visible={showFilter} onHide={() => setShowFilter(false)} className="filter-sidebar" backdrop={false}>
        <COffcanvasHeader><COffcanvasTitle>Bộ lọc</COffcanvasTitle><CCloseButton className="text-reset" onClick={() => setShowFilter(false)} /></COffcanvasHeader>
        <COffcanvasBody className="d-flex flex-column h-100">
           <div className="mb-3 position-relative"><CFormInput type="text" placeholder="Tìm kiếm..." className="ps-5" value={sidebarSearch} onChange={(e) => setSidebarSearch(e.target.value)} /><CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" /></div>
          <div className="filter-list flex-grow-1 overflow-auto">{displayedFilterOptions.map((opt) => (<CFormCheck key={opt.id} id={`filter-${opt.id}`} label={opt.label} checked={activeFilters.includes(opt.id)} onChange={() => {}} className="mb-3" />))}</div>
           <div className="filter-footer d-flex gap-2 mt-auto pt-4 border-top"><CButton color="white" className="border w-50" onClick={() => { setActiveFilters([]); setSidebarSearch('') }}>Bỏ lọc</CButton><CButton color="success" className="text-white w-50" onClick={() => setShowFilter(false)}>Áp dụng</CButton></div>
        </COffcanvasBody>
      </COffcanvas>

      {/* Settings Modal */}
      <CModal visible={showSettings} onClose={() => setShowSettings(false)} alignment="center" className="settings-modal" scrollable={false}>
        <CModalHeader className="position-relative"><h5 className="modal-title">Tùy chỉnh cột</h5><div className="position-absolute" style={{ right: '50px', top: '18px', cursor: 'pointer', color: '#6c757d' }} title="Đặt lại mặc định" onClick={handleResetSettings}><CIcon icon={cilReload} size="lg" /></div></CModalHeader>
        <CModalBody>
            <CForm><CInputGroup className="mb-3"><CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText><CFormInput placeholder="Tìm kiếm" value={colSearch} onChange={(e) => setColSearch(e.target.value)} /></CInputGroup>
                <div className="column-list">{COLUMN_CONFIG.filter(col => col.label.toLowerCase().includes(colSearch.toLowerCase())).map((col) => (<CFormCheck key={col.key} id={`col-${col.key}`} label={col.label} checked={tempColumns[col.key]} onChange={() => toggleColumn(col.key)} className="mb-2"/>))}</div>
            </CForm>
        </CModalBody>
        <CModalFooter><CButton color="success" className="text-white" onClick={handleSaveSettings}>Lưu</CButton></CModalFooter>
      </CModal>

      {/* Add Modal */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} alignment="center" size="lg" backdrop="static">
        <CModalHeader onClose={() => setShowAddModal(false)}><CModalTitle className="fw-bold fs-5">Thêm bảng chấm công</CModalTitle></CModalHeader>
        <CModalBody><p className="text-muted">Vui lòng tạo Kỳ lương mới để hệ thống tự động sinh bảng công tương ứng.</p></CModalBody>
        <CModalFooter><CButton color="secondary" variant="ghost" onClick={() => setShowAddModal(false)}>Đóng</CButton></CModalFooter>
      </CModal>

      {/* Confirm Modal */}
      <CModal visible={showConfirmModal} onClose={handleCancelSave} alignment="center">
        <CModalHeader><CModalTitle>Xác nhận lưu</CModalTitle></CModalHeader>
        <CModalBody className="text-center py-4"><CIcon icon={cilWarning} size="4xl" className="text-warning mb-3"/><p className="fs-5">Xác nhận?</p></CModalBody>
        <CModalFooter><CButton color="secondary" variant="ghost" onClick={handleCancelSave}>Hủy bỏ</CButton><CButton color="success" className="text-white" onClick={handleConfirmSave}>Đồng ý</CButton></CModalFooter>
      </CModal>

    </div>
  )
}

export default TimekeepingPage