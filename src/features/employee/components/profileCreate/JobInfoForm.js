import { CCol, CForm, CFormInput, CFormSelect } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { MyDatePicker } from './MyDatePicker'

const JobInfoForm = ({ formData, handleChange }) => {
  return (
    <>
      <h5 className="fw-bold">THÔNG TIN CÔNG VIỆC</h5>
      <div className="row g-3">
        <CCol md={12}>
          <CFormInput
            id="inputJobPosition"
            label="Vị trí công việc"
            placeholder="Chọn hoặc nhập vị trí công việc"
            value={formData.jobPosition}
            onChange={(e) => handleChange('jobPosition', e.target.value)}
          />
        </CCol>
        <CCol md={12}>
          <CFormInput id="input" label="Chức danh" disabled />
        </CCol>
        <CCol xs={12}>
          <CFormInput id="input" label="Quản lý trực tiếp" placeholder="Quản lý trực tiếp" />
        </CCol>
        <CCol xs={12}>
          <CFormSelect
            id="inputStatus"
            label={
              <>
                Trạng thái lao động <span style={{ color: 'red' }}>*</span>
              </>
            }
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option>Đang làm việc</option>
            <option>Đã nghỉ việc</option>
          </CFormSelect>
        </CCol>
        <CCol xs={12}>
          <MyDatePicker
            id="inputDateOfBirth"
            label="Ngày sinh"
            selected={formData.probationaryDate}
            onChange={(date) => handleChange('probationaryDate', date)}
          />
        </CCol>
        <CCol xs={12}>
          <MyDatePicker
            id="inputDateOfBirth"
            label="Ngày sinh"
            selected={formData.officialDate}
            onChange={(date) => handleChange('officialDate', date)}
          />
        </CCol>
        <CCol md={12}>
          <CFormInput
            id="inputCompanyPhoneNumer"
            label="Điện thoại cơ quan"
            placeholder="Nhập số điện thoại cơ quan"
            value={formData.companyPhone}
            onChange={(e) => handleChange('companyPhone', e.target.value)}
          />
        </CCol>
        <CCol md={12}>
          <CFormInput
            id="inputCompanyEmail"
            label="Email công ty"
            placeholder="Email công ty"
            value={formData.companyEmail}
            onChange={(e) => handleChange('companyEmail', e.target.value)}
          />
        </CCol>
      </div>
    </>
  )
}

export default JobInfoForm
