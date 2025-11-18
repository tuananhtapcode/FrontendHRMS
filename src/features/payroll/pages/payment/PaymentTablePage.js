import {
  cilDescription,
  cilPlus,
  cilWallet, // Icon cái ví
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
  // 1. Import đầy đủ component cho Modal
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useState } from 'react'
// 2. IMPORT LẠI useNavigate (SỬA LỖI)
import { useNavigate } from 'react-router-dom'

// Import SCSS
import '../../scss/payment-table-page.scss'

const PaymentTablePage = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate() // <-- Dòng này đã hoạt động

  // 2. State cho 2 modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false)

  // 3. State cho logic form
  const [traLuongTheo, setTraLuongTheo] = useState('TiLe') // 'TiLe' hoặc 'SoTien'
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState('TienMat') // 'TienMat' hoặc 'ChuyenKhoan'

  // 4. Mở modal chính
  const handleAddNew = () => {
    // Reset state khi mở modal
    setTraLuongTheo('TiLe')
    setHinhThucThanhToan('TienMat')
    setShowAddModal(true)
  }

  // 5. Mở modal xác nhận
  const openSaveConfirmModal = () => {
    setShowSaveConfirmModal(true)
  }

  // 6. Xử lý lưu (từ modal xác nhận)
  const handleSavePayment = () => {
    // TODO: Thêm logic lưu dữ liệu
    console.log('Đã nhấn Lưu bảng chi trả')
    setShowSaveConfirmModal(false) // Đóng modal xác nhận
    setShowAddModal(false) // Đóng modal chính
  }

  return (
    // Dùng class "payment-table-page"
    <div className="payment-table-page">
      {/* 1. PHẦN HEADER */}
      <div className="page-header">
        <h2 className="mb-0">Chi trả</h2>
        <div className="page-header-actions">
          <CButton variant="outline" color="dark" className="me-2">
            <CIcon icon={cilDescription} className="me-2" />
            Thiết lập ban đầu
          </CButton>
        </div>
      </div>

      {/* 2. PHẦN NỘI DUNG (EMPTY STATE) */}
      <CCard className="content-card mt-3">
        {data.length === 0 ? (
          // 3a. EMPTY STATE
          <CCardBody className="empty-state">
            <CIcon icon={cilWallet} size="5xl" className="empty-icon" />
            <h5 className="mt-4">Chưa có bảng tổng hợp chi trả lương</h5>
            <p className="text-medium-emphasis">
              Lập bảng tổng hợp chi trả lương hàng kỳ cho đơn vị
            </p>
            {/* Nút màu xanh lá (success) giống thiết kế */}
            <CButton color="success" onClick={handleAddNew} className="mt-3">
              <CIcon icon={cilPlus} className="me-2" />
              Thêm mới
            </CButton>
          </CCardBody>
        ) : (
          // 3b. TABLE (khi có dữ liệu)
          <div className="p-3">
            {/* TODO: Thêm bảng dữ liệu khi data.length > 0 */}
            <p>Hiển thị bảng chi trả ở đây...</p>
          </div>
        )}
      </CCard>

      {/* 6. ĐỊNH NGHĨA MODAL "THÊM BẢNG CHI TRẢ LƯƠNG" */}
      <CModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg"
        backdrop="static"
        alignment="center" // Căn giữa
      >
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Thêm bảng chi trả lương</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="bangLuong">
                  Bảng lương <span className="text-danger">*</span>
                </CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormSelect id="bangLuong">
                  <option value="">Chọn bảng lương</option>
                  {/* Thêm các bảng lương ở đây */}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="donViApDung">Đơn vị áp dụng</CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormSelect id="donViApDung">
                  <option value="">Chọn đơn vị</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="viTriApDung">Vị trí áp dụng</CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormInput
                  type="text"
                  id="viTriApDung"
                  defaultValue="Tất cả các vị trí trong đơn vị"
                  readOnly
                />
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel>Nhân viên áp dụng</CFormLabel>
              </CCol>
              <CCol md={8}>
                <div className="d-flex pt-2">
                  <CFormCheck
                    type="radio"
                    name="nhanVienApDung"
                    id="nvTatCa"
                    label="Tất cả"
                    defaultChecked
                  />
                  <CFormCheck
                    type="radio"
                    name="nhanVienApDung"
                    id="nvDuocChon"
                    label="Nhân viên được chọn"
                    className="ms-3"
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="tenBangChiTra">
                  Tên bảng chi trả lương <span className="text-danger">*</span>
                </CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormInput type="text" id="tenBangChiTra" />
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="kyChiTra">
                  Kỳ chi trả <span className="text-danger">*</span>
                </CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormInput type="date" id="kyChiTra" defaultValue="2025-11-14" />
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="traLuongTheo">Trả lương theo</CFormLabel>
              </CCol>
              <CCol md={8}>
                <CInputGroup>
                  <CFormSelect
                    style={{ maxWidth: '150px' }}
                    value={traLuongTheo} // <-- Gán value
                    onChange={(e) => setTraLuongTheo(e.target.value)} // <-- Thêm onChange
                  >
                    {/* DÒNG NÀY ĐÃ ĐƯỢC SỬA */}
                    <option value="TiLe">Tỉ lệ</option> 
                    <option value="SoTien">Số tiền</option>
                  </CFormSelect>
                  <CFormInput type="number" defaultValue="100" />
                  {/* --- HIỂN THỊ CÓ ĐIỀU KIỆN --- */}
                  <CInputGroupText>
                    {traLuongTheo === 'TiLe' ? '%' : 'VNĐ'}
                  </CInputGroupText>
                  {/* ----------------------------- */}
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="hinhThucThanhToan">Hình thức thanh toán</CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormSelect
                  id="hinhThucThanhToan"
                  value={hinhThucThanhToan} // <-- Gán value
                  onChange={(e) => setHinhThucThanhToan(e.target.value)} // <-- Thêm onChange
                >
                  <option value="TienMat">Tiền mặt</option>
                  <option value="ChuyenKhoan">Chuyển khoản</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* --- HIỂN THỊ CÓ ĐIỀU KIỆN --- */}
            {hinhThucThanhToan === 'ChuyenKhoan' && (
              <CRow className="mb-3 align-items-center">
                <CCol md={4}>
                  <CFormLabel htmlFor="soTaiKhoan">Số tài khoản</CFormLabel>
                </CCol>
                <CCol md={8}>
                  <CInputGroup>
                    <CFormInput type="text" id="soTaiKhoan" placeholder="Số tài khoản" />
                    <CFormSelect style={{ maxWidth: '200px' }}>
                      <option value="">Chọn ngân hàng</option>
                      {/* Thêm các ngân hàng ở đây */}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
              </CRow>
            )}
            {/* ----------------------------- */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setShowAddModal(false)}>
            Hủy bỏ
          </CButton>
          <CButton color="success" onClick={openSaveConfirmModal}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 7. ĐỊNH NGHĨA MODAL XÁC NHẬN LƯU */}
      <CModal
        visible={showSaveConfirmModal}
        onClose={() => setShowSaveConfirmModal(false)}
        alignment="center"
      >
        <CModalHeader onClose={() => setShowSaveConfirmModal(false)}>
          <CModalTitle>Xác nhận lưu</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn có chắc chắn muốn lưu bảng chi trả lương này không?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSaveConfirmModal(false)}>
            Hủy
          </CButton>
          <CButton color="success" onClick={handleSavePayment}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PaymentTablePage