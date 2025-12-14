import {
  cilArrowLeft,
  cilCompress,
  cilLightbulb,
  cilPlus,
  cilSave,
  cilSearch,
  cilWarning,
  cilX // Icon đóng modal
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

// Dùng chung SCSS với trang Components
import '../../scss/components-page.scss'

// --- DỮ LIỆU ĐANG CÓ TRONG BẢNG CHÍNH (Mock) ---
const initialComponents = [
  { id: 1, name: 'Tổng thu nhập', code: 'TONG_THU_NHAP', display: 'Tổng thu nhập', formula: '=TONG_THU_NHAP', visible: true },
  { id: 2, name: 'Tổng khấu trừ', code: 'TONG_KHAU_TRU', display: 'Tổng khấu trừ', formula: '=TONG_KHAU_TRU', visible: true },
  { id: 3, name: 'Lương kỳ này', code: 'LUONG_KY_NAY', display: 'Lương kỳ này', formula: '=TONG_THU_NHAP-TONG_KHAU_TRU', visible: true },
]

// --- [MỚI] DỮ LIỆU NGUỒN ĐỂ CHỌN TRONG MODAL (Giả lập lấy từ API Components) ---
// Cấu trúc giống ảnh image_2ee823.jpg
const AVAILABLE_COMPONENTS = [
  { id: 101, code: 'LUONG_NGAY_CONG', name: 'Lương ngày công (công chuẩn cố định)', type: 'Lương', nature: 'Thu nhập' },
  { id: 102, code: 'SO_NGAY_NGHI_KL', name: 'Số ngày nghỉ không lương', type: 'Chấm công', nature: 'Khác' },
  { id: 103, code: 'TONG_CONG_HUONG_LUONG', name: 'Tổng công hưởng lương', type: 'Chấm công', nature: 'Khác' },
  { id: 104, code: 'CONG_AN_CA', name: 'Công ăn ca', type: 'Chấm công', nature: 'Khác' },
  { id: 105, code: 'CONG_DIEU_DONG', name: 'Công điều động', type: 'Chấm công', nature: 'Khác' },
  { id: 106, code: 'SO_LAN_CAP_NHAT_CONG', name: 'Số lần cập nhật công', type: 'Chấm công', nature: 'Khác' },
  { id: 107, code: 'SO_LAN_DI_CONG_TAC', name: 'Số lần đi công tác', type: 'Chấm công', nature: 'Khác' },
  { id: 108, code: 'SO_NGAY_PHEP_CHUA_SD', name: 'Số ngày phép chưa sử dụng', type: 'Chấm công', nature: 'Khác' },
  { id: 109, code: 'TONG_GIO_LAM_THEM', name: 'Tổng giờ làm thêm', type: 'Chấm công', nature: 'Khác' },
  { id: 110, code: 'BHXH_NV', name: 'Bảo hiểm xã hội (Nhân viên đóng)', type: 'Bảo hiểm', nature: 'Khấu trừ' },
]

const FormulaDisplay = ({ formula }) => {
  if (!formula) return null
  const parts = formula.split(/(=|\+|-|\*|\/)/g).filter(Boolean)
  return (
    <span className="formula-cell" style={{ fontFamily: 'monospace', color: '#636f83' }}>
      {parts.map((part, index) => {
        if (part.match(/(=|\+|-|\*|\/)/)) return <span key={index} className="fw-bold text-dark mx-1">{part}</span>
        return <span key={index} className="text-primary">{part}</span>
      })}
    </span>
  )
}

const TemplateFormPage = () => {
  const navigate = useNavigate()
  const [componentsData, setComponentsData] = useState(initialComponents)
  
  // States Modal Xác nhận Lưu
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  // --- [MỚI] STATES CHO MODAL CHỌN THÀNH PHẦN ---
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalSearch, setModalSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([]) // Lưu ID các dòng được tick trong modal

  // --- PHÂN TRANG (Main Page) ---
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  
  const totalItems = componentsData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const view = componentsData.slice((page - 1) * pageSize, page * pageSize)

  // --- HANDLERS CHÍNH ---
  const handleSave = () => setShowSaveConfirm(true)
  const handleCancel = () => navigate('/payroll/templates')
  const confirmSave = () => { setShowSaveConfirm(false); navigate('/payroll/templates') }

  // --- HANDLERS MODAL CHỌN THÀNH PHẦN ---
  const handleOpenAddModal = () => {
    setSelectedIds([]) // Reset lựa chọn khi mở lại
    setModalSearch('')
    setShowAddModal(true)
  }

  // Toggle checkbox từng dòng
  const toggleSelectComponent = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Toggle Select All
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(AVAILABLE_COMPONENTS.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }

  // Ấn "Áp dụng" -> Thêm vào bảng chính
  const handleApplySelection = () => {
    // Lọc ra các object từ ID đã chọn
    const selectedItems = AVAILABLE_COMPONENTS.filter(c => selectedIds.includes(c.id))
    
    // Map sang cấu trúc bảng chính (thêm các field mặc định: visible, display...)
    const newItems = selectedItems.map(item => ({
        id: Date.now() + Math.random(), // Tạo ID mới để tránh trùng key
        name: item.name,
        code: item.code,
        display: item.name, // Mặc định tên hiển thị giống tên gốc
        formula: '',        // Mặc định chưa có công thức
        visible: true
    }))

    // Cập nhật bảng chính
    setComponentsData([...componentsData, ...newItems])
    setShowAddModal(false)
  }

  return (
    <div className="payroll-components">
      
      {/* 1. HEADER */}
      <div className="pc-header">
        <div className="left d-flex align-items-center gap-3">
            <CButton 
                color="light" variant="outline" onClick={handleCancel} 
                className="d-flex align-items-center border-secondary text-secondary" style={{ height: '38px' }}
            >
                <CIcon icon={cilArrowLeft} className="me-2" /> Quay lại
            </CButton>
            <div className="title mb-0">Thêm mẫu bảng lương</div>
        </div>
        <div className="right d-flex gap-2">
           <CButton color="secondary" variant="ghost" onClick={handleCancel}>Hủy bỏ</CButton>
           <CButton color="success" className="text-white d-flex align-items-center" onClick={handleSave}>
                <CIcon icon={cilSave} className="me-2" /> Lưu
           </CButton>
        </div>
      </div>

      <div className="form-content mt-3">
        {/* 2. FORM THÔNG TIN CHUNG (Giữ nguyên) */}
        <CCard className="mb-3 shadow-sm border-0">
          <CCardHeader className="bg-white fw-bold py-3">THÔNG TIN CHUNG</CCardHeader>
          <CCardBody className="p-4">
            <CForm>
              <CRow className="mb-4 align-items-center">
                <CCol md={3}><CFormLabel className="fw-semibold mb-0">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel></CCol>
                <CCol md={9}><CFormSelect><option value="">Chọn đơn vị</option></CFormSelect></CCol>
              </CRow>
              <CRow className="mb-4 align-items-center">
                <CCol md={3}><CFormLabel className="fw-semibold mb-0">Tên mẫu bảng lương <span className="text-danger">*</span></CFormLabel></CCol>
                <CCol md={9}><CFormInput defaultValue="Mẫu bảng lương - Tất cả các vị trí trong đơn vị" /></CCol>
              </CRow>
              <CRow className="mb-4 align-items-center">
                <CCol md={3}><CFormLabel className="fw-semibold mb-0">Trạng thái</CFormLabel></CCol>
                <CCol md={9} className="d-flex gap-4">
                     <CFormCheck type="radio" name="status" label="Đang áp dụng" defaultChecked className="text-success fw-semibold"/>
                     <CFormCheck type="radio" name="status" label="Ngừng áp dụng" />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>

        {/* 3. BẢNG THÀNH PHẦN LƯƠNG */}
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold fs-5">THÀNH PHẦN LƯƠNG</span>
                    <CFormSwitch label="Xem trước" id="previewSwitch" />
                </div>
                <div className="d-flex gap-2">
                    {/* NÚT THÊM THÀNH PHẦN -> MỞ MODAL */}
                    <CButton 
                        color="success" 
                        className="text-white d-flex align-items-center text-nowrap"
                        onClick={handleOpenAddModal}
                    >
                        <CIcon icon={cilPlus} className="me-2" /> Thêm thành phần
                    </CButton>
                </div>
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
                  <CTableHeaderCell className="text-center">Hiển thị</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {view.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell className="fw-semibold">{item.name}</CTableDataCell>
                    <CTableDataCell><code className="text-primary bg-light px-2 py-1 rounded">{item.code}</code></CTableDataCell>
                    <CTableDataCell>{item.display}</CTableDataCell>
                    <CTableDataCell><FormulaDisplay formula={item.formula} /></CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CFormCheck defaultChecked={item.visible} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
          {/* Footer phân trang chính (giữ nguyên logic cũ) */}
          {/* ... */}
        </CCard>
      </div>

      {/* --- [MỚI] MODAL CHỌN THÀNH PHẦN (Giống ảnh image_2ee823.jpg) --- */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="xl" alignment="center">
        <CModalHeader>
          <CModalTitle className="fw-bold">Chọn thành phần</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-0">
            {/* Toolbar trong modal */}
            <div className="p-3 d-flex justify-content-between align-items-center border-bottom bg-light">
                 <div className="d-flex gap-3 align-items-center" style={{ width: '60%' }}>
                     <CInputGroup>
                        <CInputGroupText className="bg-white"><CIcon icon={cilSearch} /></CInputGroupText>
                        <CFormInput placeholder="Tìm kiếm" value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} />
                     </CInputGroup>
                     <CFormSelect style={{ width: '200px' }} className="d-none d-md-block">
                        <option>Tất cả thành phần</option>
                        <option>Lương</option>
                        <option>Chấm công</option>
                     </CFormSelect>
                 </div>
                 <CButton variant="outline" color="success" className="d-flex align-items-center">
                    <CIcon icon={cilPlus} className="me-1" /> Thêm mới thành phần lương
                 </CButton>
            </div>

            {/* Bảng dữ liệu trong modal */}
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <CTable hover responsive align="middle" className="mb-0">
                    <CTableHead color="light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <CTableRow>
                            <CTableHeaderCell className="w-1">
                                <CFormCheck onChange={toggleSelectAll} checked={selectedIds.length === AVAILABLE_COMPONENTS.length && AVAILABLE_COMPONENTS.length > 0} />
                            </CTableHeaderCell>
                            <CTableHeaderCell>Mã thành phần</CTableHeaderCell>
                            <CTableHeaderCell>Tên thành phần</CTableHeaderCell>
                            <CTableHeaderCell>Loại thành phần</CTableHeaderCell>
                            <CTableHeaderCell>Tính chất</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {AVAILABLE_COMPONENTS
                            .filter(item => item.name.toLowerCase().includes(modalSearch.toLowerCase()) || item.code.toLowerCase().includes(modalSearch.toLowerCase()))
                            .map(item => (
                            <CTableRow key={item.id} onClick={() => toggleSelectComponent(item.id)} style={{ cursor: 'pointer' }}>
                                <CTableDataCell onClick={(e) => e.stopPropagation()}>
                                    <CFormCheck checked={selectedIds.includes(item.id)} onChange={() => toggleSelectComponent(item.id)} />
                                </CTableDataCell>
                                <CTableDataCell>{item.code}</CTableDataCell>
                                <CTableDataCell className="fw-semibold">{item.name}</CTableDataCell>
                                <CTableDataCell>{item.type}</CTableDataCell>
                                <CTableDataCell>{item.nature}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>
        </CModalBody>
        <CModalFooter className="justify-content-between bg-light">
            <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Tổng số bản ghi: <strong>{AVAILABLE_COMPONENTS.length}</strong></span>
            </div>
            <div className="d-flex gap-2">
                <CButton color="white" className="border" onClick={() => setShowAddModal(false)}>Hủy bỏ</CButton>
                <CButton color="success" className="text-white" disabled={selectedIds.length === 0} onClick={handleApplySelection}>
                    Áp dụng {selectedIds.length > 0 && `(${selectedIds.length})`}
                </CButton>
            </div>
        </CModalFooter>
      </CModal>

      {/* MODAL XÁC NHẬN LƯU (Cũ) */}
      <CModal visible={showSaveConfirm} onClose={() => setShowSaveConfirm(false)} alignment="center">
        <CModalHeader><CModalTitle>Xác nhận lưu</CModalTitle></CModalHeader>
        <CModalBody className="text-center py-4">
            <CIcon icon={cilWarning} size="4xl" className="text-warning mb-3"/>
            <p className="fs-5">Bạn có chắc chắn muốn lưu mẫu bảng lương này không?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowSaveConfirm(false)}>Hủy bỏ</CButton>
          <CButton color="success" className="text-white" onClick={confirmSave}>Đồng ý</CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default TemplateFormPage