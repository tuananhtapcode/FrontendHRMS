import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports Icons
import {
  cilArrowLeft,
  cilCalendar,
  cilClock,
  cilCloudUpload,
  cilPaperclip,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 1. CSS TÙY CHỈNH (Tái sử dụng từ trang trước để đồng bộ)
// =====================================================================
const AddShiftSwapStyles = () => (
  <style>
    {`
    .page-container {
      padding: 1rem;
      background-color: #f3f4f7;
      min-height: 100vh;
    }

    /* --- Header --- */
    .page-header {
      background-color: #fff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #d8dbe0;
      margin: -1rem -1rem 1rem -1rem;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .back-btn {
      border: none;
      background: transparent;
      color: #3c4b64;
      padding: 0;
    }
    .page-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
      color: #3c4b64;
    }
    .btn-save {
      background-color: #f9b115; /* Màu cam */
      border-color: #f9b115;
      color: #fff;
      font-weight: 600;
    }
    .btn-save:hover {
      background-color: #e59d0e;
      border-color: #e59d0e;
      color: #fff;
    }

    /* --- Form Card Layout --- */
    .form-card {
        padding: 2rem;
    }
    .form-label-custom {
      font-weight: 600;
      font-size: 0.9rem;
      color: #3c4b64;
      margin-bottom: 4px;
    }
    .required-mark {
      color: #e55353;
      margin-left: 3px;
    }
    .form-control-readonly {
      background-color: #ebedef;
      cursor: not-allowed;
    }

    /* --- Title for Section --- */
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #3c4b64;
      border-bottom: 1px solid #ebedef;
      padding-bottom: 10px;
      margin-top: 20px;
    }

    /* --- Upload Zone --- */
    .upload-zone {
      border: 2px dashed #f9b115;
      border-radius: 6px;
      padding: 2rem;
      text-align: center;
      background-color: #fff;
      color: #f9b115;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .upload-zone:hover {
      background-color: #fffcf5;
    }
    .upload-icon {
      margin-right: 8px;
      vertical-align: text-bottom;
    }

    /* --- Comment Section --- */
    .comment-input-wrapper {
      position: relative;
    }
    .comment-avatar {
      position: absolute;
      left: 0;
      top: 5px;
    }
    .comment-input-container {
      margin-left: 40px;
    }
    .comment-input {
      padding-right: 30px;
    }
    .attach-icon-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #768192;
      cursor: pointer;
    }
    .comment-helper-text {
      text-align: right;
      font-size: 0.75rem;
      color: #768192;
      margin-top: 4px;
    }
    .comment-tabs {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      border-bottom: 1px solid #d8dbe0;
    }
    .comment-tab {
      padding-bottom: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #768192;
      cursor: pointer;
      position: relative;
    }
    .comment-tab.active {
      color: #f9b115;
    }
    .comment-tab.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #f9b115;
    }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT HEADER
// =====================================================================
const AddHeader = ({ onBack, onSave }) => {
  return (
    <div className="page-header">
      <div className="header-left">
        <button className="back-btn" onClick={onBack}>
          <CIcon icon={cilArrowLeft} size="lg" />
        </button>
        <h1 className="page-title">Thêm mới đề nghị đổi ca</h1>
      </div>
      <div className="header-right d-flex gap-2">
        <CButton variant="outline" onClick={onBack}>
          Hủy
        </CButton>
        <CButton className="btn-save" onClick={onSave}>
          Lưu
        </CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT FORM CHÍNH (MAIN)
// =====================================================================
const ShiftSwapRequestAdd = () => {
  const navigate = useNavigate()
  
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    applicant: 'nv001', // Giả định user hiện tại
    unit: 'Phòng Kế Toán',
    applyDate: '20/11/2025', // Giả định ngày hiện tại
    swapType: 'trongngay', // Mặc định chọn loại này như trong ảnh
    
    // Dữ liệu cho loại "Đổi ca trong ngày"
    swapDate: '20/11/2025',
    currentShift: '',
    desiredShift: '',

    reason: '',
    approver: '',
    relatedPerson: '',
    status: 'pending',
  })

  const handleSave = () => {
    console.log('Saving Swap Request:', formData)
    alert('Đã lưu đơn đăng ký đổi ca!')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBack = () => {
    navigate(-1)
  }
  
  const addReason = (text) => {
    setFormData((prev) => ({ ...prev, reason: text }))
  }

  return (
    <>
      <AddShiftSwapStyles />
      
      <div className="page-container">
        <AddHeader onBack={handleBack} onSave={handleSave} />

        <div style={{ padding: '0 1rem 2rem 1rem' }}>
          {/* --- Card 1: Form Nhập Liệu Chính --- */}
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody className="form-card">
              <CForm>
                {/* Sử dụng một cột duy nhất cho form này theo thiết kế */}
                <CRow>
                  {/* === CỘT TRÁI === */}
                  <CCol md={6}>
                    {/* Người đề nghị */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Người đề nghị<span className="required-mark">*</span></CFormLabel>
                      <CFormSelect name="applicant" value={formData.applicant} onChange={handleChange}>
                        <option value="nv001">Nguyễn Văn A (NV001)</option>
                        <option value="nv002">Trần Thị B (NV002)</option>
                      </CFormSelect>
                    </div>

                    {/* Đơn vị công tác (ReadOnly) */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Đơn vị công tác</CFormLabel>
                      <CFormInput type="text" value={formData.unit} readOnly className="form-control-readonly" />
                    </div>

                    {/* Ngày đề nghị (ReadOnly) */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ngày đề nghị<span className="required-mark">*</span></CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" value={formData.applyDate} readOnly />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" value="21:10" readOnly />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>

                    {/* Ngày làm việc */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ngày làm việc<span className="required-mark">*</span></CFormLabel>
                      <CInputGroup>
                        <CFormInput type="text" name="workDate" value="20/11/2025" onChange={handleChange} />
                        <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                      </CInputGroup>
                    </div>
                    
                    {/* Múi giờ (ReadOnly) */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Múi giờ</CFormLabel>
                      <CFormInput type="text" value="(UTC +07:00) Asia/Ho_Chi_Minh" readOnly className="form-control-readonly" />
                    </div>
                    
                    {/* Ca hiện tại */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ca hiện tại</CFormLabel>
                      <CFormSelect name="currentShift" value={formData.currentShift} onChange={handleChange}>
                        <option value="">Chọn ca hiện tại</option>
                        <option value="HC">Ca Hành Chính</option>
                      </CFormSelect>
                    </div>

                    {/* Ngày đăng ký đổi */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ngày đăng ký đổi<span className="required-mark">*</span></CFormLabel>
                      <CInputGroup>
                        <CFormInput type="text" name="swapDate" value={formData.swapDate} onChange={handleChange} />
                        <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                      </CInputGroup>
                    </div>
                    
                    {/* Ca đăng ký đổi */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ca đăng ký đổi</CFormLabel>
                      <CFormSelect name="swapShift" value={formData.swapShift} onChange={handleChange}>
                        <option value="">Chọn ca đăng ký đổi</option>
                        <option value="C3">Ca 3 (Đêm)</option>
                      </CFormSelect>
                    </div>

                  </CCol>

                  {/* === CỘT PHẢI === */}
                  <CCol md={6}>
                    {/* Đổi ca với */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Đổi ca với</CFormLabel>
                      <CFormSelect name="swapWith" value={formData.swapWith} onChange={handleChange}>
                        <option value="">Chọn người đổi ca</option>
                        <option value="NV002">Trần Thị B (NV002)</option>
                      </CFormSelect>
                    </div>
                    
                    {/* Lý do đổi ca */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Lý do đổi ca<span className="required-mark">*</span></CFormLabel>
                      <CFormTextarea
                        rows={3}
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                      ></CFormTextarea>
                      {/* Quick Reason Tags */}
                      <div className="quick-reasons" style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="reason-tag" 
                              style={{ fontSize: '0.8rem', padding: '2px 10px', border: '1px solid #f9b115', color: '#f9b115', borderRadius: '12px', background: '#fff', cursor: 'pointer' }}
                              onClick={() => addReason('Em xin đổi ca do trùng lịch quan trọng')}>
                          Em xin đổi ca do trùng lịch quan trọng
                        </span>
                        <span className="reason-tag"
                              style={{ fontSize: '0.8rem', padding: '2px 10px', border: '1px solid #f9b115', color: '#f9b115', borderRadius: '12px', background: '#fff', cursor: 'pointer' }} 
                              onClick={() => addReason('...')}>
                          ...
                        </span>
                      </div>
                    </div>

                    {/* Người duyệt */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Người duyệt<span className="required-mark">*</span></CFormLabel>
                      <CFormSelect name="approver" value={formData.approver} onChange={handleChange}>
                        <option value="">Chọn người duyệt</option>
                        <option value="manager1">Trưởng phòng A</option>
                      </CFormSelect>
                    </div>

                    {/* Người liên quan */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Người liên quan</CFormLabel>
                      <CFormSelect name="relatedPerson" value={formData.relatedPerson} onChange={handleChange}>
                        <option value="">Chọn người liên quan</option>
                      </CFormSelect>
                    </div>
                    
                    {/* Trạng thái */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Trạng thái<span className="required-mark">*</span></CFormLabel>
                      <CFormSelect name="status" value={formData.status} onChange={handleChange}>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </CFormSelect>
                    </div>
                    
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>

          {/* --- Card 2: Tài liệu đính kèm (Giữ nguyên) --- */}
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody style={{ padding: '1.5rem' }}>
              <h5 className="section-title mt-0" style={{borderBottom: 'none'}}>Tài liệu đính kèm</h5>
              <div className="upload-zone">
                <CIcon icon={cilCloudUpload} size="xl" className="upload-icon" />
                Kéo thả hoặc bấm vào đây để tải tệp
              </div>
            </CCardBody>
          </CCard>

          {/* --- Card 3: Ghi chú (Giữ nguyên) --- */}
          <CCard className="border-0 shadow-sm">
            <CCardBody style={{ padding: '1.5rem' }}>
              <h5 className="section-title mt-0" style={{borderBottom: 'none'}}>Ghi chú</h5>
              <div className="comment-input-wrapper">
                <div className="comment-avatar">
                  <CAvatar color="secondary" size="md" textColor="white">
                    <CIcon icon={cilUser} />
                  </CAvatar>
                </div>
                <div className="comment-input-container">
                  <div style={{ position: 'relative' }}>
                    <CFormInput 
                      className="comment-input" 
                      placeholder="Nhập ghi chú" 
                    />
                    <div className="attach-icon-btn">
                      <CIcon icon={cilPaperclip} />
                    </div>
                  </div>
                  <div className="comment-helper-text">
                    Nhấn Esc để <span style={{ color: '#e55353', fontWeight: 'bold' }}>Hủy</span>
                  </div>
                </div>
              </div>

              <div className="comment-tabs">
                <div className="comment-tab active">Tất cả</div>
                <div className="comment-tab">Ghi chú</div>
                <div className="comment-tab">Nhật ký hoạt động</div>
              </div>
            </CCardBody>
          </CCard>

        </div>
      </div>
    </>
  )
}

export default ShiftSwapRequestAdd