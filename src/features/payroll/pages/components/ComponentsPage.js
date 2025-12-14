import {
  cilArrowLeft,
  cilFilter,
  cilPlus,
  cilReload,
  cilSave,
  cilSearch,
  cilSettings,
  cilWarning,
  cilTrash, // 1. Import icon thùng rác
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
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../scss/components-page.scss'

// ✅ 2. Import hàm xóa từ API (Giả sử bạn đã thêm hàm này vào file api)
import { 
  fetchSalaryComponents, 
  updateSalaryComponent, 
  deleteSalaryComponent 
} from '../../api/salaryComponentApi'

// --- CẤU HÌNH CỘT ---
const COLUMN_CONFIG = [
  { key: 'code', label: 'Mã thành phần' },
  { key: 'name', label: 'Tên thành phần' },
  { key: 'type', label: 'Loại thành phần' },
  { key: 'amount', label: 'Giá trị mặc định' },
  { key: 'description', label: 'Mô tả' },
  { key: 'status', label: 'Trạng thái' },
]

const INITIAL_VISIBLE_COLUMNS = COLUMN_CONFIG.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {})

const FILTER_OPTIONS_LIST = [
  { id: 'code', label: 'Mã thành phần' },
  { id: 'name', label: 'Tên thành phần' },
  { id: 'type', label: 'Loại thành phần' },
]

const formatVND = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
    : '0 ₫'

export default function ComponentsPage() {
  const navigate = useNavigate()

  // Data
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Filter/Pagination
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // UI
  const [showFilter, setShowFilter] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Confirm Save + Toast
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [tempFormData, setTempFormData] = useState(null)

  const [toast, setToast] = useState(0)
  const toaster = useRef()

  // Settings
  const [filterSearch, setFilterSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState(['code', 'name', 'type'])
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [tempColumns, setTempColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [colSearch, setColSearch] = useState('')

  // --- MAP API -> UI ROW ---
  const mapApiDataToRow = (item) => {
    const rawType = item.type 
    const typeLabel =
      rawType === 'earning' ? 'Thu nhập' : rawType === 'deduction' ? 'Khấu trừ' : rawType

    const amountNumber = Number(item.amount)
    const hasValidAmount = Number.isFinite(amountNumber)

    return {
      id: item.salaryComponentId,
      code: item.code,
      name: item.name,
      type: typeLabel,
      rawType,
      rawAmount: hasValidAmount ? amountNumber : 0, // Fix về 0 nếu null
      amount: hasValidAmount ? formatVND(amountNumber) : '—',
      description: item.description || '—',
      rawIsActive: !!item.isActive,
      status: item.isActive ? 'Đang theo dõi' : 'Ngừng theo dõi',
    }
  }

  // --- LOAD DATA ---
  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchSalaryComponents()
      const mapped = (res || []).map(mapApiDataToRow)
      setRows(mapped)
      // Không reset page về 1 để giữ trải nghiệm người dùng
    } catch (err) {
      console.error(err)
      setError('Không tải được dữ liệu. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // --- SETTINGS ---
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

  // --- ROW CLICK -> DETAIL ---
  const handleRowClick = (item) => {
    setSelectedItem({ ...item })
    setShowDetail(true)
    window.scrollTo(0, 0)
  }
  const handleBackToList = () => {
    setShowDetail(false)
    setSelectedItem(null)
  }

  // --- SAVE FLOW ---
  const handleTriggerSave = (formData) => {
    setTempFormData(formData)
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    if (!tempFormData) return

    const payload = {
      name: tempFormData.name,
      type: tempFormData.rawType || 'earning',
      description: tempFormData.description,
      amount: Number(tempFormData.rawAmount ?? 0), 
      isActive: tempFormData.status === 'Đang theo dõi',
    }
    try {
      await updateSalaryComponent(tempFormData.id, payload)
      await loadData()

      setToast(
        <CToast autohide delay={3000} color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody>Cập nhật thành công!</CToastBody>
            <CCloseButton className="me-2 m-auto" white />
          </div>
        </CToast>,
      )
      handleBackToList()
    } catch (e) {
      alert('Lỗi lưu dữ liệu: ' + (e.response?.data?.message || e.message))
    } finally {
      setShowConfirmModal(false)
      setTempFormData(null)
    }
  }

  // --- FILTER ---
  const filtered = useMemo(() => {
    let data = rows
    if (q) {
      const s = q.toLowerCase()
      data = data.filter((r) =>
        activeFilters.some((f) => (String(r[f]) || '').toLowerCase().includes(s)),
      )
    }
    if (statusFilter) data = data.filter((r) => r.status === statusFilter)
    return data
  }, [q, statusFilter, rows, activeFilters])

  const displayedFilterOptions = useMemo(() => {
    if (!filterSearch) return FILTER_OPTIONS_LIST
    const s = filterSearch.toLowerCase()
    return FILTER_OPTIONS_LIST.filter((opt) => opt.label.toLowerCase().includes(s))
  }, [filterSearch])

  // --- PAGINATION ---
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const startRange = filtered.length > 0 ? (page - 1) * pageSize + 1 : 0
  const endRange = Math.min(page * pageSize, filtered.length)
  const view = filtered.slice((page - 1) * pageSize, page * pageSize)

  const StatusBadge = ({ value }) => {
    const color = value === 'Đang theo dõi' ? 'success' : 'secondary'
    return (
      <CBadge color={color} shape="rounded-pill">
        {value}
      </CBadge>
    )
  }

  // ==========================
  // DETAIL VIEW (Đã Cập Nhật Nút Xóa)
  // ==========================
  const DetailView = ({ item, onSave, onBack, refreshData }) => {
    const [formData, setFormData] = useState({ ...item })
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }))

    // Logic Xóa
    const handleDelete = async () => {
      try {
        // Gọi API xóa mềm
        await deleteSalaryComponent(item.id)
        
        // Tải lại danh sách
        await refreshData()
        
        // Hiển thị thông báo (dùng alert hoặc toast tùy ý, ở đây dùng alert cho nhanh)
        // Nếu muốn toast đẹp thì cần truyền setter toast từ component cha xuống
        alert('Đã xóa thành phần lương thành công!')
        
        // Quay lại
        onBack()
      } catch (error) {
        alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message))
      } finally {
        setShowDeleteModal(false)
      }
    }

    return (
      <div className="detail-view-container fade-in">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              role="button"
              onClick={onBack}
              className="d-flex align-items-center text-secondary fw-semibold"
              style={{ cursor: 'pointer', userSelect: 'none', fontSize: '14px' }}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Quay lại
            </div>

            <h4 className="mb-0 fw-bold ms-3">{formData.name}</h4>
            <StatusBadge value={formData.status} />
          </div>

          <div className="d-flex gap-2">
            {/* 👇 3. NÚT XÓA */}
            <CButton
              color="danger"
              variant="outline"
              className="d-flex align-items-center"
              onClick={() => setShowDeleteModal(true)}
            >
              <CIcon icon={cilTrash} className="me-2" /> Xóa
            </CButton>

            <CButton
              color="success"
              className="text-white d-flex align-items-center"
              onClick={() => onSave(formData)}
            >
              <CIcon icon={cilSave} className="me-2" /> Lưu thay đổi
            </CButton>
          </div>
        </div>

        <CCard className="shadow-sm border-0">
          <CCardBody className="p-4">
            <CForm className="detail-form" style={{ maxWidth: '1000px' }}>
              {/* Form inputs giữ nguyên như cũ */}
              {/* 1. Tên */}
              <CRow className="mb-4 align-items-center">
                <CCol sm={3}>
                  <CFormLabel className="fw-bold mb-0">Tên thành phần <span className="text-danger">*</span></CFormLabel>
                </CCol>
                <CCol sm={9}>
                  <CFormInput value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                </CCol>
              </CRow>

              {/* 2. Mã */}
              <CRow className="mb-4 align-items-center">
                <CCol sm={3}>
                  <CFormLabel className="fw-bold mb-0">Mã thành phần</CFormLabel>
                </CCol>
                <CCol sm={9}>
                  <CFormInput value={formData.code || ''} disabled className="bg-light text-muted" />
                </CCol>
              </CRow>

              {/* 3. Loại */}
              <CRow className="mb-4 align-items-center">
                <CCol sm={3}>
                  <CFormLabel className="fw-bold mb-0">Loại thành phần</CFormLabel>
                </CCol>
                <CCol sm={9}>
                  <CFormSelect
                    value={formData.rawType || 'earning'}
                    onChange={(e) => {
                      const v = e.target.value
                      handleChange('rawType', v)
                      handleChange('type', v === 'earning' ? 'Thu nhập' : 'Khấu trừ')
                    }}
                  >
                    <option value="earning">Thu nhập (Earning)</option>
                    <option value="deduction">Khấu trừ (Deduction)</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* 4. Giá trị mặc định (Đã fix lỗi số 0) */}
              <CRow className="mb-4 align-items-center">
                <CCol sm={3}>
                  <CFormLabel className="fw-bold mb-0">Giá trị mặc định</CFormLabel>
                </CCol>
                <CCol sm={9}>
                  <CFormInput
                    type="number"
                    min={0}
                    value={formData.rawAmount === 0 ? '' : formData.rawAmount} 
                    onChange={(e) => {
                      const valStr = e.target.value
                      const valNumber = valStr === '' ? 0 : Number(valStr)
                      handleChange('rawAmount', valNumber)
                      handleChange('amount', formatVND(valNumber))
                    }}
                  />
                  <div className="form-text text-primary fw-semibold mt-1">
                    {formData.amount || '0 ₫'}
                  </div>
                </CCol>
              </CRow>

              {/* 5. Mô tả */}
              <CRow className="mb-4 align-items-center">
                <CCol sm={3}>
                  <CFormLabel className="fw-bold mb-0">Mô tả</CFormLabel>
                </CCol>
                <CCol sm={9}>
                  <CFormInput value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
                </CCol>
              </CRow>

              <div className="border-bottom my-4"></div>

              {/* 6. Trạng thái */}
              <CRow className="mb-4 align-items-center">
                <CCol sm={3}>
                  <CFormLabel className="fw-bold mb-0">Trạng thái</CFormLabel>
                </CCol>
                <CCol sm={9} className="d-flex gap-4">
                  <CFormCheck
                    type="radio"
                    name="statusDetail"
                    label="Đang theo dõi"
                    checked={formData.status === 'Đang theo dõi'}
                    onChange={() => handleChange('status', 'Đang theo dõi')}
                  />
                  <CFormCheck
                    type="radio"
                    name="statusDetail"
                    label="Ngừng theo dõi"
                    checked={formData.status === 'Ngừng theo dõi'}
                    onChange={() => handleChange('status', 'Ngừng theo dõi')}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>

        {/* 👇 4. MODAL XÁC NHẬN XÓA */}
        <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} alignment="center">
          <CModalHeader>
            <CModalTitle>Xác nhận xóa</CModalTitle>
          </CModalHeader>
          <CModalBody className="py-4">
            <div className="text-center mb-3">
              <CIcon icon={cilWarning} size="4xl" className="text-danger" />
            </div>
            <p className="text-center fs-5">
              Bạn có chắc chắn muốn xóa thành phần <strong>{formData.name}</strong>?
            </p>
            <p className="text-center text-muted small">
              Dữ liệu sẽ bị ẩn khỏi danh sách nhưng vẫn được lưu trữ trong hệ thống để phục vụ tra cứu lịch sử.
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Hủy bỏ
            </CButton>
            <CButton color="danger" className="text-white" onClick={handleDelete}>
              Xóa thành phần
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    )
  }

  // ==========================
  // MAIN RENDER
  // ==========================
  return (
    <div className="payroll-components">
      {showDetail && selectedItem ? (
        // ✅ 5. Truyền refreshData vào DetailView để reload sau khi xóa
        <DetailView 
          item={selectedItem} 
          onSave={handleTriggerSave} 
          onBack={handleBackToList} 
          refreshData={loadData} 
        />
      ) : (
        <>
          {/* Header và Table giữ nguyên như code cũ */}
          <div className="pc-header">
            <div className="left">
              <div className="title">Thành phần lương</div>
              <div className="filters">
                <div className="filter-left">
                  <div className="position-relative w-100">
                    <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 9, color: '#adb5bd' }} />
                    <CFormInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Tìm kiếm" size="sm" style={{ paddingLeft: 28, borderRadius: 6 }} />
                  </div>
                </div>
                <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
                  <CFormSelect size="sm" className="w-auto" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} style={{ minWidth: '160px' }}>
                    <option value="">Tất cả trạng thái</option>
                    <option>Đang theo dõi</option>
                    <option>Ngừng theo dõi</option>
                  </CFormSelect>
                  <CButton color="light" variant="ghost" size="sm" onClick={loadData} title="Tải lại"><CIcon icon={cilReload} size="lg" /></CButton>
                  <CButton color="light" variant="ghost" size="sm" onClick={() => setShowFilter((prev) => !prev)} title="Bộ lọc"><CIcon icon={cilFilter} size="lg" /></CButton>
                  <CButton color="light" variant="ghost" size="sm" onClick={handleOpenSettings} title="Tùy chỉnh cột"><CIcon icon={cilSettings} size="lg" /></CButton>
                </div>
              </div>
            </div>
            <div className="right">
              <CButton color="success" size="sm" onClick={() => navigate('/payroll/components/add')}><CIcon icon={cilPlus} className="me-1" /> Thêm mới</CButton>
            </div>
          </div>

          <CCard className="pc-table shadow-sm border-0">
            <CCardHeader className="bg-light small text-medium-emphasis">
              {loading ? 'Đang tải dữ liệu...' : error ? <span className="text-danger">{error}</span> : `Tổng số bản ghi: ${filtered.length}`}
            </CCardHeader>

            <CCardBody className="p-0">
              <CTable hover responsive align="middle" className="mb-0">
                <CTableHead color="light" className="text-medium-emphasis">
                  <CTableRow>
                    <CTableHeaderCell className="w-1"></CTableHeaderCell>
                    {visibleColumns.code && <CTableHeaderCell>Mã thành phần</CTableHeaderCell>}
                    {visibleColumns.name && <CTableHeaderCell>Tên thành phần</CTableHeaderCell>}
                    {visibleColumns.type && <CTableHeaderCell>Loại thành phần</CTableHeaderCell>}
                    {visibleColumns.amount && <CTableHeaderCell>Giá trị mặc định</CTableHeaderCell>}
                    {visibleColumns.description && <CTableHeaderCell>Mô tả</CTableHeaderCell>}
                    {visibleColumns.status && <CTableHeaderCell>Trạng thái</CTableHeaderCell>}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {!loading && view.map((r) => (
                    <CTableRow key={r.id} onClick={() => handleRowClick(r)} style={{ cursor: 'pointer' }}>
                      <CTableDataCell className="w-1" onClick={(e) => e.stopPropagation()}><input type="checkbox" /></CTableDataCell>
                      {visibleColumns.code && <CTableDataCell className="text-primary fw-semibold">{r.code}</CTableDataCell>}
                      {visibleColumns.name && <CTableDataCell>{r.name}</CTableDataCell>}
                      {visibleColumns.type && <CTableDataCell>{r.type}</CTableDataCell>}
                      {visibleColumns.amount && <CTableDataCell className="text-primary">{r.amount}</CTableDataCell>}
                      {visibleColumns.description && <CTableDataCell>{r.description}</CTableDataCell>}
                      {visibleColumns.status && <CTableDataCell><StatusBadge value={r.status} /></CTableDataCell>}
                    </CTableRow>
                  ))}
                  {!loading && view.length === 0 && <CTableRow><CTableDataCell colSpan={10} className="text-center py-5">Không có dữ liệu</CTableDataCell></CTableRow>}
                </CTableBody>
              </CTable>
            </CCardBody>

            <div className="pc-pagination d-flex justify-content-between align-items-center p-3 border-top">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-medium-emphasis">Số bản ghi/trang</span>
                <CFormSelect size="sm" style={{ width: '70px' }} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </CFormSelect>
                <span className="small text-medium-emphasis ms-2 border-start ps-3">{filtered.length > 0 ? `${startRange} - ${endRange} trên tổng số ${filtered.length} bản ghi` : '0 bản ghi'}</span>
              </div>
              <div className="nav">
                <button className="btn btn-sm btn-light border me-1" disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
                <span className="px-2 small fw-bold">Trang {page} / {totalPages}</span>
                <button className="btn btn-sm btn-light border ms-1" disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>›</button>
              </div>
            </div>
          </CCard>
        </>
      )}

      {/* ✅ Confirm Save Modal */}
      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Xác nhận lưu</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
          <CIcon icon={cilWarning} size="4xl" className="text-warning mb-3" />
          <p className="fs-5">Bạn có chắc chắn muốn lưu các thay đổi cho <strong>{tempFormData?.name}</strong>?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowConfirmModal(false)}>Hủy bỏ</CButton>
          <CButton color="success" className="text-white" onClick={handleConfirmSave}>Đồng ý</CButton>
        </CModalFooter>
      </CModal>

      <CToaster ref={toaster} push={toast} placement="top-end" />

      {/* Filter Offcanvas & Settings Modal giữ nguyên (đã rút gọn trong view này để code gọn hơn) */}
      <COffcanvas placement="end" visible={showFilter} onHide={() => setShowFilter(false)} className="filter-sidebar" backdrop={false}>
          <COffcanvasHeader>
            <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
            <CCloseButton className="text-reset" onClick={() => setShowFilter(false)} />
          </COffcanvasHeader>
          <COffcanvasBody className="d-flex flex-column">
             <div className="mb-3 position-relative">
               <CFormInput type="text" placeholder="Tìm kiếm..." className="ps-5" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
               <CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
             </div>
             <div className="filter-list flex-grow-1">
               {displayedFilterOptions.map(({ id, label }) => (
                 <CFormCheck key={id} id={`filter-${id}`} label={label} checked={activeFilters.includes(id)} onChange={() => setActiveFilters((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])} className="mb-2" />
               ))}
             </div>
             <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
               <CButton color="white" className="border w-50" onClick={() => { setActiveFilters(['code', 'name', 'type']); setFilterSearch(''); setShowFilter(false) }}>Bỏ lọc</CButton>
               <CButton color="success" className="text-white w-50" onClick={() => setShowFilter(false)}>Áp dụng</CButton>
             </div>
          </COffcanvasBody>
      </COffcanvas>

      <CModal visible={showSettings} onClose={() => setShowSettings(false)} alignment="center">
        <CModalHeader className="position-relative">
          <h5 className="modal-title">Tùy chỉnh cột</h5>
          <div className="position-absolute" style={{ right: '50px', top: '18px', cursor: 'pointer', color: '#6c757d' }} title="Đặt lại mặc định" onClick={handleResetSettings}><CIcon icon={cilReload} size="lg" /></div>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CInputGroup><CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText><CFormInput placeholder="Tìm kiếm" value={colSearch} onChange={(e) => setColSearch(e.target.value)} /></CInputGroup>
            <div className="column-list mt-3">
              {COLUMN_CONFIG.filter((col) => col.label.toLowerCase().includes(colSearch.toLowerCase())).map((col) => (
                <CFormCheck key={col.key} id={`col-${col.key}`} label={col.label} checked={tempColumns[col.key]} onChange={() => toggleColumn(col.key)} className="mb-2" />
              ))}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white" onClick={handleSaveSettings}>Lưu</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}