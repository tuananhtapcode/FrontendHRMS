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
// 1. CSS TÙY CHỈNH (Giống y hệt thiết kế)
// =====================================================================
const AddLeaveRequestStyles = () => (
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

    /* --- Form Styles --- */
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

    /* Lý do nhanh (Quick reasons) */
    .quick-reasons {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }
    .reason-tag {
      font-size: 0.8rem;
      padding: 2px 10px;
      border: 1px solid #f9b115;
      color: #f9b115; /* Chữ màu cam */
      border-radius: 12px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }
    .reason-tag:hover {
      background: #fff4d9;
    }

    /* --- Section Title --- */
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
      color: #e55353; /* Chữ màu đỏ cam */
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
        <h1 className="page-title">Thêm mới đơn xin nghỉ</h1>
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
const LeaveRequestAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    applicant: '1', // ID người nộp
    applyDate: '20/11/2025',
    applyTime: '12:00',
    fromDate: '20/11/2025',
    fromTime: '12:00',
    toDate: '20/11/2025',
    toTime: '17:00',
    reason: '',
    timezone: 'utc7',
    approver: '',
    substitute: '',
    relatedPerson: '',
    leaveType: 'nghiphep',
    leaveDays: 0,
    status: 'pending',
  })

  const handleBack = () => {
    navigate(-1)
  }

  const handleSave = () => {
    console.log('Save:', formData)
    alert('Đã lưu đơn xin nghỉ!')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addReason = (text) => {
    setFormData((prev) => ({ ...prev, reason: text }))
  }

  return (
    <>
      <AddLeaveRequestStyles />
      
      <div className="page-container">
        <AddHeader onBack={handleBack} onSave={handleSave} />

        <div style={{ padding: '0 1rem 2rem 1rem' }}>
          {/* --- Card 1: Form Nhập Liệu --- */}
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody style={{ padding: '2rem' }}>
              <CForm>
                {/* Hàng 1 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Người nộp đơn<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect 
                      name="applicant" 
                      value={formData.applicant} 
                      onChange={handleChange}
                    >
                      <option value="1">Nguyễn Văn A (NV001)</option>
                      <option value="2">Trần Thị B (NV002)</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Số NP được sử dụng</CFormLabel>
                    <CFormInput type="text" value="0" readOnly className="form-control-readonly" />
                  </CCol>
                </CRow>

                {/* Hàng 2 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Đơn vị công tác</CFormLabel>
                    <CFormInput type="text" value="" readOnly className="form-control-readonly" />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Số NP đã nghỉ</CFormLabel>
                    <CFormInput type="text" value="0" readOnly className="form-control-readonly" />
                  </CCol>
                </CRow>

                {/* Hàng 3 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Ngày nộp đơn<span className="required-mark">*</span>
                    </CFormLabel>
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
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Số NP còn lại</CFormLabel>
                    <CFormInput type="text" value="0" readOnly className="form-control-readonly" />
                  </CCol>
                </CRow>

                {/* Hàng 4 (Từ ngày & Lý do) */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel className="form-label-custom">
                        Từ ngày<span className="required-mark">*</span>
                      </CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" name="fromDate" value={formData.fromDate} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" name="fromTime" value={formData.fromTime} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>
                    <div>
                      <CFormLabel className="form-label-custom">
                        Đến ngày<span className="required-mark">*</span>
                      </CFormLabel>
                      <CRow>
                        <CCol xs={8}>
                          <CInputGroup>
                            <CFormInput type="text" name="toDate" value={formData.toDate} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        <CCol xs={4}>
                          <CInputGroup>
                            <CFormInput type="text" name="toTime" value={formData.toTime} onChange={handleChange} />
                            <CInputGroupText><CIcon icon={cilClock} /></CInputGroupText>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>
                  
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Lý do nghỉ<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormTextarea
                      rows={4}
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                    ></CFormTextarea>
                    {/* Quick Reason Tags */}
                    <div className="quick-reasons">
                      <span className="reason-tag" onClick={() => addReason('Em xin nghỉ do có việc cá nhân')}>
                        Em xin nghỉ do có việc cá nhân
                      </span>
                      <span className="reason-tag" onClick={() => addReason('Em xin nghỉ ốm')}>
                        Em xin nghỉ ốm
                      </span>
                      <span className="reason-tag" onClick={() => addReason('...')}>
                        ...
                      </span>
                    </div>
                  </CCol>
                </CRow>

                {/* Hàng 5 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Múi giờ</CFormLabel>
                    <CFormSelect name="timezone" value={formData.timezone} onChange={handleChange}>
                      <option value="utc7">(UTC +07:00) Asia/Ho_Chi_Minh</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Người duyệt<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect name="approver" value={formData.approver} onChange={handleChange}>
                      <option value="">Chọn người duyệt</option>
                      <option value="manager1">Trưởng phòng A</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                {/* Hàng 6 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Số ngày nghỉ</CFormLabel>
                    <CFormInput 
                      type="number" 
                      name="leaveDays" 
                      value={formData.leaveDays} 
                      onChange={handleChange} 
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Người thay thế</CFormLabel>
                    <CFormSelect name="substitute" value={formData.substitute} onChange={handleChange}>
                      <option value="">Chọn người thay thế</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                {/* Hàng 7 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Loại nghỉ<span className="required-mark">*</span>
                    </CFormLabel>
                    <CInputGroup>
                      <CFormSelect name="leaveType" value={formData.leaveType} onChange={handleChange}>
                        <option value="nghiphep">Nghỉ phép</option>
                        <option value="nghikhongluong">Nghỉ không lương</option>
                      </CFormSelect>
                      {/* Nút dấu cộng (giả lập nút thêm loại nghỉ) */}
                      <CInputGroupText style={{ cursor: 'pointer', color: '#f9b115', fontWeight: 'bold' }}>+</CInputGroupText>
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Người liên quan</CFormLabel>
                    <CFormSelect name="relatedPerson" value={formData.relatedPerson} onChange={handleChange}>
                      <option value="">Chọn người liên quan</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                {/* Hàng 8 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Tỷ lệ hưởng lương (%)</CFormLabel>
                    <CFormInput type="number" value="100" readOnly className="form-control-readonly" />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Trạng thái<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect name="status" value={formData.status} onChange={handleChange}>
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                    </CFormSelect>
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
              {/* Khu vực nội dung ghi chú sẽ hiển thị ở đây */}
            </CCardBody>
          </CCard>

        </div>
      </div>
    </>
  )
}

export default LeaveRequestAdd