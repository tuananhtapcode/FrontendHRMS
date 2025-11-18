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
  // Import thêm cho Modal & Sidebar
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
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useState } from 'react'

// Import SCSS
import '../../scss/salary-over-time-report-page.scss'

const SalaryOverTimeReportPage = () => {
  const [data, setData] = useState([]) 
  const [selectedYear, setSelectedYear] = useState(2025)

  // --- STATE QUẢN LÝ UI ---
  const [showCustomizeModal, setShowCustomizeModal] = useState(false) // Modal xanh
  const [showFilter, setShowFilter] = useState(false) // Sidebar
  const [showSettingsModal, setShowSettingsModal] = useState(false) // Modal bánh răng

  // Tạo danh sách 12 tháng
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return `Tháng ${month.toString().padStart(2, '0')}/${selectedYear}`
  })

  // Render Footer
  const renderFooterRow = () => {
    return (
      <CTableRow className="footer-row fw-bold">
        <CTableDataCell className="sticky-col col-stt text-center bg-white border-top"></CTableDataCell>
        <CTableDataCell className="sticky-col col-code bg-white border-top" colSpan={2}>Tổng cộng</CTableDataCell>
        <CTableDataCell className="col-org border-top"></CTableDataCell>
        <CTableDataCell className="col-pos border-top"></CTableDataCell>
        {months.map((_, index) => (
          <CTableDataCell key={index} className="col-month text-end border-top">0,00</CTableDataCell>
        ))}
        <CTableDataCell className="col-avg text-end border-top">0,00</CTableDataCell>
      </CTableRow>
    )
  }

  return (
    <div className="salary-over-time-report-page">
      {/* 1. HEADER */}
      <div className="page-header mb-3">
        <div className="header-left">
          <h4 className="mb-1">Thống kê lương theo thời gian</h4>
          <span className="text-medium-emphasis">Tất cả đơn vị - Năm nay</span>
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
          <CButton variant="outline" color="secondary" className="icon-btn" onClick={() => setShowSettingsModal(true)}>
            <CIcon icon={cilSettings} />
          </CButton>
        </div>
      </div>

      {/* 2. NỘI DUNG BÁO CÁO */}
      <CCard className="content-card">
        <div className="table-responsive table-scroll-container">
          <CTable hover align="middle" className="mb-0 report-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="sticky-col col-stt text-center">STT</CTableHeaderCell>
                <CTableHeaderCell className="sticky-col col-code">Mã nhân viên</CTableHeaderCell>
                <CTableHeaderCell className="sticky-col col-name border-end-separate">Họ và tên</CTableHeaderCell>
                <CTableHeaderCell className="col-org">Đơn vị công tác</CTableHeaderCell>
                <CTableHeaderCell className="col-pos">Vị trí công việc</CTableHeaderCell>
                {months.map((month, index) => (
                  <CTableHeaderCell key={index} className="col-month text-end">{month}</CTableHeaderCell>
                ))}
                <CTableHeaderCell className="col-avg text-end">Bình quân</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.length === 0 ? (
                <CTableRow>
                  <CTableHeaderCell colSpan={5 + months.length + 1} className="empty-state-cell">
                    <div className="empty-state py-5">
                      <CIcon icon={cilDescription} size="5xl" className="empty-icon mb-3" />
                      <p className="text-medium-emphasis">Không có dữ liệu</p>
                    </div>
                  </CTableHeaderCell>
                </CTableRow>
              ) : (
                data.map((item, index) => (
                  <CTableRow key={index}>
                    {/* Render row data... */}
                  </CTableRow>
                ))
              )}
            </CTableBody>
            <CTableFoot className="report-table-foot">
               {renderFooterRow()}
            </CTableFoot>
          </CTable>
        </div>
        
        <div className="report-footer-pagination p-3 border-top">
            <div className="fw-bold mb-2">Tổng cộng: {data.length} nhân viên</div>
            <div className="d-flex justify-content-between align-items-center text-medium-emphasis small">
                <span>Tổng số bản ghi: {data.length}</span>
                <div className="d-flex align-items-center">
                    <span>Số bản ghi/trang</span>
                    <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                    <span className="me-3">1 - {data.length} bản ghi</span>
                    <div className="btn-group">
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronLeft} /></CButton>
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronRight} /></CButton>
                    </div>
                </div>
            </div>
        </div>
      </CCard>

      {/* --- 3. SIDEBAR BỘ LỌC (Phễu) --- */}
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

            {/* Field mới: Trạng thái lao động */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Trạng thái lao động</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Đang làm việc</option><option>Đã nghỉ việc</option></CFormSelect></CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Thống kê theo</CFormLabel></CCol>
              <CCol md={8}><CFormSelect><option>Thực lĩnh</option><option>Tổng thu nhập</option></CFormSelect></CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">Kỳ báo cáo</CFormLabel></CCol>
              <CCol md={8}>
                 <div className="d-flex gap-2 mb-2">
                    <CFormSelect className="w-50"><option>Theo tháng</option></CFormSelect>
                    <CFormSelect className="w-50"><option>Năm nay</option></CFormSelect>
                 </div>
                <div className="d-flex gap-2">
                    <CInputGroup>
                        <CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText>
                        <CFormInput type="month" defaultValue="2025-01" />
                    </CInputGroup>
                    <CInputGroup>
                        <CInputGroupText className="bg-white"><CIcon icon={cilCalendar} /></CInputGroupText>
                        <CFormInput type="month" defaultValue="2025-12" />
                    </CInputGroup>
                </div>
              </CCol>
            </CRow>

            {/* Field mới: So sánh với năm trước */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4}><CFormLabel className="mb-0 fw-bold">So sánh với năm trước</CFormLabel></CCol>
              <CCol md={8}>
                <div className="d-flex">
                  <CFormCheck type="radio" name="soSanhNamTruoc" id="soSanhCo" label="Có" className="me-4" />
                  <CFormCheck type="radio" name="soSanhNamTruoc" id="soSanhKhong" label="Không" defaultChecked className="text-success" />
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
                        <CFormCheck id="colSTT" label="STT" defaultChecked className="mb-3" />
                        <CFormCheck id="colMaNV" label="Mã nhân viên" defaultChecked className="mb-3" />
                        <CFormCheck id="colHoTen" label="Họ và tên" defaultChecked className="mb-3" />
                        <CFormCheck id="colDonVi" label="Đơn vị công tác" defaultChecked className="mb-3" />
                        <CFormCheck id="colViTri" label="Vị trí công việc" defaultChecked className="mb-3" />
                        {/* Generate các cột tháng trong Cài đặt */}
                        {months.map((month, index) => (
                            <CFormCheck key={index} id={`colMonth${index}`} label={month} defaultChecked className="mb-3" />
                        ))}
                        <CFormCheck id="colBinhQuan" label="Bình quân" defaultChecked className="mb-3" />
                    </div>
                </div>
            </CForm>
        </CModalBody>
        <CModalFooter className="bg-light border-0">
             <CButton color="success" className="text-white w-100" onClick={() => setShowSettingsModal(false)}>Lưu</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default SalaryOverTimeReportPage