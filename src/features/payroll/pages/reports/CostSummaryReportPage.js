import { cilFilter, cilPlus, cilReload, cilSearch, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
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
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
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

// mock API
import { componentsApiMock } from '../../mocks/components/componentsApi.mock.js'

// Định nghĩa danh sách tất cả các cột
const ALL_COLUMNS = {
  code: 'Mã thành phần',
  name: 'Tên thành phần',
  unit: 'Đơn vị áp dụng',
  // Nhóm chi tiết (Type, Nature, ValueType)
  type: 'Loại thành phần',
  nature: 'Tính chất',
  valueType: 'Kiểu giá trị',
  value: 'Giá trị',
  source: 'Nguồn tạo',
  status: 'Trạng thái',
}

export default function ComponentsPage() {
  const navigate = useNavigate()
  const { list } = componentsApiMock

  // --- DATA STATES ---
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- FILTER STATES ---
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [org, setOrg] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 25
  const [showFilter, setShowFilter] = useState(false)
  
  // State tìm kiếm trong Filter Panel (như câu trả lời trước)
  const [filterSearch, setFilterSearch] = useState('') 
  const [activeFilters, setActiveFilters] = useState(['code', 'name']) // Cột dùng để search data

  // --- SETTINGS MODAL STATES (MỚI) ---
  const [showSettings, setShowSettings] = useState(false)
  
  // visibleColumns: Cấu hình đang áp dụng thực tế trên Table
  const [visibleColumns, setVisibleColumns] = useState({
    code: true, name: true, unit: true, type: true, nature: true, 
    valueType: true, value: true, source: true, status: true
  })

  // tempColumns: Cấu hình tạm thời trong Modal (chưa lưu)
  const [tempColumns, setTempColumns] = useState(visibleColumns)
  
  // Search cột trong Modal
  const [colSearch, setColSearch] = useState('')
  
  // Gom nhóm (UI state)
  const [groupingMode, setGroupingMode] = useState('none')

  // --- LOAD DATA ---
  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        const res = await list()
        if (!mounted) return
        setRows(res.data || [])
      } catch {
        if (!mounted) return
        setError('Không tải được dữ liệu')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  // --- FILTER LOGIC ---
  const filtered = useMemo(() => {
    let data = rows
    if (q) {
      const s = q.toLowerCase()
      data = data.filter(r =>
        activeFilters.some(f => (r[f] || '').toLowerCase().includes(s))
      )
    }
    if (status) data = data.filter((r) => r.status === status)
    if (org) data = data.filter((r) => (r.unit || '') === org)
    return data
  }, [q, status, org, rows, activeFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const view = filtered.slice((page - 1) * pageSize, page * pageSize)

  // --- HANDLERS CHO SETTINGS MODAL ---
  
  // Khi mở modal, copy cấu hình hiện tại vào biến tạm
  const handleOpenSettings = () => {
    setTempColumns({ ...visibleColumns })
    setColSearch('')
    setShowSettings(true)
  }

  // Toggle checkbox cột
  const toggleColumn = (key) => {
    setTempColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Toggle cả nhóm (ví dụ: Đặc tính chi tiết)
  const toggleGroup = (keys) => {
    // Kiểm tra xem tất cả đang checked hay không
    const allChecked = keys.every(k => tempColumns[k])
    const newValue = !allChecked // Nếu tất cả checked -> uncheck hết, và ngược lại
    
    setTempColumns(prev => {
        const next = { ...prev }
        keys.forEach(k => next[k] = newValue)
        return next
    })
  }

  // Lưu cài đặt
  const handleSaveSettings = () => {
    setVisibleColumns(tempColumns)
    setShowSettings(false)
  }

  // Reset về mặc định
  const handleResetSettings = () => {
    const defaultCols = {
        code: true, name: true, unit: true, type: true, nature: true, 
        valueType: true, value: true, source: true, status: true
    }
    setTempColumns(defaultCols)
    setGroupingMode('none')
  }

  // Helper để hiển thị cột trong list (có hỗ trợ search)
  const showColInList = (label) => {
    return label.toLowerCase().includes(colSearch.toLowerCase())
  }

  const StatusBadge = ({ value }) => {
    const color = value === 'Đang theo dõi' ? 'success' : 'secondary'
    return <CBadge color={color} shape="rounded-pill">{value}</CBadge>
  }

  return (
    <div className="payroll-components">
      <div className="pc-header">
        <div className="left">
          <div className="title">Thành phần lương</div>
          {/* FILTER BAR GIỮ NGUYÊN */}
          <div className="filters">
            <div className="filter-left">
              <div className="position-relative w-100">
                <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 9, color: '#adb5bd' }} />
                <CFormInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm" size="sm" style={{ paddingLeft: 28, borderRadius: 6 }} />
              </div>
            </div>
            <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
                {/* ... Các select box giữ nguyên ... */}
              <CFormSelect size="sm" className="w-auto" value={status} onChange={(e) => setStatus(e.target.value)} style={{ minWidth: '160px' }}>
                <option value="">Tất cả trạng thái</option>
                <option>Đang theo dõi</option>
                <option>Ngừng theo dõi</option>
              </CFormSelect>
              <CButton color="light" variant="ghost" size="sm" onClick={() => setShowFilter(true)}>
                <CIcon icon={cilFilter} size="lg" />
              </CButton>
              {/* Nút mở Modal Settings */}
              <CButton color="light" variant="ghost" size="sm" onClick={handleOpenSettings}>
                <CIcon icon={cilSettings} size="lg" />
              </CButton>
            </div>
          </div>
        </div>
        <div className="right">
          <CButton color="success" size="sm" onClick={() => navigate('/payroll/components/add')}>
            <CIcon icon={cilPlus} className="me-1" /> Thêm mới
          </CButton>
        </div>
      </div>

      {/* ================= TABLE: CHỈ HIỂN THỊ CỘT TRONG visibleColumns ================= */}
      <CCard className="pc-table shadow-sm border-0">
        <CCardHeader className="bg-light small text-medium-emphasis">
          {loading ? 'Đang tải...' : `Tổng số bản ghi: ${filtered.length}`}
        </CCardHeader>
        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light" className="text-medium-emphasis">
              <CTableRow>
                <CTableHeaderCell className="w-1"></CTableHeaderCell>
                {visibleColumns.code && <CTableHeaderCell>Mã thành phần</CTableHeaderCell>}
                {visibleColumns.name && <CTableHeaderCell>Tên thành phần</CTableHeaderCell>}
                {visibleColumns.unit && <CTableHeaderCell>Đơn vị áp dụng</CTableHeaderCell>}
                {visibleColumns.type && <CTableHeaderCell>Loại thành phần</CTableHeaderCell>}
                {visibleColumns.nature && <CTableHeaderCell>Tính chất</CTableHeaderCell>}
                {visibleColumns.valueType && <CTableHeaderCell>Kiểu giá trị</CTableHeaderCell>}
                {visibleColumns.value && <CTableHeaderCell>Giá trị</CTableHeaderCell>}
                {visibleColumns.source && <CTableHeaderCell>Nguồn tạo</CTableHeaderCell>}
                {visibleColumns.status && <CTableHeaderCell>Trạng thái</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {!loading && view.map((r) => (
                  <CTableRow key={r.code}>
                    <CTableDataCell className="w-1"><input type="checkbox" /></CTableDataCell>
                    {visibleColumns.code && <CTableDataCell className="text-primary fw-semibold">{r.code}</CTableDataCell>}
                    {visibleColumns.name && <CTableDataCell>{r.name}</CTableDataCell>}
                    {visibleColumns.unit && <CTableDataCell>{r.unit || '—'}</CTableDataCell>}
                    {visibleColumns.type && <CTableDataCell>{r.type}</CTableDataCell>}
                    {visibleColumns.nature && <CTableDataCell>{r.nature}</CTableDataCell>}
                    {visibleColumns.valueType && <CTableDataCell>{r.valueType}</CTableDataCell>}
                    {visibleColumns.value && <CTableDataCell className="text-primary">{r.value || '—'}</CTableDataCell>}
                    {visibleColumns.source && <CTableDataCell>{r.source}</CTableDataCell>}
                    {visibleColumns.status && <CTableDataCell><StatusBadge value={r.status} /></CTableDataCell>}
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
        <div className="pc-pagination">
             {/* ... Pagination giữ nguyên ... */}
             <div className="small text-medium-emphasis">Trang {page} / {totalPages}</div>
        </div>
      </CCard>

      {/* ================= MODAL CÀI ĐẶT (Thay thế Offcanvas cũ) ================= */}
      <CModal visible={showSettings} onClose={() => setShowSettings(false)} alignment="center" className="settings-modal">
        <CModalHeader onClose={() => setShowSettings(false)} className="border-0 pb-0">
            <div className="d-flex justify-content-between w-100 align-items-center">
                <h5 className="modal-title fw-bold">Tùy chỉnh</h5>
                <div 
                    className="position-relative d-inline-block me-3" 
                    style={{cursor: 'pointer'}} 
                    onClick={handleResetSettings}
                    title="Đặt lại mặc định"
                >
                    <CIcon icon={cilReload} size="lg" className="text-secondary" />
                </div>
            </div>
        </CModalHeader>
        <CModalBody>
            <CForm>
                {/* Phần Gom nhóm bản ghi */}
                <div className="mb-4">
                    <CFormLabel className="fw-bold mb-2">Gom nhóm bản ghi</CFormLabel>
                    <div className="d-flex gap-4">
                        <CFormCheck 
                            type="radio" name="gomNhom" id="khongGomNhom" label="Không" 
                            checked={groupingMode === 'none'} onChange={() => setGroupingMode('none')} 
                        />
                        <CFormCheck 
                            type="radio" name="gomNhom" id="motCap" label="Một cấp" 
                            checked={groupingMode === '1'} onChange={() => setGroupingMode('1')} 
                        />
                        <CFormCheck 
                            type="radio" name="gomNhom" id="haiCap" label="Hai cấp" 
                            checked={groupingMode === '2'} onChange={() => setGroupingMode('2')} 
                        />
                    </div>
                </div>

                {/* Phần Danh sách cột */}
                <div>
                    <CFormLabel className="fw-bold mb-2">Cột hiển thị</CFormLabel>
                    <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-white border-end-0"><CIcon icon={cilSearch} /></CInputGroupText>
                        <CFormInput 
                            className="border-start-0 ps-0" 
                            placeholder="Tìm kiếm cột..." 
                            value={colSearch}
                            onChange={(e) => setColSearch(e.target.value)}
                        />
                    </CInputGroup>

                    <div className="column-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {/* Các cột đơn lẻ */}
                        {showColInList(ALL_COLUMNS.code) && 
                            <CFormCheck id="colCode" label={ALL_COLUMNS.code} checked={tempColumns.code} onChange={() => toggleColumn('code')} className="mb-3" />
                        }
                        {showColInList(ALL_COLUMNS.name) && 
                            <CFormCheck id="colName" label={ALL_COLUMNS.name} checked={tempColumns.name} onChange={() => toggleColumn('name')} className="mb-3" />
                        }
                        {showColInList(ALL_COLUMNS.unit) && 
                            <CFormCheck id="colUnit" label={ALL_COLUMNS.unit} checked={tempColumns.unit} onChange={() => toggleColumn('unit')} className="mb-3" />
                        }

                        {/* GIẢ LẬP NHÓM CỘT (NESTED) GIỐNG MẪU BẠN GỬI */}
                        <div className="mb-3">
                             {/* Checkbox cha để toggle cả nhóm */}
                             <CFormCheck 
                                id="colGroupDetail" 
                                label="Đặc tính chi tiết (Nhóm)" 
                                className="fw-bold"
                                checked={tempColumns.type && tempColumns.nature && tempColumns.valueType}
                                onChange={() => toggleGroup(['type', 'nature', 'valueType'])}
                             />
                             <div className="ms-3 mt-2 border-start ps-3">
                                {showColInList(ALL_COLUMNS.type) && 
                                    <CFormCheck id="colType" label={ALL_COLUMNS.type} checked={tempColumns.type} onChange={() => toggleColumn('type')} className="mb-2" />
                                }
                                {showColInList(ALL_COLUMNS.nature) && 
                                    <CFormCheck id="colNature" label={ALL_COLUMNS.nature} checked={tempColumns.nature} onChange={() => toggleColumn('nature')} className="mb-2" />
                                }
                                {showColInList(ALL_COLUMNS.valueType) && 
                                    <CFormCheck id="colValueType" label={ALL_COLUMNS.valueType} checked={tempColumns.valueType} onChange={() => toggleColumn('valueType')} className="mb-2" />
                                }
                             </div>
                        </div>

                        {showColInList(ALL_COLUMNS.value) && 
                            <CFormCheck id="colValue" label={ALL_COLUMNS.value} checked={tempColumns.value} onChange={() => toggleColumn('value')} className="mb-3" />
                        }
                        {showColInList(ALL_COLUMNS.source) && 
                            <CFormCheck id="colSource" label={ALL_COLUMNS.source} checked={tempColumns.source} onChange={() => toggleColumn('source')} className="mb-3" />
                        }
                        {showColInList(ALL_COLUMNS.status) && 
                            <CFormCheck id="colStatus" label={ALL_COLUMNS.status} checked={tempColumns.status} onChange={() => toggleColumn('status')} className="mb-3" />
                        }
                    </div>
                </div>
            </CForm>
        </CModalBody>
        <CModalFooter className="bg-light border-0">
             <CButton color="success" className="text-white w-100" onClick={handleSaveSettings}>Lưu cài đặt</CButton>
        </CModalFooter>
      </CModal>

      {/* COffcanvas FILTER CŨ GIỮ NGUYÊN */}
      <COffcanvas visible={showFilter} onHide={() => setShowFilter(false)} placement="end">
          <COffcanvasHeader>
             <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
             <CCloseButton className="text-reset" onClick={() => setShowFilter(false)} />
          </COffcanvasHeader>
          <COffcanvasBody>
              {/* Nội dung bộ lọc như cũ */}
              <p>Nội dung bộ lọc...</p>
          </COffcanvasBody>
      </COffcanvas>
    </div>
  )
}