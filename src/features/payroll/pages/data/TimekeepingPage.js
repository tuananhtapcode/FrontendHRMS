import { cilCalendar, cilPlus } from '@coreui/icons'
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
  CFormSwitch,
  // 2. IMPORT THÊM CÁC COMPONENT MODAL & FORM
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from '@coreui/react'
import { useState } from 'react'; // <-- 1. IMPORT useState
import { useNavigate } from 'react-router-dom'

// Import SCSS
import '../../scss/timekeeping-page.scss'

const TimekeepingPage = () => {
  const navigate = useNavigate()
  // 3. TẠO STATE ĐỂ QUẢN LÝ MODAL
  const [showAddModal, setShowAddModal] = useState(false)

  // 4. SỬA HÀM NÀY ĐỂ MỞ MODAL
  const handleAddNew = () => {
    setShowAddModal(true)
  }

  // Hàm xử lý khi nhấn "Lưu" trên modal
  const handleSaveTimekeeping = () => {
    // TODO: Thêm logic lưu dữ liệu
    console.log('Đã nhấn Lưu bảng chấm công')
    setShowAddModal(false) // Đóng modal sau khi lưu
  }

  return (
    <div className="timekeeping-page">
      {/* 1. PHẦN HEADER */}
      <div className="page-header">
        <h2 className="mb-3">Chấm công</h2>
      </div>

      {/* 2. PHẦN NỘI DUNG (EMPTY STATE) */}
      <CCard className="empty-state-card">
        <CCardBody className="empty-state-body">
          <div className="empty-state-icon-wrapper">
            <CIcon icon={cilCalendar} className="empty-icon" />
          </div>
          <h5 className="mt-4">Chưa có bảng chấm công</h5>
          <p className="text-medium-emphasis">
            Khai báo bảng chấm công tổng hợp hàng kỳ để sử dụng làm dữ liệu tính
            lương theo thời gian
          </p>
          {/* Nút "Thêm mới" này sẽ gọi hàm handleAddNew */}
          <CButton color="primary" onClick={handleAddNew} className="mt-3">
            <CIcon icon={cilPlus} className="me-2" />
            Thêm mới
          </CButton>
        </CCardBody>
      </CCard>

      {/* 5. ĐỊNH NGHĨA MODAL "THÊM BẢNG CHẤM CÔNG" */}
      <CModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        alignment="center"
        size="lg" // <-- Thêm size "lg" cho modal to hơn
      >
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Thêm bảng chấm công tổng hợp</CModalTitle>
          <CFormSwitch
            className="ms-auto" // Đẩy qua bên phải
            label="Tách công theo địa điểm làm việc"
            id="tachCongSwitch"
          />
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="thoiGianBatDau">
                  Thời gian <span className="text-danger">*</span>
                </CFormLabel>
                {/* ĐỔI type="text" thành "date". 
                  Trình duyệt sẽ tự động hiển thị bảng lịch.
                  Chúng ta sẽ bỏ CInputGroup và icon đi.
                */}
                <CFormInput type="date" id="thoiGianBatDau" placeholder="dd/mm/yyyy" />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="thoiGianKetThuc">&nbsp;</CFormLabel>
                {/* Tương tự, đổi thành type="date" */}
                <CFormInput type="date" id="thoiGianKetThuc" placeholder="dd/mm/yyyy" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="donViApDung">
                  Đơn vị áp dụng <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect id="donViApDung">
                  <option value="">Chọn đơn vị</option>
                  {/* Thêm option đơn vị ở đây */}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="viTriApDung">Vị trí áp dụng</CFormLabel>
                <CFormSelect id="viTriApDung">
                  {/* Dòng này đã được sửa lỗi */}
                  <option value="">Tất cả các vị trí trong đơn vị</option>
                  {/* Thêm option vị trí ở đây */}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="tenBangChamCong">
                  Tên bảng chấm công tổng hợp <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="tenBangChamCong"
                  placeholder="Bảng chấm công tổng hợp 01/11/2025 - 30/11/2025 - null"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="hinhThucChamCong">
                  Hình thức chấm công <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect id="hinhThucChamCong">
                  <option value="">Theo ca</option>
                  {/* Thêm option khác ở đây */}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Công chuẩn theo tháng</CFormLabel>
                <div className="d-flex pt-2">
                  <CFormCheck
                    type="radio"
                    name="congChuan"
                    id="congChuanTheoThang"
                    label="Công chuẩn theo tháng"
                    defaultChecked
                  />
                  <CFormCheck
                    type="radio"
                    name="congChuan"
                    id="congChuanCoDinh"
                    label="Công chuẩn cố định"
                    className="ms-3"
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Đối tượng tổng hợp</CFormLabel>
                <div className="d-flex pt-2">
                  <CFormCheck
                    type="radio"
                    name="doiTuong"
                    id="doiTuongNhanVien"
                    label="Nhân viên"
                    defaultChecked
                  />
                  <CFormCheck
                    type="radio"
                    name="doiTuong"
                    id="doiTuongDonVi"
                    label="Đơn vị"
                    className="ms-3"
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={handleSaveTimekeeping}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default TimekeepingPage