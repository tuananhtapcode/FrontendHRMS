import {
  cilCheckCircle,
  cilChevronLeft,
  cilChevronRight,
  cilDescription,
  cilFilter,
  cilLibrary,
  cilPlus,
  cilSearch,
  cilSettings,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate

// Import SCSS
import '../../scss/templates-page.scss'

const TemplatesPage = () => {
  // Dùng state để chứa dữ liệu. Bắt đầu với mảng rỗng để hiển thị Empty State
  const [data, setData] = useState([])
  const navigate = useNavigate() // <-- 2. KHỞI TẠO HOOK

  // Hàm xử lý khi nhấn nút Thêm mới
  const handleAddNew = () => {
    navigate('new') // <-- 3. ĐIỀU HƯỚNG ĐẾN ROUTE 'new' (tương đối)
  }

  return (
    <div className="templates-page">
      {/* 1. PHẦN HEADER */}
      <div className="page-header">
        <h2 className="mb-0">Mẫu bảng lương</h2>
        <div className="page-header-actions">
          <CButton variant="outline" color="dark" className="me-2">
            <CIcon icon={cilLibrary} className="me-2" />
            Thư viện mẫu
          </CButton>
          {/* 4. GẮN SỰ KIỆN onClick VÀO NÚT */}
          <CButton color="primary" onClick={handleAddNew}>
            <CIcon icon={cilPlus} className="me-2" />
            Thêm mới
          </CButton>
        </div>
      </div>

      {/* 2. PHẦN FILTER BAR */}
      <CCard className="filter-card mt-3">
        <CCardBody>
          <div className="filter-bar">
            <CInputGroup className="filter-search">
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput placeholder="Tìm kiếm" />
            </CInputGroup>
            <CFormSelect className="filter-select">
              <option>Đang áp dụng</option>
              <option>Không áp dụng</option>
            </CFormSelect>
            <CFormSelect className="filter-select">
              <option>Tất cả đơn vị</option>
              {/* Thêm các đơn vị khác ở đây */}
            </CFormSelect>
            <div className="filter-actions">
              <CIcon icon={cilFilter} size="lg" />
              <CIcon icon={cilSettings} size="lg" />
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* 3. PHẦN NỘI DUNG (TABLE HOẶC EMPTY STATE) */}
      <CCard className="content-card mt-3">
        {data.length === 0 ? (
          // 3a. EMPTY STATE
          <CCardBody className="empty-state">
            <CIcon icon={cilDescription} size="5xl" className="empty-icon" />
            <p className="mt-3">Không có dữ liệu</p>
          </CCardBody>
        ) : (
          // 3b. TABLE (khi có dữ liệu)
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Tên mẫu bảng lương</CTableHeaderCell>
                <CTableHeaderCell>
                  Đơn vị áp dụng
                  <CIcon icon={cilCheckCircle} className="ms-1 text-success" />
                </CTableHeaderCell>
                <CTableHeaderCell>Vị trí áp dụng</CTableHeaderCell>
                <CTableHeaderCell>Nhân viên áp dụng</CTableHeaderCell>
                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>{/* {data.map(item => (...))} */}</CTableBody>
          </CTable>
        )}
      </CCard>

      {/* 4. PHẦN PAGINATION (CHÂN TRANG) */}
      <div className="pagination-footer mt-3">
        <span>Tổng số bản ghi: 0</span>
        <div className="pagination-controls">
          <span>Số bản ghi/trang</span>
          <CFormSelect size="sm" className="ms-2" style={{ width: '70px' }}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </CFormSelect>
          <span className="ms-3 me-3">0 - 0 bản ghi</span>
          <CButton color="link" shape="square" size="sm" disabled>
            <CIcon icon={cilChevronLeft} />
          </CButton>
          <CButton color="link" shape="square" size="sm" disabled>
            <CIcon icon={cilChevronRight} />
          </CButton>
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage