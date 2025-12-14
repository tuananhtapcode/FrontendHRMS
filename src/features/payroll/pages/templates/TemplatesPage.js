import {
  cilArrowLeft,
  cilCheckCircle,
  cilDescription,
  cilFilter,
  cilLibrary,
  cilPlus,
  cilReload,
  cilSave,
  cilSearch,
  cilSettings,
  cilWarning, // Thêm icon cảnh báo
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
  CToast,      // Thêm Toast
  CToastBody,  // Thêm Toast Body
  CToaster     // Thêm Toaster
} from '@coreui/react'
import { useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import '../../scss/components-page.scss' 

// CẤU HÌNH CỘT
const COLUMN_CONFIG = [
  { key: 'name', label: 'Tên mẫu bảng lương' },
  { key: 'unit', label: 'Đơn vị áp dụng' },
  { key: 'position', label: 'Vị trí áp dụng' },
  { key: 'staff', label: 'Nhân viên áp dụng' },
  { key: 'status', label: 'Trạng thái' },
]

const INITIAL_VISIBLE_COLUMNS = COLUMN_CONFIG.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {})

const FILTER_OPTIONS_LIST = [
  { id: 'name', label: 'Tên mẫu bảng lương' },
  { id: 'position', label: 'Vị trí áp dụng' },
  { id: 'staff', label: 'Nhân viên áp dụng' },
]

const TemplatesPage = () => {
  // Dữ liệu mẫu
  const [data, setData] = useState([
     { id: 1, name: 'Mẫu lương văn phòng', unit: 'Khối văn phòng', position: 'Tất cả', staff: 'Tất cả', status: 'Đang áp dụng' },
     { id: 2, name: 'Mẫu lương kinh doanh', unit: 'Khối kinh doanh', position: 'Sale', staff: 'Tất cả', status: 'Ngừng áp dụng' },
     { id: 3, name: 'Mẫu lương thực tập sinh', unit: 'Khối đào tạo', position: 'Intern', staff: 'Tất cả', status: 'Đang áp dụng' },
     { id: 4, name: 'Mẫu lương quản lý', unit: 'Ban giám đốc', position: 'Manager', staff: 'Cấp cao', status: 'Đang áp dụng' },
  ])
  
  const navigate = useNavigate()

  // --- UI STATES ---
  const [showFilter, setShowFilter] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // --- MODAL CONFIRM & TOAST STATE ---
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingSaveItem, setPendingSaveItem] = useState(null) // Dữ liệu chờ lưu
  const [toast, setToast] = useState(0)
  const toaster = useRef()

  // --- SEARCH & FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('') // [MỚI] State lưu trạng thái lọc
  const [filterSearch, setFilterSearch] = useState('') 
  const [activeFilters, setActiveFilters] = useState(['name', 'position', 'staff'])

  // --- SETTINGS COLUMNS STATES ---
  const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [tempColumns, setTempColumns] = useState(INITIAL_VISIBLE_COLUMNS)
  const [colSearch, setColSearch] = useState('')

  // --- PAGINATION STATES ---
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)

  // ==========================================
  // XỬ LÝ LOGIC
  // ==========================================
  
  const filteredData = useMemo(() => {
    let result = data;
    
    // 1. Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase().trim();
      result = result.filter(item => 
        (item.name && item.name.toLowerCase().includes(lowerTerm)) ||
        (item.unit && item.unit.toLowerCase().includes(lowerTerm))
      );
    }

    // 2. [MỚI] Lọc theo trạng thái
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }

    return result;
  }, [data, searchTerm, statusFilter]); // [MỚI] Thêm statusFilter vào dependency

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startRange = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const endRange = Math.min(page * pageSize, totalItems)
  const paginatedView = filteredData.slice((page - 1) * pageSize, page * pageSize)

  const handleOpenSettings = () => {
    setTempColumns({ ...visibleColumns })
    setColSearch('')
    setShowSettings(true)
  }
  const toggleColumn = (key) => setTempColumns(prev => ({ ...prev, [key]: !prev[key] }))
  const handleSaveSettings = () => { setVisibleColumns(tempColumns); setShowSettings(false) }
  const handleResetSettings = () => { setTempColumns(INITIAL_VISIBLE_COLUMNS); setColSearch('') }

  const handleAddNew = () => navigate('new')

  const handleRowClick = (item) => {
    setSelectedItem(item)
    setShowDetail(true)
    window.scrollTo(0, 0)
  }

  const handleBackToList = () => {
    setShowDetail(false)
    setSelectedItem(null)
  }

  // --- LOGIC LƯU DỮ LIỆU ---
  
  // 1. Kích hoạt Modal hỏi (Được gọi từ DetailView)
  const handleTriggerSave = (formData) => {
    setPendingSaveItem(formData)
    setShowConfirmModal(true)
  }

  // 2. Xác nhận lưu (Được gọi từ Modal)
  const handleConfirmSave = () => {
    if (!pendingSaveItem) return;

    // Cập nhật dữ liệu vào danh sách chính
    setData(prevData => prevData.map(item => 
        item.id === pendingSaveItem.id ? pendingSaveItem : item
    ))
    
    // Cập nhật lại item đang hiển thị chi tiết
    setSelectedItem(pendingSaveItem)

    // Đóng modal & Reset
    setShowConfirmModal(false)
    setPendingSaveItem(null)

    // Hiển thị thông báo thành công (Toast)
    const successToast = (
      <CToast autohide={true} delay={3000} color="success" className="text-white align-items-center">
        <div className="d-flex">
          <CToastBody>Đã lưu thay đổi thành công!</CToastBody>
          <CCloseButton className="me-2 m-auto" white />
        </div>
      </CToast>
    )
    setToast(successToast)
  }

  const displayedFilterOptions = useMemo(() => {
    if (!filterSearch) return FILTER_OPTIONS_LIST
    const s = filterSearch.toLowerCase()
    return FILTER_OPTIONS_LIST.filter(opt => opt.label.toLowerCase().includes(s))
  }, [filterSearch])


  // ==========================================
  // COMPONENT DETAIL VIEW
  // ==========================================
  const DetailView = ({ item, onBack, onSave }) => {
    // State cục bộ để quản lý form
    const [formData, setFormData] = useState({ ...item })

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
      <div className="detail-view-container fade-in">
         {/* HEADER CHI TIẾT */}
         <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
                <CButton 
                    color="light" 
                    variant="outline" 
                    onClick={onBack} 
                    className="d-flex align-items-center border-secondary text-secondary"
                    style={{ height: '38px' }}
                >
                    <CIcon icon={cilArrowLeft} className="me-2" /> Quay lại
                </CButton>
                <h4 className="mb-0 fw-bold">{formData.name}</h4>
                <CBadge color={formData.status === 'Đang áp dụng' ? 'success' : 'secondary'} shape="rounded-pill">
                    {formData.status}
                </CBadge>
            </div>
            <div className="d-flex gap-2">
                <CButton 
                    color="success" 
                    className="text-white d-flex align-items-center"
                    onClick={() => onSave(formData)} // Gọi hàm mở modal của cha
                >
                    <CIcon icon={cilSave} className="me-2" /> Lưu thay đổi
                </CButton>
            </div>
        </div>

        {/* NỘI DUNG FORM */}
        <CCard className="shadow-sm border-0 mb-4">
            <CCardHeader className="bg-white fw-bold py-3">THÔNG TIN CHUNG</CCardHeader>
            <CCardBody className="p-4">
                <CForm>
                    <CRow className="mb-4 align-items-center">
                        <CCol sm={3}><CFormLabel className="fw-bold mb-0">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol sm={9}>
                            <CFormInput 
                                value={formData.unit} 
                                onChange={(e) => handleChange('unit', e.target.value)} 
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-4 align-items-center">
                        <CCol sm={3}><CFormLabel className="fw-bold mb-0">Vị trí áp dụng</CFormLabel></CCol>
                        <CCol sm={9}>
                            <CFormInput 
                                value={formData.position} 
                                onChange={(e) => handleChange('position', e.target.value)}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-4 align-items-center">
                        <CCol sm={3}><CFormLabel className="fw-bold mb-0">Nhân viên áp dụng</CFormLabel></CCol>
                        <CCol sm={9}>
                            <CFormInput 
                                value={formData.staff} 
                                onChange={(e) => handleChange('staff', e.target.value)}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-4 align-items-center">
                        <CCol sm={3}><CFormLabel className="fw-bold mb-0">Tên mẫu bảng lương <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol sm={9}>
                            <CFormInput 
                                value={formData.name} 
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-4 align-items-center">
                        <CCol sm={3}><CFormLabel className="fw-bold mb-0">Trạng thái</CFormLabel></CCol>
                        <CCol sm={9} className="d-flex gap-4">
                             <CFormCheck 
                                type="radio" 
                                name="status" 
                                label="Đang áp dụng" 
                                checked={formData.status === 'Đang áp dụng'} 
                                onChange={() => handleChange('status', 'Đang áp dụng')}
                                className={formData.status === 'Đang áp dụng' ? 'text-success fw-semibold' : ''}
                             />
                             <CFormCheck 
                                type="radio" 
                                name="status" 
                                label="Ngừng áp dụng" 
                                checked={formData.status === 'Ngừng áp dụng'} 
                                onChange={() => handleChange('status', 'Ngừng áp dụng')}
                             />
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>

        {/* DANH SÁCH THÀNH PHẦN (Giữ nguyên hiển thị giả lập) */}
        <CCard className="shadow-sm border-0">
             <CCardHeader className="bg-white py-3 d-flex justify-content-between align-items-center">
                 <span className="fw-bold">THÀNH PHẦN LƯƠNG</span>
                 <div className="position-relative" style={{ width: '250px' }}>
                    <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 10, color: '#adb5bd' }} />
                    <CFormInput placeholder="Tìm kiếm" size="sm" style={{ paddingLeft: 30 }} />
                </div>
             </CCardHeader>
             <CCardBody className="p-0">
                <CTable hover responsive align="middle" className="mb-0">
                    <CTableHead color="light">
                        <CTableRow>
                            <CTableHeaderCell>Tên thành phần</CTableHeaderCell>
                            <CTableHeaderCell>Mã thành phần</CTableHeaderCell>
                            <CTableHeaderCell>Tên cột hiển thị</CTableHeaderCell>
                            <CTableHeaderCell>Công thức</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Hiển thị</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>Lương cơ bản</CTableDataCell>
                            <CTableDataCell><code className="text-primary bg-light px-2 rounded">LUONG_CB</code></CTableDataCell>
                            <CTableDataCell>Lương cơ bản</CTableDataCell>
                            <CTableDataCell><span className="text-primary">= LUONG_CB</span></CTableDataCell>
                            <CTableDataCell className="text-center"><CFormCheck defaultChecked /></CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableDataCell>Phụ cấp ăn trưa</CTableDataCell>
                            <CTableDataCell><code className="text-primary bg-light px-2 rounded">PC_AN</code></CTableDataCell>
                            <CTableDataCell>Phụ cấp ăn</CTableDataCell>
                            <CTableDataCell><span className="text-primary">= 730000</span></CTableDataCell>
                            <CTableDataCell className="text-center"><CFormCheck defaultChecked /></CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
             </CCardBody>
        </CCard>
      </div>
    )
  }

  // ==========================================
  // COMPONENT LIST VIEW
  // ==========================================
  const ListView = () => (
    <>
      <div className="pc-header">
        <div className="left">
          <div className="title">Mẫu bảng lương</div>
          <div className="filters">
            <div className="filter-left">
                <div className="position-relative w-100">
                    <CIcon icon={cilSearch} size="sm" className="position-absolute" style={{ left: 10, top: 9, color: '#adb5bd' }} />
                    <CFormInput 
                        placeholder="Tìm kiếm" 
                        size="sm" 
                        style={{ paddingLeft: 28, borderRadius: 6 }} 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
            </div>
            <div className="filter-right d-flex align-items-center gap-2 flex-nowrap">
                
                {/* [ĐÃ SỬA] DROPDOWN LỌC TRẠNG THÁI */}
                <CFormSelect 
                    size="sm" 
                    className="w-auto" 
                    style={{ minWidth: '160px' }}
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1); // Reset về trang 1 khi lọc
                    }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Đang áp dụng">Đang áp dụng</option>
                    <option value="Ngừng áp dụng">Ngừng áp dụng</option>
                </CFormSelect>

                <CFormSelect size="sm" className="w-auto" style={{ minWidth: '160px' }}>
                    <option>Tất cả đơn vị</option>
                </CFormSelect>
                
                <CButton color={showFilter ? "secondary" : "light"} variant="ghost" size="sm" onClick={() => setShowFilter(!showFilter)}>
                    <CIcon icon={cilFilter} size="lg" />
                </CButton>
                <CButton color="light" variant="ghost" size="sm" onClick={handleOpenSettings}>
                    <CIcon icon={cilSettings} size="lg" />
                </CButton>
            </div>
          </div>
        </div>
        <div className="right d-flex gap-2">
          <CButton variant="outline" color="dark" size="sm" className="d-flex align-items-center">
            <CIcon icon={cilLibrary} className="me-2" /> Thư viện mẫu
          </CButton>
          <CButton color="success" size="sm" className="text-white d-flex align-items-center" onClick={handleAddNew}>
            <CIcon icon={cilPlus} className="me-2" /> Thêm mới
          </CButton>
        </div>
      </div>

      <CCard className="pc-table shadow-sm border-0 mt-3">
        <CCardHeader className="bg-light small text-medium-emphasis">
             Tổng số bản ghi: {totalItems}
        </CCardHeader>

        <CCardBody className="p-0">
            {totalItems === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 text-medium-emphasis">
                    <CIcon icon={cilDescription} size="5xl" className="mb-3 text-secondary" />
                    <p className="fs-5">{searchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}</p>
                </div>
            ) : (
                <CTable hover responsive align="middle" className="mb-0">
                    <CTableHead color="light" className="text-medium-emphasis">
                    <CTableRow>
                        {visibleColumns.name && <CTableHeaderCell>Tên mẫu bảng lương</CTableHeaderCell>}
                        {visibleColumns.unit && <CTableHeaderCell>Đơn vị áp dụng</CTableHeaderCell>}
                        {visibleColumns.position && <CTableHeaderCell>Vị trí áp dụng</CTableHeaderCell>}
                        {visibleColumns.staff && <CTableHeaderCell>Nhân viên áp dụng</CTableHeaderCell>}
                        {visibleColumns.status && <CTableHeaderCell>Trạng thái</CTableHeaderCell>}
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {paginatedView.map((item) => (
                            <CTableRow 
                                key={item.id} 
                                onClick={() => handleRowClick(item)} 
                                style={{ cursor: 'pointer' }}
                            >
                                {visibleColumns.name && <CTableDataCell className="fw-semibold text-primary">{item.name}</CTableDataCell>}
                                {visibleColumns.unit && (
                                    <CTableDataCell>
                                        {item.unit}
                                        <CIcon icon={cilCheckCircle} className="ms-1 text-success" size="sm"/>
                                    </CTableDataCell>
                                )}
                                {visibleColumns.position && <CTableDataCell>{item.position}</CTableDataCell>}
                                {visibleColumns.staff && <CTableDataCell>{item.staff}</CTableDataCell>}
                                {visibleColumns.status && (
                                    <CTableDataCell>
                                        <span className={`badge rounded-pill ${item.status === 'Đang áp dụng' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                            {item.status}
                                        </span>
                                    </CTableDataCell>
                                )}
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            )}
        </CCardBody>

        <div className="pc-pagination d-flex justify-content-between align-items-center p-3 border-top">
          <div className="d-flex align-items-center gap-2">
             <span className="small text-medium-emphasis">Số bản ghi/trang</span>
             <CFormSelect size="sm" style={{ width: '70px' }} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
             </CFormSelect>
             <span className="small text-medium-emphasis ms-2 border-start ps-3">
                {totalItems > 0 ? `${startRange} - ${endRange} trên tổng số ${totalItems} bản ghi` : '0 bản ghi'}
             </span>
          </div>
          <div className="nav">
            <button className="btn btn-sm btn-light border me-1" disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
            <span className="px-2 small fw-bold">Trang {page} / {totalPages}</span>
            <button className="btn btn-sm btn-light border ms-1" disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>›</button>
          </div>
        </div>
      </CCard>
    </>
  )


  // ==========================================
  // MAIN RETURN
  // ==========================================
  return (
    <div className="payroll-components">
      
      {/* ĐIỀU KIỆN HIỂN THỊ: CHI TIẾT hoặc DANH SÁCH */}
      {showDetail && selectedItem ? (
        <DetailView 
            item={selectedItem} 
            onBack={handleBackToList}
            onSave={handleTriggerSave} // TRUYỀN HÀM TRIGGER MODAL XUỐNG
        />
      ) : (
        <ListView />
      )}

      {/* --- CONFIRMATION MODAL --- */}
      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Xác nhận lưu</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
            <CIcon icon={cilWarning} size="4xl" className="text-warning mb-3"/>
            <p className="fs-5">Bạn có chắc chắn muốn lưu thay đổi cho mẫu <strong>{pendingSaveItem?.name}</strong> không?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowConfirmModal(false)}>
            Hủy bỏ
          </CButton>
          <CButton color="success" className="text-white" onClick={handleConfirmSave}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>

      {/* --- TOASTER (THÔNG BÁO) --- */}
      <CToaster ref={toaster} push={toast} placement="top-end" />

      {/* OFFCANVAS & SETTINGS MODALS */}
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
              <CFormCheck 
                key={id} 
                id={`filter-${id}`} 
                label={label} 
                checked={activeFilters.includes(id)} 
                onChange={() => setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])} 
                className="mb-2" 
              />
            ))}
          </div>
          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={() => { setActiveFilters(['name', 'position', 'staff']); setFilterSearch(''); setShowFilter(false) }}>Bỏ lọc</CButton>
            <CButton color="success" className="text-white w-50" onClick={() => setShowFilter(false)}>Áp dụng</CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      <CModal visible={showSettings} onClose={() => setShowSettings(false)} alignment="center" className="settings-modal" scrollable={false}>
        <CModalHeader className="position-relative">
            <h5 className="modal-title">Tùy chỉnh cột</h5>
            <div className="position-absolute" style={{ right: '50px', top: '18px', cursor: 'pointer', color: '#6c757d' }} title="Đặt lại mặc định" onClick={handleResetSettings}>
                <CIcon icon={cilReload} size="lg" />
            </div>
        </CModalHeader>
        <CModalBody>
            <CForm>
                <CInputGroup>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput placeholder="Tìm kiếm" value={colSearch} onChange={(e) => setColSearch(e.target.value)} />
                </CInputGroup>
                <div className="column-list mt-3">
                    {COLUMN_CONFIG.filter(col => col.label.toLowerCase().includes(colSearch.toLowerCase())).map((col) => (
                           <CFormCheck key={col.key} id={`col-${col.key}`} label={col.label} checked={tempColumns[col.key]} onChange={() => toggleColumn(col.key)} className="mb-2"/>
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

export default TemplatesPage