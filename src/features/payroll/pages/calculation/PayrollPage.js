import {
  cilClone,
  cilDescription,
  cilFilter, // Icon cho nút đóng
  cilInfo,
  cilPlus,
  cilSearch,
  cilSettings
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  // 1. Import thêm component cho Modal
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import SCSS (ĐÃ SỬA LỖI ĐƯỜNG DẪN)
import '../../scss/payroll-page.scss'

const PayrollPage = () => {
  // 2. Thêm state để quản lý hiển thị modal
  const [showAddModal, setShowAddModal] = useState(false)
  // THÊM MỚI: State cho modal xác nhận
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false)
  const [data, setData] = useState([])
  const navigate = useNavigate()

  // 3. Sửa hàm này để mở modal
  const handleAddNew = () => {
    setShowAddModal(true)
  }

  // 4. Đổi tên hàm này thành "openSaveConfirmModal"
  //    Nó sẽ mở modal xác nhận thay vì lưu
  const openSaveConfirmModal = () => {
    setShowSaveConfirmModal(true) // <-- CHỈ MỞ MODAL XÁC NHẬN
  }

  // 5. TẠO HÀM MỚI: Đây là logic lưu thật sự
  const handleSavePayroll = () => {
    // TODO: Thêm logic lưu dữ liệu
    console.log('Đã nhấn Lưu bảng lương')
    setShowSaveConfirmModal(false) // Đóng modal xác nhận
    setShowAddModal(false) // Đóng modal chính
  }

  return (
    <div className="payroll-page">
      {/* 1. PHẦN HEADER */}
      <div className="page-header">
        <h2 className="mb-0">Bảng lương</h2>
        <div className="page-header-actions">
          <CButton variant="outline" color="dark" className="me-2">
            <CIcon icon={cilDescription} className="me-2" />
            Quy tắc tính lương
          </CButton>
          {/* Nút "Thêm mới" gọi hàm handleAddNew */}
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
              <option>Tất cả bảng lương</option>
            </CFormSelect>
            <CFormSelect className="filter-select">
              <option>Tất cả đơn vị</option>
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
            <CIcon icon={cilClone} size="5xl" className="empty-icon" />
            <p className="mt-3">Không có dữ liệu</p>
          </CCardBody>
        ) : (
          // 3b. TABLE (khi có dữ liệu)
          <CTable hover responsive align="middle" className="mb-0">
            {/* ... code bảng ... */}
          </CTable>
        )}
      </CCard>

      {/* 4. PHẦN PAGINATION (CHÂN TRANG) */}
      <div className="pagination-footer mt-3">{/* ... code pagination ... */}</div>

      {/* 5. ĐỊNH NGHĨA MODAL "THÊM BẢNG LƯƠNG" */}
      <CModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg" // Modal lớn
        backdrop="static" // Không đóng khi bấm ra ngoài
        alignment="center" // <-- THÊM DÒNG NÀY ĐỂ CĂN GIỮA
      >
        <CModalHeader>
          <CModalTitle>Thêm bảng lương</CModalTitle>
          {/* Bạn có thể thêm CFormSwitch ở đây nếu cần */}
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Loại bảng lương <CIcon icon={cilInfo} className="ms-1" />
                </CFormLabel>
                <div className="d-flex pt-2">
                  <CFormCheck
                    type="radio"
                    name="loaiBangLuong"
                    id="bangLuongChiTiet"
                    label="Bảng lương chi tiết"
                    defaultChecked
                  />
                  <CFormCheck
                    type="radio"
                    name="loaiBangLuong"
                    id="bangLuongTongHop"
                    label="Bảng lương tổng hợp"
                    className="ms-3"
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="kyLuong">Kỳ lương</CFormLabel>
                <CInputGroup>
                  <CFormInput type="number" defaultValue="1" style={{ maxWidth: '70px' }} />
                  {/* Dùng type="month" để chọn Tháng/Năm */}
                  <CFormInput type="month" id="kyLuong" defaultValue="2025-11" />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="donViApDung">
                  Đơn vị áp dụng <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect id="donViApDung">
                  <option value="">Chọn đơn vị</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="viTriApDung">Vị trí áp dụng</CFormLabel>
                <CFormSelect id="viTriApDung">
                  <option value="">Tất cả các vị trí trong đơn vị</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="tinhChatLaoDong">Tính chất lao động</CFormLabel>
                <CFormSelect id="tinhChatLaoDong">
                  <option value="">Tất cả tính chất lao động</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="tenBangLuong">
                  Tên bảng lương <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="tenBangLuong"
                  defaultValue="Bảng lương Kỳ 1 - Tháng 11/2025"
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={12}>
                <CFormLabel>
                  Dữ liệu tính lương <span className="text-danger">*</span>
                </CFormLabel>
                <div>
                  <CButton variant="ghost" color="primary">
                    <CIcon icon={cilPlus} className="me-2" />
                    Thêm dữ liệu
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setShowAddModal(false)}>
            Hủy bỏ
          </CButton>
          {/* SỬA LỖI: Đổi "primary" thành "success" để có nút màu xanh lá */}
          {/* SỬA onClick: Trỏ đến hàm mở modal xác nhận */}
          <CButton color="success" onClick={openSaveConfirmModal}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 6. THÊM MỚI: MODAL XÁC NHẬN LƯU */}
      <CModal
        visible={showSaveConfirmModal}
        onClose={() => setShowSaveConfirmModal(false)}
        alignment="center"
      >
        <CModalHeader onClose={() => setShowSaveConfirmModal(false)}>
          <CModalTitle>Xác nhận lưu</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn có chắc chắn muốn lưu bảng lương này không?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSaveConfirmModal(false)}>
            Hủy
          </CButton>
          <CButton color="success" onClick={handleSavePayroll}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PayrollPage