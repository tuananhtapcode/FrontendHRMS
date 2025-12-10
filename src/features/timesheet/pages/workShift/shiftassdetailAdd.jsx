
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
  CRow
} from '@coreui/react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports cho Icons
import { cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 1. HÀM TIỆN ÍCH
// =====================================================================
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// =====================================================================
// 2. CSS TÙY CHỈNH (ĐÃ FIX LỖI 2 ICON)
// =====================================================================
const AddShiftAssignmentStyles = () => (
  <style>
    {`
    .page-container { padding: 1rem; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 500; margin: 0; }
    .header-actions { display: flex; gap: 12px; }

    .form-section-header { font-size: 1.1rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--cui-border-color-translucent, #eee); padding-bottom: 0.5rem; }
    
    .repeat-section { background-color: var(--cui-light, #f8f9fa); border: 1px solid var(--cui-border-color-translucent, #eee); border-radius: var(--cui-border-radius, 0.375rem); padding: 1.5rem; margin-top: 1rem; }
    .day-checkboxes { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; margin-top: 1rem; }
    
    .form-link { color: var(--cui-primary, #321fdb); cursor: pointer; font-weight: 500; text-decoration: none; margin-top: 1rem; display: inline-block; }
    .form-link:hover { text-decoration: underline; }

    .radio-group-description { font-size: 0.875rem; color: var(--cui-secondary-color, #8a93a2); margin-left: 1.75rem; }
    .cursor-pointer { cursor: pointer; }

    /* --- FIX LỖI 2 QUYỂN LỊCH --- */
    /* Ẩn icon lịch mặc định của trình duyệt Chrome/Edge/Safari */
    input[type="date"]::-webkit-calendar-picker-indicator {
        background: transparent;
        bottom: 0;
        color: transparent;
        cursor: pointer;
        height: auto;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: auto;
        /* Mẹo: Làm cho icon native trong suốt và phủ lên toàn bộ ô input 
           để click vào đâu cũng hiện lịch, nhưng không thấy icon xấu */
        opacity: 0; 
        z-index: 1;
    }
    
    /* Đảm bảo text vẫn nhập được nếu muốn */
    .date-input-custom {
        position: relative;
        z-index: 2; /* Text nằm trên lớp phủ icon */
    }
    `}
  </style>
)

// =====================================================================
// 3. COMPONENT FORM (MAIN)
// =====================================================================
const ShiftAssignmentAdd = () => {
  const navigate = useNavigate()
  
  // Refs để kích hoạt click vào input date khi click icon
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)

  const [formData, setFormData] = useState({
    tableName: '',
    unit: '',
    shift: '',
    startDate: getTodayString(), 
    endDate: getTodayString(),
    repeatType: 'week',
    repeatCycle: 1,
    repeatOn: {
      thu2: false, thu3: false, thu4: false, thu5: false, thu6: false, thu7: false, cn: false,
    },
    applyTo: 'unit',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDayCheckChange = (e) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, repeatOn: { ...prev.repeatOn, [name]: checked } }))
  }

  const handleRadioChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleCancel = () => navigate(-1)

  const handleSave = () => {
    console.log('Dữ liệu Form:', formData)
    alert('Đã lưu thành công!')
  }

  // Hàm mở lịch trình duyệt
  const openDatePicker = (ref) => {
    try {
      if (ref.current) ref.current.showPicker();
    } catch (error) {
      console.warn("Trình duyệt không hỗ trợ showPicker(), vui lòng click trực tiếp vào ô input");
    }
  }

  return (
    <>
      <AddShiftAssignmentStyles />

      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Thêm phân ca chi tiết</h2>
          <div className="header-actions">
            <CButton color="secondary" variant="outline" onClick={handleCancel}>Hủy</CButton>
            <CButton className="btn-orange" onClick={handleSave}>Lưu</CButton>
          </div>
        </div>

        <CCard>
          <CCardBody style={{ padding: '2rem' }}>
            <CForm>
              {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
              <h3 className="form-section-header">Thông tin chung</h3>
              <CRow className="mb-3">
                <CFormLabel htmlFor="tableName" className="col-sm-2 col-form-label">Tên bảng phân ca <span className="text-danger">*</span></CFormLabel>
                <CCol sm={10}><CFormInput type="text" id="tableName" name="tableName" value={formData.tableName} onChange={handleInputChange} /></CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="unit" className="col-sm-2 col-form-label">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel>
                <CCol sm={10}><CFormInput type="text" id="unit" name="unit" value={formData.unit} onChange={handleInputChange} /></CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="shift" className="col-sm-2 col-form-label">Ca làm việc <span className="text-danger">*</span></CFormLabel>
                <CCol sm={10}>
                  <CFormSelect id="shift" name="shift" value={formData.shift} onChange={handleInputChange}>
                    <option value="">Chọn ca làm việc...</option><option value="HC">Ca hành chính (HC)</option><option value="C1">Ca 1 (Sáng)</option><option value="C2">Ca 2 (Chiều)</option><option value="C3">Ca 3 (Đêm)</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* --- PHẦN 2: THỜI GIAN ÁP DỤNG --- */}
              <h3 className="form-section-header">Thời gian áp dụng</h3>
              <CRow className="mb-3 align-items-center">
                <CFormLabel htmlFor="startDate" className="col-sm-2 col-form-label">Ngày bắt đầu <span className="text-danger">*</span></CFormLabel>
                <CCol sm={4}>
                  <CInputGroup>
                    <CFormInput 
                        type="date" 
                        id="startDate" 
                        name="startDate" 
                        ref={startDateRef} 
                        value={formData.startDate} 
                        onChange={handleInputChange} 
                        className="date-input-custom" // Class để fix style
                    />
                    <CInputGroupText className="cursor-pointer" onClick={() => openDatePicker(startDateRef)}>
                        <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CFormLabel htmlFor="endDate" className="col-sm-2 col-form-label text-sm-end">Ngày kết thúc</CFormLabel>
                <CCol sm={4}>
                  <CInputGroup>
                    <CFormInput 
                        type="date" 
                        id="endDate" 
                        name="endDate" 
                        ref={endDateRef} 
                        value={formData.endDate} 
                        onChange={handleInputChange} 
                        className="date-input-custom"
                    />
                    <CInputGroupText className="cursor-pointer" onClick={() => openDatePicker(endDateRef)}>
                        <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
              </CRow>

              {/* --- PHẦN LẶP LẠI --- */}
              <CRow>
                <CFormLabel className="col-sm-2 col-form-label">Lặp theo</CFormLabel>
                <CCol sm={10}>
                  <div className="repeat-section">
                    <CRow>
                      <CCol md={6}>
                        <CFormSelect name="repeatType" value={formData.repeatType} onChange={handleInputChange}>
                          <option value="week">Tuần</option><option value="month">Tháng</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CInputGroup>
                          <CFormLabel className="col-form-label me-2">Chu kì lặp</CFormLabel>
                          <CFormInput type="number" name="repeatCycle" value={formData.repeatCycle} onChange={handleInputChange} style={{ maxWidth: '80px' }} />
                          <CInputGroupText>Tuần</CInputGroupText>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <div className="day-checkboxes">
                      <CFormCheck id="thu2" name="thu2" label="Thứ 2" onChange={handleDayCheckChange} />
                      <CFormCheck id="thu3" name="thu3" label="Thứ 3" onChange={handleDayCheckChange} />
                      <CFormCheck id="thu4" name="thu4" label="Thứ 4" onChange={handleDayCheckChange} />
                      <CFormCheck id="thu5" name="thu5" label="Thứ 5" onChange={handleDayCheckChange} />
                      <CFormCheck id="thu6" name="thu6" label="Thứ 6" onChange={handleDayCheckChange} />
                      <CFormCheck id="thu7" name="thu7" label="Thứ 7" onChange={handleDayCheckChange} />
                      <CFormCheck id="cn" name="cn" label="Chủ nhật" onChange={handleDayCheckChange} />
                    </div>
                  </div>
                  <a href="#" className="form-link" onClick={(e) => e.preventDefault()}>Xem trước phân ca</a>
                </CCol>
              </CRow>

              {/* --- PHẦN 3: ĐỐI TƯỢNG ÁP DỤNG --- */}
              <h3 className="form-section-header">Đối tượng áp dụng</h3>
              <CRow>
                <CCol sm={{ span: 10, offset: 2 }}>
                  <CFormCheck type="radio" name="applyTo" id="applyToUnit" label="Toàn đơn vị" value="unit" checked={formData.applyTo === 'unit'} onChange={handleRadioChange} />
                  <CFormCheck type="radio" name="applyTo" id="applyToEmployee" label="Danh sách nhân viên" value="employee" checked={formData.applyTo === 'employee'} onChange={handleRadioChange} />
                  <CFormCheck type="radio" name="applyTo" id="applyToDepartment" label="Danh sách phòng ban" value="department" checked={formData.applyTo === 'department'} onChange={handleRadioChange} />
                  <p className="radio-group-description">Các nhân viên khi tiếp nhận hoặc điều chuyển đến đơn vị đã chọn sẽ tự động được phân ca theo thiết lập này.</p>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </div>
    </>
  )
}

export default ShiftAssignmentAdd