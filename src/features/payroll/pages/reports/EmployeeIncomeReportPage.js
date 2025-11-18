import {
  cilCalendar,
  cilChevronLeft,
  cilChevronRight,
  cilDescription,
  cilEnvelopeClosed,
  cilFilter,
  cilPrint,
  cilReload,
  cilSearch,
  cilSettings,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
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
  CNav,
  CNavItem,
  CNavLink,
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
  CTableRow
} from '@coreui/react'
import { useState } from 'react'

import '../../scss/employee-income-report-page.scss'

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const MOCK_DATA = [
  { id: 1, maNV: 'NV001', hoTen: 'Nguyễn Văn A', viTri: 'Lập trình viên', donVi: 'Phòng Kỹ thuật', soThang: 12, thucLinh: 120000000, thuNhapBQ: 10000000 },
  { id: 2, maNV: 'NV002', hoTen: 'Trần Thị B', viTri: 'Kế toán', donVi: 'Phòng Kế toán', soThang: 11, thucLinh: 88000000, thuNhapBQ: 8000000 },
  { id: 3, maNV: 'NV003', hoTen: 'Lê Văn C', viTri: 'Nhân sự', donVi: 'Phòng Hành chính', soThang: 12, thucLinh: 96000000, thuNhapBQ: 8000000 },
  { id: 4, maNV: 'NV004', hoTen: 'Phạm Thị D', viTri: 'Tester', donVi: 'Phòng Kỹ thuật', soThang: 6, thucLinh: 42000000, thuNhapBQ: 7000000 },
  { id: 5, maNV: 'NV005', hoTen: 'Hoàng Văn E', viTri: 'Lập trình viên', donVi: 'Phòng Kỹ thuật', soThang: 12, thucLinh: 180000000, thuNhapBQ: 15000000 },
]

const EmployeeIncomeReportPage = () => {
  // --- STATE DỮ LIỆU ---
  const [originalData] = useState(MOCK_DATA)
  const [displayData, setDisplayData] = useState(MOCK_DATA)
  const [activeTab, setActiveTab] = useState('employee')
  
  // --- STATE UI ---
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // --- STATE NGÀY THÁNG (QUAN TRỌNG) ---
  // Đây là giá trị hiển thị bên ngoài Header
  const [dateRange, setDateRange] = useState({
    from: '2025-01', // Giá trị mặc định yyyy-mm
    to: '2025-12'
  })

  // Đây là giá trị tạm thời trong Modal (khi đang chỉnh sửa chưa lưu)
  const [tempDateRange, setTempDateRange] = useState({
    from: '2025-01',
    to: '2025-12'
  })

  // --- STATE CẤU HÌNH CỘT ---
  const [columns, setColumns] = useState({
    stt: true, maNV: true, hoTen: true, viTri: true, donVi: true, 
    soThang: true, thucLinh: true, thuNhapBQ: true,
  })
  const [tempColumns, setTempColumns] = useState(columns)

  // --- STATE BỘ LỌC ---
  const [filters, setFilters] = useState({
    keyword: '', maNV: false, hoTen: false, viTri: false,
  })

  // --- HÀM MỞ MODAL TÙY CHỈNH ---
  const handleOpenCustomizeModal = () => {
    // Khi mở modal, copy giá trị hiện tại vào biến tạm
    setTempDateRange({ ...dateRange })
    setShowCustomizeModal(true)
  }

  // --- HÀM LƯU (ĐỒNG Ý) MODAL TÙY CHỈNH ---
  const handleSaveCustomize = () => {
    // Khi ấn Đồng ý, cập nhật giá trị chính thức từ biến tạm
    setDateRange({ ...tempDateRange })
    setShowCustomizeModal(false)
  }

  // Hàm format yyyy-mm thành mm/yyyy để hiển thị đẹp hơn
  const formatMonthDisplay = (yyyy_mm) => {
    if (!yyyy_mm) return ''
    const [year, month] = yyyy_mm.split('-')
    return `${month}/${year}`
  }

  // --- CÁC HÀM KHÁC (Lọc, Cài đặt cột...) ---
  const applyFilters = () => {
    let result = [...originalData]
    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase()
      result = result.filter(item => {
        const searchAll = !filters.maNV && !filters.hoTen && !filters.viTri
        return (
          (searchAll || filters.maNV) && item.maNV.toLowerCase().includes(lowerKeyword) ||
          (searchAll || filters.hoTen) && item.hoTen.toLowerCase().includes(lowerKeyword) ||
          (searchAll || filters.viTri) && item.viTri.toLowerCase().includes(lowerKeyword)
        )
      })
    }
    setDisplayData(result)
    setShowFilter(false) 
  }

  const resetFilters = () => {
    setFilters({ keyword: '', maNV: false, hoTen: false, viTri: false })
    setDisplayData(originalData)
    setShowFilter(false)
  }

  const handleOpenSettings = () => {
    setTempColumns({ ...columns }) 
    setShowSettingsModal(true)
  }

  const handleSaveSettings = () => {
    setColumns({ ...tempColumns }) 
    setShowSettingsModal(false)
  }

  const toggleColumn = (colName) => {
    setTempColumns(prev => ({ ...prev, [colName]: !prev[colName] }))
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  return (
    <div className="employee-income-report-page">
      {/* HEADER */}
      <div className="page-header mb-3">
        <div className="header-left">
          <h4 className="mb-1">Tổng hợp thu nhập nhân viên</h4>
          {/* HIỂN THỊ NGÀY THÁNG ĐỘNG TỪ STATE */}
          <span className="text-medium-emphasis">
            Tất cả đơn vị - Từ {formatMonthDisplay(dateRange.from)} đến {formatMonthDisplay(dateRange.to)}
          </span>
        </div>
        <div className="header-actions">
          <CButton color="success" className="me-2 text-white" onClick={handleOpenCustomizeModal}>
            Tùy chỉnh báo cáo
          </CButton>
          <CButton variant="outline" color="secondary" className="icon-btn me-1"><CIcon icon={cilEnvelopeClosed} /></CButton>
          <CButton variant="outline" color="secondary" className="icon-btn me-1"><CIcon icon={cilPrint} /></CButton>
          <CButton 
            variant={showFilter ? 'solid' : 'outline'} 
            color={showFilter ? 'success' : 'secondary'}
            className={`icon-btn me-1 ${showFilter ? 'text-white' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <CIcon icon={cilFilter} />
          </CButton>
          <CButton variant="outline" color="secondary" className="icon-btn" onClick={handleOpenSettings}>
            <CIcon icon={cilSettings} />
          </CButton>
        </div>
      </div>

      {/* TABS */}
      <div className="report-tabs mb-3">
        <CNav variant="tabs">
          <CNavItem><CNavLink active={activeTab === 'employee'} onClick={() => setActiveTab('employee')} style={{cursor:'pointer'}}>Nhân viên</CNavLink></CNavItem>
          <CNavItem><CNavLink active={activeTab === 'position'} onClick={() => setActiveTab('position')} style={{cursor:'pointer'}}>Vị trí công việc</CNavLink></CNavItem>
          <CNavItem><CNavLink active={activeTab === 'department'} onClick={() => setActiveTab('department')} style={{cursor:'pointer'}}>Phòng ban</CNavLink></CNavItem>
        </CNav>
      </div>

      {/* NỘI DUNG BÁO CÁO */}
      <CCard className="content-card">
        <div className="table-responsive">
          <CTable hover align="middle" className="mb-0 report-table">
            <CTableHead color="light">
              <CTableRow>
                {columns.stt && <CTableHeaderCell className="text-center" style={{ width: '50px' }}>STT</CTableHeaderCell>}
                {columns.maNV && <CTableHeaderCell style={{ width: '120px' }}>Mã nhân viên</CTableHeaderCell>}
                {columns.hoTen && <CTableHeaderCell>Họ và tên</CTableHeaderCell>}
                {columns.viTri && <CTableHeaderCell>Vị trí công việc</CTableHeaderCell>}
                {columns.donVi && <CTableHeaderCell>Đơn vị công tác</CTableHeaderCell>}
                {columns.soThang && <CTableHeaderCell className="text-center">Số tháng</CTableHeaderCell>}
                {columns.thucLinh && <CTableHeaderCell className="text-end">Thực lĩnh</CTableHeaderCell>}
                {columns.thuNhapBQ && <CTableHeaderCell className="text-end">Thu nhập BQ</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {displayData.length === 0 ? (
                <CTableRow>
                  <CTableHeaderCell colSpan="10" className="empty-state-cell">
                    <div className="empty-state py-5">
                      <CIcon icon={cilDescription} size="5xl" className="empty-icon mb-3" />
                      <p className="text-medium-emphasis">Không có dữ liệu phù hợp</p>
                    </div>
                  </CTableHeaderCell>
                </CTableRow>
              ) : (
                displayData.map((item, index) => (
                  <CTableRow key={item.id}>
                    {columns.stt && <CTableDataCell className="text-center">{index + 1}</CTableDataCell>}
                    {columns.maNV && <CTableDataCell>{item.maNV}</CTableDataCell>}
                    {columns.hoTen && <CTableDataCell className="fw-bold">{item.hoTen}</CTableDataCell>}
                    {columns.viTri && <CTableDataCell>{item.viTri}</CTableDataCell>}
                    {columns.donVi && <CTableDataCell>{item.donVi}</CTableDataCell>}
                    {columns.soThang && <CTableDataCell className="text-center">{item.soThang}</CTableDataCell>}
                    {columns.thucLinh && <CTableDataCell className="text-end">{formatCurrency(item.thucLinh)}</CTableDataCell>}
                    {columns.thuNhapBQ && <CTableDataCell className="text-end">{formatCurrency(item.thuNhapBQ)}</CTableDataCell>}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        <div className="report-footer p-3 border-top">
            <div className="fw-bold mb-3">Tổng cộng: {displayData.length} nhân viên</div>
            <div className="d-flex justify-content-between align-items-center text-medium-emphasis small">
                <span>Tổng số bản ghi: {displayData.length}</span>
                <div className="d-flex align-items-center">
                    <span>Số bản ghi/trang</span>
                    <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                    <span className="me-3">1 - {displayData.length} bản ghi</span>
                    <div className="btn-group">
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronLeft} /></CButton>
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronRight} /></CButton>
                    </div>
                </div>
            </div>
        </div>
      </CCard>

      {/* --- SIDEBAR BỘ LỌC --- */}
      <COffcanvas placement="end" visible={showFilter} onHide={() => setShowFilter(false)} className="filter-sidebar" backdrop={false} scroll={true}>
        <COffcanvasHeader>
          <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setShowFilter(false)} />
        </COffcanvasHeader>
        <COffcanvasBody className="d-flex flex-column h-100">
          <div className="mb-3 position-relative">
            <CFormInput type="text" placeholder="Tìm kiếm..." className="ps-5" value={filters.keyword} onChange={(e) => setFilters({...filters, keyword: e.target.value})} />
            <CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          </div>
          <div className="filter-list flex-grow-1">
            <p className="text-medium-emphasis small mb-2">Tìm kiếm theo:</p>
            <CFormCheck id="filterMaNV" label="Mã nhân viên" className="mb-2" checked={filters.maNV} onChange={(e) => setFilters({...filters, maNV: e.target.checked})} />
            <CFormCheck id="filterHoTen" label="Họ và tên" className="mb-2" checked={filters.hoTen} onChange={(e) => setFilters({...filters, hoTen: e.target.checked})} />
            <CFormCheck id="filterViTri" label="Vị trí công việc" className="mb-2" checked={filters.viTri} onChange={(e) => setFilters({...filters, viTri: e.target.checked})} />
          </div>
          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={resetFilters}>Bỏ lọc</CButton>
            <CButton color="success" className="text-white w-50" onClick={applyFilters}>Áp dụng</CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      {/* --- MODAL TÙY CHỈNH BÁO CÁO (NÚT XANH) --- */}
      <CModal visible={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} alignment="center" size="lg">
        <CModalHeader onClose={() => setShowCustomizeModal(false)} className="border-0 pb-0"></CModalHeader>
        <CModalBody className="pt-0">
          <CForm>
            <h6 className="mb-3 text-uppercase fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>TÙY CHỈNH HIỂN THỊ</h6>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Xem biểu đồ</CFormLabel></CCol>
              <CCol md={8}><div className="d-flex"><CFormCheck type="radio" name="xemBieuDo" id="xemBieuDoCo" label="Có" className="me-4 text-success" defaultChecked/><CFormCheck type="radio" name="xemBieuDo" id="xemBieuDoKhong" label="Không"/></div></CCol>
            </CRow>
            <CRow className="mb-4 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Số giá trị hiển thị tối đa</CFormLabel></CCol>
              <CCol md={8}><CFormInput type="number" defaultValue="10" style={{ maxWidth: '100px' }} /></CCol>
            </CRow>
            <h6 className="mb-3 text-uppercase fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>THAM SỐ BÁO CÁO</h6>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Cơ cấu tổ chức</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Tất cả đơn vị</option></CFormSelect></CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Kỳ báo cáo</CFormLabel></CCol>
              <CCol md={8}>
                <CFormSelect className="mb-2"><option>Năm nay</option></CFormSelect>
                
                {/* LIÊN KẾT INPUT VỚI STATE TẠM THỜI (tempDateRange) */}
                <div className="d-flex gap-2">
                    <CInputGroup>
                        <CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText>
                        <CFormInput 
                          type="month" 
                          value={tempDateRange.from}
                          onChange={(e) => setTempDateRange({...tempDateRange, from: e.target.value})}
                        />
                    </CInputGroup>
                    <CInputGroup>
                        <CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText>
                        <CFormInput 
                          type="month" 
                          value={tempDateRange.to}
                          onChange={(e) => setTempDateRange({...tempDateRange, to: e.target.value})}
                        />
                    </CInputGroup>
                </div>

              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Thống kê theo</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Thực lĩnh</option></CFormSelect></CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Thành phần lương</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Tất cả thành phần lương</option></CFormSelect></CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="bg-light border-0">
          <CButton color="white" className="border bg-white" onClick={() => setShowCustomizeModal(false)}>Hủy bỏ</CButton>
          <CButton color="success" className="text-white" onClick={handleSaveCustomize}>Đồng ý</CButton>
        </CModalFooter>
      </CModal>

      {/* --- MODAL CÀI ĐẶT (BÁNH RĂNG) --- */}
      <CModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} alignment="center" className="settings-modal">
        <CModalHeader onClose={() => setShowSettingsModal(false)} className="border-0 pb-0">
            <div className="d-flex justify-content-between w-100 align-items-center">
                <h5 className="modal-title fw-bold">Tùy chỉnh</h5>
                <div className="position-relative d-inline-block me-3" style={{cursor: 'pointer'}}><CIcon icon={cilReload} size="lg" className="text-secondary" /></div>
            </div>
        </CModalHeader>
        <CModalBody>
            <CForm>
                <div className="mb-4">
                    <CFormLabel className="fw-bold mb-2">Gom nhóm bản ghi</CFormLabel>
                    <div className="d-flex gap-4">
                        <CFormCheck type="radio" name="gomNhom" id="khongGomNhom" label="Không" defaultChecked />
                        <CFormCheck type="radio" name="gomNhom" id="motCap" label="Một cấp" />
                        <CFormCheck type="radio" name="gomNhom" id="haiCap" label="Hai cấp" />
                    </div>
                </div>
                <div>
                    <CFormLabel className="fw-bold mb-2">Cột hiển thị</CFormLabel>
                    <div className="column-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.keys(columns).map(key => (
                           <CFormCheck 
                             key={key} id={`col-${key}`} className="mb-3"
                             label={key === 'stt' ? 'STT' : key === 'maNV' ? 'Mã nhân viên' : key === 'hoTen' ? 'Họ và tên' : key === 'viTri' ? 'Vị trí công việc' : key === 'donVi' ? 'Đơn vị công tác' : key === 'soThang' ? 'Số tháng làm việc' : key === 'thucLinh' ? 'Thực lĩnh' : 'Thu nhập bình quân'} 
                             checked={tempColumns[key]} 
                             onChange={() => toggleColumn(key)} 
                           />
                        ))}
                    </div>
                </div>
            </CForm>
        </CModalBody>
        <CModalFooter className="bg-light border-0">
             <CButton color="success" className="text-white w-100" onClick={handleSaveSettings}>Lưu</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default EmployeeIncomeReportPage