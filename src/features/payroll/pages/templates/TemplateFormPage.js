import {
  cilArrowLeft,
  cilCompress,
  cilLightbulb, // Icon đã sửa
  cilPlus,
  cilSearch,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
  // 1. IMPORT THÊM CÁC COMPONENT MODAL
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import SCSS
import '../../scss/template-form-page.scss'

// Dữ liệu giả cho bảng thành phần
const mockComponents = [
  {
    id: 1,
    name: 'Tổng thu nhập',
    code: 'TONG_THU_NHAP',
    display: 'Tổng thu nhập',
    formula: '=TONG_THU_NHAP',
    visible: true,
  },
  {
    id: 2,
    name: 'Tổng khấu trừ',
    code: 'TONG_KHAU_TRU',
    display: 'Tổng khấu trừ',
    formula: '=TONG_KHAU_TRU',
    visible: true,
  },
  {
    id: 3,
    name: 'Lương kỳ này',
    code: 'LUONG_KY_NAY',
    display: 'Lương kỳ này',
    formula: '=TONG_THU_NHAP-TONG_KHAU_TRU',
    visible: true,
  },
  {
    id: 4,
    name: 'Tạm ứng',
    code: 'TAM_UNG',
    display: 'Tạm ứng',
    formula: '',
    visible: true,
  },
  {
    id: 5,
    name: 'Thực lĩnh',
    code: 'THUC_LINH',
    display: 'Thực lĩnh',
    formula: '=LUONG_KY_NAY-TAM_UNG',
    visible: true,
  },
]

/**
 * Utility Component để render công thức có màu
 */
const FormulaDisplay = ({ formula }) => {
  if (!formula) return null

  const parts = formula.split(/(=|\+|-|\*|\/)/g).filter(Boolean)

  return (
    <span className="formula-cell">
      {parts.map((part, index) => {
        if (part.match(/(=|\+|-|\*|\/)/)) {
          return (
            <span key={index} className="operator">
              {part}
            </span>
          )
        }
        return (
          <span key={index} className="variable">
            {part}
          </span>
        )
      })}
    </span>
  )
}

const TemplateFormPage = () => {
  const [componentsData, setComponentsData] = useState(mockComponents)
  // State để quản lý modal
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const navigate = useNavigate()

  // Mở modal khi nhấn "Lưu"
  const handleSave = () => {
    setShowSaveConfirm(true)
  }

  // Quay về trang danh sách (sửa lỗi nút Hủy/Quay lại)
  const handleCancel = () => {
    navigate('/payroll/templates')
  }

  // Xác nhận lưu (từ modal)
  const confirmSave = () => {
    console.log('ĐÃ ĐỒNG Ý LƯU! Đang điều hướng...')
    setShowSaveConfirm(false)
    // Điều hướng về trang danh sách
    navigate('/payroll/templates')
  }

  return (
    <div className="template-form-page">
      {/* 1. PHẦN HEADER CỐ ĐỊNH (HỦY / LƯU) */}
      <div className="page-form-header">
        <CButton variant="ghost" size="sm" className="me-2" onClick={handleCancel}>
          <CIcon icon={cilArrowLeft} size="lg" />
        </CButton>
        <h4 className="mb-0">Thêm mẫu bảng lương</h4>
        <div className="ms-auto">
          <CButton variant="outline" color="dark" className="me-2" onClick={handleCancel}>
            Hủy bỏ
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Lưu
          </CButton>
        </div>
      </div>

      {/* 2. PHẦN NỘI DUNG FORM (CÓ THỂ CUỘN) */}
      <div className="form-content">
        {/* THÔNG TIN CHUNG */}
        <CCard className="mb-3">
          <CCardHeader>THÔNG TIN CHUNG</CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="g-3">
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
                <CCol md={6}>
                  <CFormLabel htmlFor="nhanVienApDung">
                    Nhân viên áp dụng
                  </CFormLabel>
                  <CFormSelect id="nhanVienApDung">
                    <option value="">Tất cả các nhân viên trong đơn vị</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="tenMau">
                    Tên mẫu bảng lương <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    id="tenMau"
                    defaultValue="Mẫu bảng lương - Tất cả các vị trí trong đơn vị"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>

        {/* THÀNH PHẦN LƯƠNG */}
        <CCard>
          <CCardHeader className="components-header">
            <span>THÀNH PHẦN LƯƠNG</span>
            <div className="d-flex align-items-center">
              <CInputGroup className="me-3">
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput placeholder="Tìm kiếm" />
              </CInputGroup>
              <CButton variant="outline">
                <CIcon icon={cilLightbulb} className="me-2" />
                Tạo mẫu bảng lương bằng AI
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable hover responsive align="middle" className="mb-0">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Tên thành phần</CTableHeaderCell>
                  <CTableHeaderCell>Mã thành phần</CTableHeaderCell>
                  <CTableHeaderCell>Tên cột hiển thị</CTableHeaderCell>
                  <CTableHeaderCell>Công thức</CTableHeaderCell>
                  <CTableHeaderCell>Hiển thị</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {componentsData.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>
                      <code className="code-cell">{item.code}</code>
                    </CTableDataCell>
                    <CTableDataCell>{item.display}</CTableDataCell>
                    <CTableDataCell>
                      <FormulaDisplay formula={item.formula} />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormCheck defaultChecked={item.visible} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </div>

      {/* 3. PHẦN FOOTER CỐ ĐỊNH */}
      <div className="page-form-footer">
        <CFormSwitch
          label="Xem trước mẫu bảng lương"
          id="previewSwitch"
        />
        <div className="ms-auto">
          <CButton color="primary" className="me-2">
            <CIcon icon={cilPlus} className="me-2" />
            Thêm thành phần
          </CButton>
          <CButton variant="outline" color="dark">
            <CIcon icon={cilCompress} className="me-2" />
            Tạo mẫu rút gọn
          </CButton>
        </div>
      </div>

      {/* 6. ĐỊNH NGHĨA MODAL XÁC NHẬN */}
      {/* Thêm alignment="center" để căn giữa modal theo chiều dọc */}
      <CModal
        visible={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        alignment="center"
      >
        <CModalHeader onClose={() => setShowSaveConfirm(false)}>
          <CModalTitle>Xác nhận lưu</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn có chắc chắn muốn lưu mẫu bảng lương này không?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSaveConfirm(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={confirmSave}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default TemplateFormPage