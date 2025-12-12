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
import '../../scss/salary-summary-page.scss'

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
        <h2 className="mb-0">Bảng tổng hợp lương</h2>
      </div>

      {/* 2. PHẦN NỘI DUNG (EMPTY STATE) */}
      <CCard className="content-card mt-3">
        {data.length === 0 ? (
          // 3a. EMPTY STATE
          <CCardBody className="empty-state">
            <CIcon icon={cilNewspaper} size="5xl" className="empty-icon" />
            <h5 className="mt-4">Chưa có bảng tổng hợp lương</h5>
            <p className="text-medium-emphasis">
              Lập bảng tổng hợp lương hàng kỳ cho đơn vị
            </p>
            <CButton color="success" onClick={handleAddNew} className="mt-3">
              <CIcon icon={cilPlus} className="me-2" />
              Thêm mới
            </CButton>
          </CCardBody>
        ) : (
          // 3b. TABLE (khi có dữ liệu)
          <div className="p-3">
            <p>Hiển thị bảng tổng hợp lương ở đây...</p>
          </div>
        )}
      </CCard>

      {/* 6. ĐỊNH NGHĨA MODAL "THÊM BẢNG TỔNG HỢP LƯƠNG" */}
      <CModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg"
        backdrop="static"
        alignment="center" // Căn giữa
      >
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Thêm bảng tổng hợp lương</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="kyLuong">
                  Kỳ lương <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput type="month" id="kyLuong" defaultValue="2025-11" />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="ngayTongHop">Ngày tổng hợp</CFormLabel>
                <CFormInput type="date" id="ngayTongHop" defaultValue="2025-11-13" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>
                  Bảng lương <span className="text-danger">*</span>
                </CFormLabel>
                <div>
                  <CButton variant="ghost" color="primary">
                    <CIcon icon={cilPlus} className="me-2" />
                    Thêm bảng lương
                  </CButton>
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="donVi">Đơn vị</CFormLabel>
                <CFormSelect id="donVi">
                  <option value="">Chọn đơn vị</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="viTri">Vị trí</CFormLabel>
                <CFormSelect id="viTri">
                  <option value="">Tất cả các vị trí trong đơn vị</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="tenBangTongHop">
                  Tên bảng tổng hợp <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="tenBangTongHop"
                  defaultValue="Bảng tổng hợp lương Tháng 11/2025"
                />
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
        <CModalBody>Bạn có chắc chắn muốn lưu bảng tổng hợp lương này không?</CModalBody>
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