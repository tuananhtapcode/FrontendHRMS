import {
  cilNewspaper,
  cilPlus
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  // 1. Import thêm component cho Modal
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import SCSS mới
import '../../scss/payment-summary-page.scss'

const SalarySummaryPage = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()

  // 2. State cho 2 modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false)

  // 3. Mở modal chính
  const handleAddNew = () => {
    setShowAddModal(true)
  }

  // 4. Mở modal xác nhận
  const openSaveConfirmModal = () => {
    // Tạm thời đóng modal chính và mở modal xác nhận
    // Bạn có thể giữ modal chính mở nếu muốn, nhưng đóng đi sẽ gọn hơn
    setShowSaveConfirmModal(true)
  }

  // 5. Xử lý lưu (từ modal xác nhận)
  const handleSaveSummary = () => {
    // TODO: Thêm logic lưu dữ liệu
    console.log('Đã nhấn Lưu bảng tổng hợp')
    setShowSaveConfirmModal(false) // Đóng modal xác nhận
    setShowAddModal(false) // Đóng modal chính
  }

  return (
    // Dùng class mới
    <div className="salary-summary-page">
      {/* 1. PHẦN HEADER */}
      <div className="page-header">
        <h2 className="mb-0">Bảng tổng hợp chi trả</h2>
      </div>

      {/* 2. PHẦN NỘI DUNG (EMPTY STATE) */}
      <CCard className="content-card mt-3">
        {data.length === 0 ? (
          // 3a. EMPTY STATE
          <CCardBody className="empty-state">
            <CIcon icon={cilNewspaper} size="5xl" className="empty-icon" />
            <h5 className="mt-4">Chưa có bảng tổng hợp chi trả</h5>
            <p className="text-medium-emphasis">
              Lập bảng tổng hợp chi trả lương hàng kỳ cho đơn vị
            </p>
            <CButton color="success" onClick={handleAddNew} className="mt-3">
              <CIcon icon={cilPlus} className="me-2" />
              Thêm mới
            </CButton>
          </CCardBody>
        ) : (
          // 3b. TABLE (khi có dữ liệu)
          <div className="p-3">
            <p>Hiển thị bảng tổng hợp chi trả ở đây...</p>
          </div>
        )}
      </CCard>

      {/* 6. ĐỊNH NGHĨA MODAL "THÊM BẢNG TỔNG HỢP CHI TRẢ" */}
      <CModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg"
        backdrop="static"
        alignment="center" // Căn giữa
      >
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Thêm bảng tổng hợp chi trả</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="bangChiTra">
                  Bảng chi trả lương <span className="text-danger">*</span>
                </CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormSelect id="bangChiTra">
                  <option value="">Chọn bảng chi trả</option>
                  {/* Thêm option ở đây */}
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
                  {/* Thêm option ở đây */}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="tenBangTongHop">
                  Tên bảng tổng hợp <span className="text-danger">*</span>
                </CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormInput
                  type="text"
                  id="tenBangTongHop"
                  defaultValue="Bảng tổng hợp chi trả lương tháng 11/2025 lần 1"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="kyTongHop">
                  Kỳ tổng hợp <span className="text-danger">*</span>
                </CFormLabel>
              </CCol>
              <CCol md={8}>
                <CInputGroup>
                  <CFormInput type="text" defaultValue="Lần 1" style={{ maxWidth: '100px' }} />
                  <CFormInput type="date" id="kyTongHop" defaultValue="2025-11-14" />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4}>
                <CFormLabel htmlFor="hinhThucThanhToan">Hình thức thanh toán</CFormLabel>
              </CCol>
              <CCol md={8}>
                <CFormInput type="text" id="hinhThucThanhToan" readOnly />
              </CCol>
            </CRow>
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
        <CModalBody>Bạn có chắc chắn muốn lưu bảng tổng hợp chi trả này không?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSaveConfirmModal(false)}>
            Hủy
          </CButton>
          <CButton color="success" onClick={handleSaveSummary}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default SalarySummaryPage