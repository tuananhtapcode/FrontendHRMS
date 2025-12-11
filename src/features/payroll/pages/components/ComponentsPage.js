
// import { cilFilter, cilPlus, cilSearch } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import {
//   CBadge,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CFormSelect,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow
// } from '@coreui/react'
// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import '../../scss/components-page.scss'

// import { listComponents } from '../../api/payrollApi.js'

// export default function ComponentsPage() {
//   const navigate = useNavigate()

//   // data từ "server" (mock)
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // filter/pagination
//   const [q, setQ] = useState('')
//   const [status, setStatus] = useState('')
//   const [org, setOrg] = useState('')
//   const [page, setPage] = useState(1)
//   const pageSize = 25

//   useEffect(() => {
//     let mounted = true
//     async function run() {
//       try {
//         setLoading(true)
//         setError(null)
//         const res = await listComponents()
//         if (!mounted) return
//         setRows(res.data || [])
//       } catch (e) {
//         if (!mounted) return
//         setError('Không tải được dữ liệu')
//       } finally {
//         if (mounted) setLoading(false)
//       }
//     }
//     run()
//     return () => { mounted = false }
//   }, [])

//   const filtered = useMemo(() => {
//     let data = rows
//     if (q) {
//       const s = q.toLowerCase()
//       data = data.filter(
//         (r) =>
//           (r.code || '').toLowerCase().includes(s) ||
//           (r.name || '').toLowerCase().includes(s) ||
//           (r.type || '').toLowerCase().includes(s) ||
//           (r.nature || '').toLowerCase().includes(s),
//       )
//     }
//     if (status) data = data.filter((r) => r.status === status)
//     if (org) data = data.filter((r) => (r.unit || '') === org)
//     return data
//   }, [q, status, org, rows])

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
//   const view = filtered.slice((page - 1) * pageSize, page * pageSize)

//   const StatusBadge = ({ value }) => {
//     const color = value === 'Đang theo dõi' ? 'success' : 'secondary'
//     return <CBadge color={color} shape="rounded-pill">{value}</CBadge>
//   }

//   return (
//     <div className="payroll-components">
//       <div className="pc-header">
//         <div className="left">
//           <div className="title">Thành phần lương</div>
//           <div className="filters">
//             <div className="search">
//               <CIcon icon={cilSearch} size="sm" />
//               <CFormInput
//                 value={q}
//                 onChange={(e) => { setQ(e.target.value); setPage(1) }}
//                 placeholder="Tìm kiếm"
//                 size="sm"
//               />
//             </div>

//             <CFormSelect
//               className="w-auto"
//               size="sm"
//               value={status}
//               onChange={(e) => { setStatus(e.target.value); setPage(1) }}
//             >
//               <option value="">Tất cả trạng thái</option>
//               <option>Đang theo dõi</option>
//               <option>Ngừng theo dõi</option>
//             </CFormSelect>

//             <CFormSelect
//               className="w-auto"
//               size="sm"
//               value={org}
//               onChange={(e) => { setOrg(e.target.value); setPage(1) }}
//             >
//               <option value="">Tất cả đơn vị</option>
//               <option>—</option>
//               <option>Thông tin nhân viên</option>
//               <option>Thuế TNCN</option>
//               <option>Lương</option>
//             </CFormSelect>

//             <CButton color="secondary" variant="outline" size="sm">
//               <CIcon icon={cilFilter} className="me-1" /> Bộ lọc
//             </CButton>
//           </div>
//         </div>

//         <div className="right">
//           <CButton
//             color="success"
//             size="sm"
//             onClick={() => navigate('/payroll/components/add')}
//           >
//             <CIcon icon={cilPlus} className="me-1" /> Thêm mới
//           </CButton>
//         </div>
//       </div>

//       <CCard className="pc-table shadow-sm border-0">
//         <CCardHeader className="bg-light small text-medium-emphasis">
//           {loading ? 'Đang tải...' : error ? error : `Tổng số bản ghi: ${filtered.length}`}
//         </CCardHeader>

//         <CCardBody className="p-0">
//           <CTable hover responsive align="middle" className="mb-0">
//             <CTableHead color="light" className="text-medium-emphasis">
//               <CTableRow>
//                 <CTableHeaderCell scope="col" className="w-1"></CTableHeaderCell>
//                 <CTableHeaderCell>Mã thành phần</CTableHeaderCell>
//                 <CTableHeaderCell>Tên thành phần</CTableHeaderCell>
//                 <CTableHeaderCell>Đơn vị áp dụng</CTableHeaderCell>
//                 <CTableHeaderCell>Loại thành phần</CTableHeaderCell>
//                 <CTableHeaderCell>Tính chất</CTableHeaderCell>
//                 <CTableHeaderCell>Kiểu giá trị</CTableHeaderCell>
//                 <CTableHeaderCell>Giá trị</CTableHeaderCell>
//                 <CTableHeaderCell>Nguồn tạo</CTableHeaderCell>
//                 <CTableHeaderCell>Trạng thái</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>

//             <CTableBody>
//               {!loading && view.map((r) => (
//                 <CTableRow key={r.code}>
//                   <CTableDataCell className="w-1">
//                     <input type="checkbox" aria-label={`select ${r.code}`} />
//                   </CTableDataCell>
//                   <CTableDataCell className="text-primary fw-semibold">{r.code}</CTableDataCell>
//                   <CTableDataCell>{r.name}</CTableDataCell>
//                   <CTableDataCell>{r.unit || '—'}</CTableDataCell>
//                   <CTableDataCell>{r.type}</CTableDataCell>
//                   <CTableDataCell>{r.nature}</CTableDataCell>
//                   <CTableDataCell>{r.valueType}</CTableDataCell>
//                   <CTableDataCell className="text-primary">{r.value || '—'}</CTableDataCell>
//                   <CTableDataCell>{r.source}</CTableDataCell>
//                   <CTableDataCell><StatusBadge value={r.status} /></CTableDataCell>
//                 </CTableRow>
//               ))}

//               {!loading && view.length === 0 && (
//                 <CTableRow>
//                   <CTableDataCell colSpan={10} className="text-center py-5 text-medium-emphasis">
//                     {error ? 'Có lỗi khi tải dữ liệu.' : 'Không có dữ liệu'}
//                   </CTableDataCell>
//                 </CTableRow>
//               )}

//               {loading && (
//                 <CTableRow>
//                   <CTableDataCell colSpan={10} className="text-center py-5 text-medium-emphasis">
//                     Đang tải dữ liệu...
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>
//         </CCardBody>

//         <div className="pc-pagination">
//           <div className="small text-medium-emphasis">
//             Số bản ghi/trang <span className="badge">25</span>
//           </div>
//           <div className="nav">
//             <button disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
//             <span className="page">{page}</span>
//             <span>/</span>
//             <span className="page">{totalPages}</span>
//             <button disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>›</button>
//           </div>
//         </div>
//       </CCard>
//     </div>
//   )
// }

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
  CTableRow
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../scss/components-page.scss'

// mock API
import { componentsApiMock } from '../../mocks/components/componentsApi.mock.js'

// --- 1. CẬP NHẬT LẠI CẤU HÌNH CỘT CHO ĐÚNG YÊU CẦU ---
const COLUMN_CONFIG = [
  { key: 'code', label: 'Mã thành phần' },
  { key: 'name', label: 'Tên thành phần' },
  { key: 'unit', label: 'Đơn vị áp dụng' },
  { key: 'type', label: 'Loại thành phần' },
  { key: 'nature', label: 'Tính chất' },
  { key: 'valueType', label: 'Kiểu giá trị' },
  { key: 'value', label: 'Giá trị' },
  { key: 'source', label: 'Nguồn tạo' },
  { key: 'status', label: 'Trạng thái' },
]

// Tạo state mặc định (tất cả đều hiện)
const INITIAL_VISIBLE_COLUMNS = COLUMN_CONFIG.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {})

const FILTER_OPTIONS_LIST = [
  { id: 'code', label: 'Mã thành phần' },
  { id: 'name', label: 'Tên thành phần' },
  { id: 'unit', label: 'Đơn vị áp dụng' },
  { id: 'type', label: 'Loại thành phần' },
  { id: 'nature', label: 'Tính chất' },
  { id: 'value', label: 'Giá trị' },
  { id: 'source', label: 'Nguồn tạo' },
]

export default function ComponentsPage() {
  const navigate = useNavigate()
  const { list } = componentsApiMock

  // data từ mock
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // filter/pagination chính
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [org, setOrg] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 25

  // panel states
  const [showFilter, setShowFilter] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // state tìm kiếm trong panel bộ lọc
  const [filterSearch, setFilterSearch] = useState('') 
  const [activeFilters, setActiveFilters] = useState(['code', 'name', 'type', 'nature'])

  // === LOGIC CHO MODAL SETTINGS ===
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [tempColumns, setTempColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [colSearch, setColSearch] = useState('')

  const handleOpenSettings = () => {
    setTempColumns({ ...visibleColumns })
    setColSearch('')
    setShowSettings(true)
  }

  const toggleColumn = (key) => {
    setTempColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveSettings = () => {
    setVisibleColumns(tempColumns)
    setShowSettings(false)
  }

  const handleResetSettings = () => {
    setTempColumns(INITIAL_VISIBLE_COLUMNS)
    setColSearch('')
  }
  // === HẾT LOGIC MODAL ===

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        setError(null)
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

  const displayedFilterOptions = useMemo(() => {
    if (!filterSearch) return FILTER_OPTIONS_LIST
    const s = filterSearch.toLowerCase()
    return FILTER_OPTIONS_LIST.filter(opt => opt.label.toLowerCase().includes(s))
  }, [filterSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const view = filtered.slice((page - 1) * pageSize, page * pageSize)

  const StatusBadge = ({ value }) => {
    const color = value === 'Đang theo dõi' ? 'success' : 'secondary'
    return <CBadge color={color} shape="rounded-pill">{value}</CBadge>
  }

  return (
    <div className="payroll-components">
      <div className="pc-header">
        <div className="left">
          <div className="title">Thành phần lương</div>
          <div className="filters">
            <div className="filter-left">
              <div className="position-relative w-100">
                <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 9, color: '#adb5bd' }} />
                <CFormInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm" size="sm" style={{ paddingLeft: 28, borderRadius: 6 }} />
              </div>
            </div>
            <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
              <CFormSelect size="sm" className="w-auto" value={status} onChange={(e) => setStatus(e.target.value)} style={{ minWidth: '160px' }}>
                <option value="">Tất cả trạng thái</option>
                <option>Đang theo dõi</option>
                <option>Ngừng theo dõi</option>
              </CFormSelect>
              <CFormSelect size="sm" className="w-auto" value={org} onChange={(e) => setOrg(e.target.value)} style={{ minWidth: '160px' }}>
                <option value="">Tất cả đơn vị</option>
                <option>Thông tin nhân viên</option>
                <option>Thuế TNCN</option>
                <option>Lương</option>
              </CFormSelect>
              <CButton color="light" variant="ghost" size="sm" onClick={() => setShowFilter((prev) => !prev)}><CIcon icon={cilFilter} size="lg" /></CButton>
              <CButton color="light" variant="ghost" size="sm" onClick={handleOpenSettings}><CIcon icon={cilSettings} size="lg" /></CButton>
            </div>
          </div>
        </div>
        <div className="right">
          <CButton color="success" size="sm" onClick={() => navigate('/payroll/components/add')}><CIcon icon={cilPlus} className="me-1" /> Thêm mới</CButton>
        </div>
      </div>

      <CCard className="pc-table shadow-sm border-0">
        <CCardHeader className="bg-light small text-medium-emphasis">
          {loading ? 'Đang tải...' : error ? error : `Tổng số bản ghi: ${filtered.length}`}
        </CCardHeader>

        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light" className="text-medium-emphasis">
              <CTableRow>
                <CTableHeaderCell className="w-1"></CTableHeaderCell>
                {/* HIỂN THỊ CỘT DỰA TRÊN visibleColumns */}
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
                    <CTableDataCell className="w-1"><input type="checkbox" aria-label={`select ${r.code}`} /></CTableDataCell>
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
                
               {!loading && view.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center py-5 text-medium-emphasis">
                    {error ? 'Có lỗi khi tải dữ liệu.' : 'Không có dữ liệu'}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
        <div className="pc-pagination">
          <div className="small text-medium-emphasis">Số bản ghi/trang <span className="badge">25</span></div>
          <div className="nav">
            <button disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
            <span className="page">{page}</span><span>/</span><span className="page">{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>›</button>
          </div>
        </div>
      </CCard>

      <COffcanvas placement="end" visible={showFilter} onHide={() => setShowFilter(false)} className="filter-sidebar" backdrop={false} scroll={true}>
        <COffcanvasHeader>
          <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setShowFilter(false)} />
        </COffcanvasHeader>
        <COffcanvasBody className="d-flex flex-column h-100">
          <div className="mb-3 position-relative">
            <CFormInput type="text" placeholder="Tìm kiếm..." className="ps-5" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
            <CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          </div>
          <div className="filter-list flex-grow-1">
            {displayedFilterOptions.map(({ id, label }) => (
              <CFormCheck key={id} id={`filter-${id}`} label={label} checked={activeFilters.includes(id)} onChange={() => setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])} className="mb-2" />
            ))}
          </div>
          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={() => { setActiveFilters(['code', 'name', 'type', 'nature']); setFilterSearch(''); setShowFilter(false) }}>Bỏ lọc</CButton>
            <CButton color="success" className="text-white w-50" onClick={() => setShowFilter(false)}>Áp dụng</CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      {/* ================= MODAL CÀI ĐẶT (ĐÃ CHỈNH SỬA) ================= */}
      <CModal 
        visible={showSettings} 
        onClose={() => setShowSettings(false)} 
        alignment="center" 
        className="settings-modal" // Class này dùng để ăn CSS xanh lá
        scrollable={false} 
      >
        <CModalHeader className="position-relative">
            <h5 className="modal-title">Tùy chỉnh cột</h5>
            <div className="position-absolute" style={{ right: '50px', top: '18px', cursor: 'pointer', color: '#6c757d' }} title="Đặt lại mặc định" onClick={handleResetSettings}>
                <CIcon icon={cilReload} size="lg" />
            </div>
        </CModalHeader>

        <CModalBody>
            <CForm>
                {/* Chỉ giữ lại ô tìm kiếm và danh sách cột */}
                <CInputGroup>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput placeholder="Tìm kiếm" value={colSearch} onChange={(e) => setColSearch(e.target.value)} />
                </CInputGroup>

                <div className="column-list">
                    {COLUMN_CONFIG
                        .filter(col => col.label.toLowerCase().includes(colSearch.toLowerCase()))
                        .map((col) => (
                           <CFormCheck 
                                key={col.key}
                                id={`col-${col.key}`} 
                                label={col.label} 
                                checked={tempColumns[col.key]}
                                onChange={() => toggleColumn(col.key)} 
                           />
                    ))}
                    {COLUMN_CONFIG.filter(col => col.label.toLowerCase().includes(colSearch.toLowerCase())).length === 0 && (
                        <div className="text-center text-muted small mt-2">Không tìm thấy cột phù hợp</div>
                    )}
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