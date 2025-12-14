import { CCol, CForm, CFormInput, CFormSelect } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { MyDatePicker } from './MyDatePicker'

const GeneralInfoForm = ({ formData, handleChange }) => {
  return (
    <>
      <h5 className="fw-bold">THÔNG TIN CHUNG</h5>
      <div className="row g-3">
        <CCol md={12}>
          <CFormInput
            id="inputEmployeeId"
            label="Mã nhân viên"
            placeholder="Nhập mã nhân viên"
            value={formData.employeeCode}
            onChange={(e) => handleChange('employeeCode', e.target.value)}
            required
          />
        </CCol>

        <CCol md={6}>
          <CFormInput
            id="inputLastName"
            label={
              <>
                Họ và đệm <span style={{ color: 'red' }}>*</span>
              </>
            }
            placeholder="Nhập họ và đệm"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </CCol>

        <CCol md={6}>
          <CFormInput
            id="inputFirstName"
            label={
              <>
                Tên <span style={{ color: 'red' }}>*</span>
              </>
            }
            placeholder="Nhập tên"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
        </CCol>

        <CCol md={12}>
          <CFormInput value={formData.fullName} id="inputFullName" label="Họ và tên" disabled />
        </CCol>

        <CCol md={12}>
          <CFormInput
            id="inputPhoneNumber"
            label="Điện thoại di động"
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
        </CCol>

        <CCol md={12}>
          <CFormInput
            id="inputPersonalEmail"
            label="Email cá nhân"
            placeholder="Nhập email"
            value={formData.personalEmail}
            onChange={(e) => handleChange('personalEmail', e.target.value)}
            required
            type="email"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            feedbackInvalid="Email không hợp lệ"
          />
        </CCol>
      </div>
    </>
  )
}

export default GeneralInfoForm
