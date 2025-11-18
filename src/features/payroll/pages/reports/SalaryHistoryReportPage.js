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

// Import SCSS
import '../../scss/salary-history-report-page.scss'

// --- DỮ LIỆU GIẢ ---
const MOCK_DATA = [
  { id: 1, stt: 1, code: 'NV001', name: 'Nguyễn Văn A', currentOrg: 'Phòng KT', currentPos: 'Dev', effectiveDate: '01/01/2025', org: 'Phòng KT', pos: 'Dev', type: 'Chính thức', salaryType: 'Gross', tax: 'Cư trú', baseSalary: 15000000, rate: '100%' },
  { id: 2, stt: 2, code: 'NV001', name: 'Nguyễn Văn A', currentOrg: 'Phòng KT', currentPos: 'Dev', effectiveDate: '01/06/2024', org: 'Phòng KT', pos: 'Thử việc', type: 'Thử việc', salaryType: 'Gross', tax: 'Cư trú', baseSalary: 12000000, rate: '85%' },
  { id: 3, stt: 3, code: 'NV002', name: 'Trần Thị B', currentOrg: 'Phòng NS', currentPos: 'HR', effectiveDate: '01/01/2025', org: 'Phòng NS', pos: 'HR', type: 'Chính thức', salaryType: 'Net', tax: 'Cư trú', baseSalary: 10000000, rate: '100%' },
]

const SalaryHistoryReportPage = () => {
  const [data, setData] = useState(MOCK_DATA) // Để [] để xem empty state
  
  // --- STATE UI ---
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // --- STATE CẤU HÌNH CỘT ---
  const [columns, setColumns] = useState({
    stt: true,
    code: true,
    name: true,
    currentOrg: true,
    currentPos: true,
    effectiveDate: true,
    org: true,
    pos: true,
    laborNature: true,
    salaryType: true,
    taxObject: true,
    baseSalary: true, // Lương cơ bản
    rate: true, // Tỷ lệ
  })
  const [tempColumns, setTempColumns] = useState(columns)

  // --- STATE BỘ LỌC ---
  const [filters, setFilters] = useState({ keyword: '', code: false, name: false, currentPos: false, date: false, baseSalary: false })

  // --- LOGIC HÀM ---
  const toggleColumn = (key) => {
    setTempColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveSettings = () => {
    setColumns({ ...tempColumns })
    setShowSettingsModal(false)
  }

  const applyFilters = () => {
    // Logic lọc giả định
    setShowFilter(false)
  }

  const resetFilters = () => {
    setFilters({ keyword: '', code: false, name: false, currentPos: false, date: false, baseSalary: false })
  }

  return (
    <div className="salary-history-report-page">
      {/* 1. HEADER */}
      <div className="page-header mb-3">
        <div className="header-left">
          <h4 className="mb-1">Lịch sử lương của nhân viên</h4>
          <span className="text-medium-emphasis">
            Tất cả đơn vị - Từ 01/07/2025 đến 30/09/2025
          </span>
        </div>
        <div className="header-actions">
          <CButton color="success" className="me-2 text-white" onClick={() => setShowCustomizeModal(true)}>
            Tùy chỉnh báo cáo
          </CButton>
          <CButton variant="outline" color="secondary" className="icon-btn me-1"><CIcon icon={cilEnvelopeClosed} /></CButton>
          <CButton variant="outline" color="secondary" className="icon-btn me-1"><CIcon icon={cilPrint} /></CButton>
          
          {/* Nút Lọc */}
          <CButton 
            variant={showFilter ? 'solid' : 'outline'} 
            color={showFilter ? 'success' : 'secondary'}
            className={`icon-btn me-1 ${showFilter ? 'text-white' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <CIcon icon={cilFilter} />
          </CButton>
          
          {/* Nút Cài đặt */}
          <CButton variant="outline" color="secondary" className="icon-btn" onClick={() => { setTempColumns({...columns}); setShowSettingsModal(true) }}>
            <CIcon icon={cilSettings} />
          </CButton>
        </div>
      </div>

      {/* 2. BẢNG DỮ LIỆU */}
      <CCard className="content-card">
        <div className="table-responsive table-scroll-container">
          <CTable hover align="middle" className="mb-0 report-table">
            <CTableHead>
              <CTableRow>
                {columns.stt && <CTableHeaderCell className="text-center" style={{minWidth: '50px'}}>STT</CTableHeaderCell>}
                {columns.code && <CTableHeaderCell style={{minWidth: '120px'}}>Mã nhân viên</CTableHeaderCell>}
                {columns.name && <CTableHeaderCell style={{minWidth: '180px'}}>Họ và tên</CTableHeaderCell>}
                
                {columns.currentOrg && <CTableHeaderCell style={{minWidth: '150px'}}>Đơn vị công tác hiện tại</CTableHeaderCell>}
                {columns.currentPos && <CTableHeaderCell style={{minWidth: '150px'}}>Vị trí công việc hiện tại</CTableHeaderCell>}
                
                {columns.effectiveDate && <CTableHeaderCell className="text-center" style={{minWidth: '120px'}}>Ngày hiệu lực</CTableHeaderCell>}
                {columns.org && <CTableHeaderCell style={{minWidth: '150px'}}>Đơn vị công tác</CTableHeaderCell>}
                {columns.pos && <CTableHeaderCell style={{minWidth: '150px'}}>Vị trí công việc</CTableHeaderCell>}
                
                {columns.laborNature && <CTableHeaderCell style={{minWidth: '150px'}}>Tính chất lao động</CTableHeaderCell>}
                {columns.salaryType && <CTableHeaderCell style={{minWidth: '100px'}}>Loại lương</CTableHeaderCell>}
                {columns.taxObject && <CTableHeaderCell style={{minWidth: '150px'}}>Đối tượng đóng thuế TNCN</CTableHeaderCell>}
                
                {columns.baseSalary && <CTableHeaderCell className="text-end" style={{minWidth: '120px'}}>Lương cơ bản</CTableHeaderCell>}
                {columns.rate && <CTableHeaderCell className="text-center" style={{minWidth: '80px'}}>Tỷ lệ</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            
            <CTableBody>
              {data.length === 0 ? (
                <CTableRow>
                  <CTableHeaderCell colSpan={15} className="empty-state-cell">
                    <div className="empty-state py-5">
                      <CIcon icon={cilDescription} size="5xl" className="empty-icon mb-3" />
                      <p className="text-medium-emphasis">Không có dữ liệu</p>
                    </div>
                  </CTableHeaderCell>
                </CTableRow>
              ) : (
                data.map((item, index) => (
                   <CTableRow key={item.id}>
                      {columns.stt && <CTableDataCell className="text-center">{item.stt}</CTableDataCell>}
                      {columns.code && <CTableDataCell>{item.code}</CTableDataCell>}
                      {columns.name && <CTableDataCell className="fw-bold">{item.name}</CTableDataCell>}
                      
                      {columns.currentOrg && <CTableDataCell>{item.currentOrg}</CTableDataCell>}
                      {columns.currentPos && <CTableDataCell>{item.currentPos}</CTableDataCell>}
                      
                      {columns.effectiveDate && <CTableDataCell className="text-center">{item.effectiveDate}</CTableDataCell>}
                      {columns.org && <CTableDataCell>{item.org}</CTableDataCell>}
                      {columns.pos && <CTableDataCell>{item.pos}</CTableDataCell>}
                      
                      {columns.laborNature && <CTableDataCell>{item.type}</CTableDataCell>}
                      {columns.salaryType && <CTableDataCell>{item.salaryType}</CTableDataCell>}
                      {columns.taxObject && <CTableDataCell>{item.tax}</CTableDataCell>}

                      {columns.baseSalary && <CTableDataCell className="text-end">{new Intl.NumberFormat('vi-VN').format(item.baseSalary)}</CTableDataCell>}
                      {columns.rate && <CTableDataCell className="text-center">{item.rate}</CTableDataCell>}
                   </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        
        <div className="report-footer-pagination p-3 border-top">
            <div className="d-flex justify-content-between align-items-center text-medium-emphasis small">
                <span>Tổng số bản ghi: {data.length}</span>
                <div className="d-flex align-items-center">
                    <span>Số bản ghi/trang</span>
                    <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                    <span className="me-3">0 - {data.length} bản ghi</span>
                    <div className="btn-group">
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronLeft} /></CButton>
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronRight} /></CButton>
                    </div>
                </div>
            </div>
        </div>
      </CCard>

      {/* --- 3. SIDEBAR BỘ LỌC --- */}
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
            <CFormCheck id="filterMaNV" label="Mã nhân viên" className="mb-2" checked={filters.code} onChange={(e) => setFilters({...filters, code: e.target.checked})} />
            <CFormCheck id="filterHoTen" label="Họ và tên" className="mb-2" checked={filters.name} onChange={(e) => setFilters({...filters, name: e.target.checked})} />
            <CFormCheck id="filterViTriHT" label="Vị trí công việc hiện tại" className="mb-2" checked={filters.currentPos} onChange={(e) => setFilters({...filters, currentPos: e.target.checked})} />
            <CFormCheck id="filterNgayHieuLuc" label="Ngày hiệu lực" className="mb-2" checked={filters.date} onChange={(e) => setFilters({...filters, date: e.target.checked})} />
            <CFormCheck id="filterViTri" label="Vị trí công việc" className="mb-2" />
            <CFormCheck id="filterLuongCB" label="Lương cơ bản" className="mb-2" checked={filters.baseSalary} onChange={(e) => setFilters({...filters, baseSalary: e.target.checked})} />
            <CFormCheck id="filterTyLe" label="Tỷ lệ hưởng lương" className="mb-2" />
          </div>
          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={resetFilters}>Bỏ lọc</CButton>
            <CButton color="success" className="text-white w-50" onClick={applyFilters}>Áp dụng</CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      {/* --- 4. MODAL TÙY CHỈNH BÁO CÁO (NÚT XANH) --- */}
      <CModal visible={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} alignment="center" size="lg">
        <CModalHeader onClose={() => setShowCustomizeModal(false)} className="border-0 pb-0"></CModalHeader>
        <CModalBody className="pt-0">
          <CForm>
            <h6 className="mb-3 text-uppercase fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>THAM SỐ BÁO CÁO</h6>
            
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Cơ cấu tổ chức</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Tất cả đơn vị</option></CFormSelect></CCol>
            </CRow>
            
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Thống kê theo</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Tất cả</option></CFormSelect></CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Kỳ báo cáo</CFormLabel></CCol>
              <CCol md={8}>
                <CFormSelect className="mb-2"><option>Quý trước</option></CFormSelect>
                <div className="d-flex gap-2">
                    <CInputGroup><CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText><CFormInput type="date" defaultValue="2025-07-01" /></CInputGroup>
                    <CInputGroup><CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText><CFormInput type="date" defaultValue="2025-09-30" /></CInputGroup>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="bg-light border-0">
          <CButton color="white" className="border bg-white" onClick={() => setShowCustomizeModal(false)}>Hủy bỏ</CButton>
          <CButton color="success" className="text-white" onClick={() => setShowCustomizeModal(false)}>Đồng ý</CButton>
        </CModalFooter>
      </CModal>

      {/* --- 5. MODAL CÀI ĐẶT (BÁNH RĂNG) --- */}
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
                    <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-white border-end-0"><CIcon icon={cilSearch} /></CInputGroupText>
                        <CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm" />
                    </CInputGroup>
                    <div className="column-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <CFormCheck id="colSTT" label="STT" checked={tempColumns.stt} onChange={() => toggleColumn('stt')} className="mb-3" />
                        <CFormCheck id="colCode" label="Mã nhân viên" checked={tempColumns.code} onChange={() => toggleColumn('code')} className="mb-3" />
                        <CFormCheck id="colName" label="Họ và tên" checked={tempColumns.name} onChange={() => toggleColumn('name')} className="mb-3" />
                        <CFormCheck id="colCurrentOrg" label="Đơn vị công tác hiện tại" checked={tempColumns.currentOrg} onChange={() => toggleColumn('currentOrg')} className="mb-3" />
                        <CFormCheck id="colCurrentPos" label="Vị trí công việc hiện tại" checked={tempColumns.currentPos} onChange={() => toggleColumn('currentPos')} className="mb-3" />
                        <CFormCheck id="colDate" label="Ngày hiệu lực" checked={tempColumns.effectiveDate} onChange={() => toggleColumn('effectiveDate')} className="mb-3" />
                        <CFormCheck id="colOrg" label="Đơn vị công tác" checked={tempColumns.org} onChange={() => toggleColumn('org')} className="mb-3" />
                        <CFormCheck id="colPos" label="Vị trí công việc" checked={tempColumns.pos} onChange={() => toggleColumn('pos')} className="mb-3" />
                        <CFormCheck id="colLabor" label="Tính chất lao động" checked={tempColumns.laborNature} onChange={() => toggleColumn('laborNature')} className="mb-3" />
                        <CFormCheck id="colType" label="Loại lương" checked={tempColumns.salaryType} onChange={() => toggleColumn('salaryType')} className="mb-3" />
                        <CFormCheck id="colTax" label="Đối tượng đóng thuế TNCN" checked={tempColumns.taxObject} onChange={() => toggleColumn('taxObject')} className="mb-3" />
                        <CFormCheck id="colBase" label="Bậc lương" checked={false} className="mb-3" />
                        <CFormCheck id="colHeSo" label="Hệ số" checked={false} className="mb-3" />
                        <CFormCheck id="colBaseSalary" label="Lương cơ bản" checked={tempColumns.baseSalary} onChange={() => toggleColumn('baseSalary')} className="mb-3" />
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

export default SalaryHistoryReportPage