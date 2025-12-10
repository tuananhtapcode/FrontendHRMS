import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
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
// 1. CSS TÙY CHỈNH (Giống y hệt thiết kế)
// =====================================================================
const AddOvertimeRequestStyles = () => (
  <style>
    {`
    .page-container {
      padding: 1rem;
      background-color: #f3f4f7; /* Màu nền xám nhạt của app */
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
      margin: -1rem -1rem 1rem -1rem; /* Tràn viền */
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
      background-color: #ebedef; /* Màu xám cho ô readonly */
      cursor: not-allowed;
    }

    /* --- Title for Section --- */
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #3c4b64;
    }

    /* --- Upload Zone --- */
    .upload-zone {
      border: 2px dashed #f9b115; /* Viền đứt màu cam */
      border-radius: 6px;
      padding: 2rem;
      text-align: center;
      background-color: #fff;
      color: #f9b115; /* Chữ màu cam */
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
      padding-right: 30px; /* Chỗ cho icon kẹp giấy */
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
      color: #f9b115; /* Màu cam */
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
    
    /* Fix cho nút Sửa/Thêm loại nghỉ */
    .btn-icon-addon {
        background-color: #ebedef;
        border-color: #ebedef;
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
        <h1 className="page-title">Thêm mới đăng ký làm thêm</h1>
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
const OvertimeRequestAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    applicant: '1', 
    unit: '', 
    applyDate: '20/11/2025',
    applyTime: '20:47',
    overtimeFrom: '20/11/2025',
    overtimeFromTime: '00:00',
    overtimeTo: 'DD/MM/YYYY',
    overtimeToTime: 'HH:mm',
    overtimeStart: '20/11/2025',
    overtimeStartTime: '00:00',
    timezone: 'utc7',
    overtimeHours: 0,
    timePoint: 'diemlamthem',
    reason: 'viết lý do vào đây',
    approver: '',
    relatedPerson: '',
    status: 'pending',
  })

  const handleSave = () => {
    console.log('Save:', formData)
    alert('Đã lưu đơn đăng ký làm thêm!')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
      <AddOvertimeRequestStyles />
      
      <div className="page-container">
        <AddHeader onBack={handleBack} onSave={handleSave} />

        <div style={{ padding: '0 1rem 2rem 1rem' }}>
          {/* --- Card 1: Form Nhập Liệu --- */}
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody className="form-card">
              <CForm>
                <CFormCheck 
                  type="checkbox" 
                  id="createMultiple" 
                  label="Tạo đơn nhiều ngày" 
                  className="mb-4"
                  // Bỏ checked để mặc định là đơn lẻ
                />
                <CRow>
                  {/* === CỘT TRÁI === */}
                  <CCol md={6}>
                    {/* Người nộp đơn */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Người nộp đơn<span className="required-mark">*</span></CFormLabel>
                      <CFormSelect name="applicant" value={formData.applicant} onChange={handleChange}>
                        <option value="1">Nguyễn Văn A (NV001)</option>
                      </CFormSelect>
                    </div>
                    {/* Đơn vị công tác (ReadOnly) */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Đơn vị công tác</CFormLabel>
                      <CFormInput type="text" value="HRM/Khối Văn Phòng" readOnly className="form-control-readonly" />
                    </div>
                    {/* Ngày nộp đơn (ReadOnly) */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ngày nộp đơn<span className="required-mark">*</span></CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" value={formData.applyDate} readOnly />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" value={formData.applyTime} readOnly />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>

                    {/* Làm thêm từ */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Làm thêm từ</CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeFrom" value={formData.overtimeFrom} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeFromTime" value={formData.overtimeFromTime} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>
                    
                    {/* Nghỉ giữa ca từ */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Nghỉ giữa ca từ</CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeTo" value={formData.overtimeTo} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeToTime" value={formData.overtimeToTime} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>
                    
                    {/* Nghỉ giữa ca đến */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Nghỉ giữa ca đến</CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeStart" value={formData.overtimeStart} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeStartTime" value={formData.overtimeStartTime} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>

                    {/* Làm thêm đến */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Làm thêm đến</CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeEnd" value="20/11/2025" onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" name="overtimeEndTime" value="00:00" onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>

                    {/* Múi giờ */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Múi giờ</CFormLabel>
                      <CFormSelect name="timezone" value={formData.timezone} onChange={handleChange}>
                        <option value="utc7">(UTC +07:00) Asia/Ho_Chi_Minh</option>
                      </CFormSelect>
                    </div>
                    
                    {/* Số giờ làm thêm (ReadOnly) */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Số giờ làm thêm</CFormLabel>
                      <CFormInput type="number" value="0" readOnly className="form-control-readonly" />
                    </div>
                  </CCol>

                  {/* === CỘT PHẢI === */}
                  <CCol md={6}>
                    {/* Thời điểm làm thêm */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Thời điểm làm thêm<span className="required-mark">*</span></CFormLabel>
                      <CFormSelect name="timePoint" value={formData.timePoint} onChange={handleChange}>
                        <option value="giobatdau">Giờ bắt đầu</option>
                        <option value="giobatdau">Giờ kết thúc</option>
                      </CFormSelect>
                    </div>
                    
                    {/* Ca áp dụng */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Ca áp dụng<span className="required-mark">*</span></CFormLabel>
                      <CFormSelect name="shift" value={formData.shift} onChange={handleChange}>
                        <option value="">Chọn ca áp dụng</option>
                        <option value="HC">Ca Hành Chính</option>
                      </CFormSelect>
                    </div>
                    
                    {/* Lý do làm thêm */}
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">Lý do làm thêm<span className="required-mark">*</span></CFormLabel>
                      <CFormTextarea
                        rows={3}
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                      ></CFormTextarea>
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
                      </CFormSelect>
                    </div>
                    
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>

          {/* --- Card 2: Tài liệu đính kèm --- */}
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody style={{ padding: '1.5rem' }}>
              <h5 className="section-title">Tài liệu đính kèm</h5>
              <div className="upload-zone">
                <CIcon icon={cilCloudUpload} size="xl" className="upload-icon" />
                Kéo thả hoặc bấm vào đây để tải tệp
              </div>
            </CCardBody>
          </CCard>

          {/* --- Card 3: Ghi chú --- */}
          <CCard className="border-0 shadow-sm">
            <CCardBody style={{ padding: '1.5rem' }}>
              <h5 className="section-title">Ghi chú</h5>
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

export default OvertimeRequestAdd