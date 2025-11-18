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

// Import SCSS (dùng chung style báo cáo)
import '../../scss/employee-income-report-page.scss'

const PaymentSummaryReportPage = () => {
  const [data, setData] = useState([]) // Dữ liệu bảng
  
  // --- STATE UI ---
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // --- STATE NGÀY THÁNG (Header) ---
  const [dateRange, setDateRange] = useState({ from: '2025-01', to: '2025-12' })
  const [tempDateRange, setTempDateRange] = useState({ from: '2025-01', to: '2025-12' })

  // --- STATE CỘT HIỂN THỊ ---
  const [columns, setColumns] = useState({
    stt: true,
    maNV: true,
    hoTen: true,
    donVi: true,
    viTri: true,
    hinhThucThanhToan: true, // Cột cha
    chuyenKhoan: true,
    tienMat: true,
  })
  const [tempColumns, setTempColumns] = useState(columns)

  // Hàm toggle cột
  const toggleColumn = (key) => {
    setTempColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveSettings = () => {
    setColumns(tempColumns)
    setShowSettingsModal(false)
  }

  const handleOpenCustomizeModal = () => {
    setTempDateRange({ ...dateRange })
    setShowCustomizeModal(true)
  }

  const handleSaveCustomize = () => {
    setDateRange({ ...tempDateRange })
    setShowCustomizeModal(false)
  }
  
  // Format ngày tháng hiển thị
  const formatMonthDisplay = (yyyy_mm) => {
    if (!yyyy_mm) return ''
    const [year, month] = yyyy_mm.split('-')
    return `${month}/${year}`
  }

  return (
    <div className="employee-income-report-page"> {/* Dùng chung class style báo cáo */}
      {/* 1. HEADER */}
      <div className="page-header mb-3">
        <div className="header-left">
          <h4 className="mb-1">Tổng hợp chi trả lương</h4>
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
          <CButton variant="outline" color="secondary" className="icon-btn" onClick={() => { setTempColumns(columns); setShowSettingsModal(true); }}>
            <CIcon icon={cilSettings} />
          </CButton>
        </div>
      </div>

      {/* 2. BẢNG DỮ LIỆU */}
      <CCard className="content-card">
        <div className="table-responsive">
          <CTable hover align="middle" className="mb-0 report-table table-bordered">
            <CTableHead color="light">
              {/* DÒNG HEADER 1: Các cột gộp */}
              <CTableRow>
                {columns.stt && <CTableHeaderCell rowSpan={2} className="text-center align-middle" style={{width: '50px'}}>STT</CTableHeaderCell>}
                {columns.maNV && <CTableHeaderCell rowSpan={2} className="align-middle text-center" style={{width: '120px'}}>Mã nhân viên</CTableHeaderCell>}
                {columns.hoTen && <CTableHeaderCell rowSpan={2} className="align-middle text-center">Họ và tên</CTableHeaderCell>}
                {columns.donVi && <CTableHeaderCell rowSpan={2} className="align-middle text-center">Đơn vị công tác</CTableHeaderCell>}
                {columns.viTri && <CTableHeaderCell rowSpan={2} className="align-middle text-center">Vị trí công việc</CTableHeaderCell>}
                
                {/* Cột gộp Hình thức thanh toán */}
                {columns.hinhThucThanhToan && (
                  <CTableHeaderCell colSpan={2} className="text-center align-middle">Hình thức thanh toán</CTableHeaderCell>
                )}
              </CTableRow>

              {/* DÒNG HEADER 2: Các cột con của Hình thức thanh toán */}
              <CTableRow>
                {columns.hinhThucThanhToan && columns.chuyenKhoan && <CTableHeaderCell className="text-center">Chuyển khoản</CTableHeaderCell>}
                {columns.hinhThucThanhToan && columns.tienMat && <CTableHeaderCell className="text-center">Tiền mặt</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {data.length === 0 ? (
                <CTableRow>
                  <CTableHeaderCell colSpan={15} className="empty-state-cell border-0">
                    <div className="empty-state py-5">
                      <CIcon icon={cilDescription} size="5xl" className="empty-icon mb-3" />
                      <p className="text-medium-emphasis">Không có dữ liệu</p>
                    </div>
                  </CTableHeaderCell>
                </CTableRow>
              ) : (
                // Render dữ liệu mẫu ở đây
                data.map((item, index) => (
                  <CTableRow key={index}>
                    {/* Cells tương ứng... */}
                  </CTableRow>
                ))
              )}
            </CTableBody>
            
            {/* FOOTER TỔNG CỘNG */}
            <CTableRow className="footer-row fw-bold bg-light">
               {columns.stt && <CTableDataCell className="border-top">Tổng cộng</CTableDataCell>}
               {columns.maNV && <CTableDataCell className="border-top"></CTableDataCell>}
               {columns.hoTen && <CTableDataCell className="border-top"></CTableDataCell>}
               {columns.donVi && <CTableDataCell className="border-top"></CTableDataCell>}
               {columns.viTri && <CTableDataCell className="border-top"></CTableDataCell>}
               
               {columns.hinhThucThanhToan && columns.chuyenKhoan && <CTableDataCell className="text-end border-top">0,00</CTableDataCell>}
               {columns.hinhThucThanhToan && columns.tienMat && <CTableDataCell className="text-end border-top">0,00</CTableDataCell>}
            </CTableRow>
          </CTable>
        </div>

        {/* PAGINATION */}
        <div className="report-footer p-3 border-top">
            <div className="d-flex justify-content-between align-items-center text-medium-emphasis small">
                <span>Tổng số bản ghi: {data.length}</span>
                <div className="d-flex align-items-center">
                    <span>Số bản ghi/trang</span>
                    <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                    <span className="me-3">0 - 0 bản ghi</span>
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
            <CFormInput type="text" placeholder="Tìm kiếm..." className="ps-5" />
            <CIcon icon={cilSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          </div>
          <div className="filter-list flex-grow-1">
            <CFormCheck id="filterMaNV" label="Mã nhân viên" className="mb-2" />
            <CFormCheck id="filterHoTen" label="Họ và tên" className="mb-2" />
            <CFormCheck id="filterViTri" label="Vị trí công việc" className="mb-2" />
          </div>
          <div className="filter-footer d-flex gap-2 mt-auto pt-3 border-top">
            <CButton color="white" className="border w-50" onClick={() => setShowFilter(false)}>Bỏ lọc</CButton>
            <CButton color="success" className="text-white w-50" onClick={() => setShowFilter(false)}>Áp dụng</CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>

      {/* --- 4. MODAL TÙY CHỈNH BÁO CÁO (Nút xanh) --- */}
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
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Kỳ báo cáo</CFormLabel></CCol>
              <CCol md={8}>
                <CFormSelect className="mb-2"><option>Năm nay</option></CFormSelect>
                <div className="d-flex gap-2">
                    <CInputGroup><CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText><CFormInput type="date" defaultValue="2025-01-01" /></CInputGroup>
                    <CInputGroup><CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText><CFormInput type="date" defaultValue="2025-12-31" /></CInputGroup>
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Hiển thị chi tiết các khoản lương</CFormLabel></CCol>
              <CCol md={8}>
                <div className="d-flex">
                  <CFormCheck type="radio" name="hienThiChiTiet" id="hienThiCo" label="Có" className="me-4 text-success" defaultChecked/>
                  <CFormCheck type="radio" name="hienThiChiTiet" id="hienThiKhong" label="Không"/>
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

      {/* --- 5. MODAL CÀI ĐẶT (Bánh răng) --- */}
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
                        <CFormCheck id="colMaNV" label="Mã nhân viên" checked={tempColumns.maNV} onChange={() => toggleColumn('maNV')} className="mb-3" />
                        <CFormCheck id="colHoTen" label="Họ và tên" checked={tempColumns.hoTen} onChange={() => toggleColumn('hoTen')} className="mb-3" />
                        <CFormCheck id="colDonVi" label="Đơn vị công tác" checked={tempColumns.donVi} onChange={() => toggleColumn('donVi')} className="mb-3" />
                        <CFormCheck id="colViTri" label="Vị trí công việc" checked={tempColumns.viTri} onChange={() => toggleColumn('viTri')} className="mb-3" />
                        
                        <CFormCheck id="colHinhThucThanhToan" label="Hình thức thanh toán" checked={tempColumns.hinhThucThanhToan} onChange={() => toggleColumn('hinhThucThanhToan')} className="mb-3 fw-bold" />
                        <div className="ms-3">
                           <CFormCheck id="colChuyenKhoan" label="Chuyển khoản" checked={tempColumns.chuyenKhoan} onChange={() => toggleColumn('chuyenKhoan')} className="mb-2" />
                           <CFormCheck id="colTienMat" label="Tiền mặt" checked={tempColumns.tienMat} onChange={() => toggleColumn('tienMat')} className="mb-2" />
                        </div>
                        
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

export default PaymentSummaryReportPage