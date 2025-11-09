import { CCol, CForm, CFormInput, CFormSelect } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { MyDatePicker } from './MyDatePicker'

const GeneralInfoForm = ({ formData, handleChange }) => {
  return (
    <>
      <h5 className="fw-bold">THÔNG TIN CHUNG</h5>
      <div className="row g-3">
        {/* {formData.isEmployee && (
          <CCol md={12}>
            <CFormInput
              id="inputEmployeeId"
              label={
                <>
                  Mã nhân viên <span style={{ color: 'red' }}>*</span>
                </>
              }
              placeholder="Mã nhân viên"
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', e.target.value)}
            />
          </CCol>
        )} */}

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

        <CCol xs={12}>
          <MyDatePicker
            id="inputDateOfBirth"
            label="Ngày sinh"
            selected={formData.dateOfBirth}
            onChange={(date) => handleChange('dateOfBirth', date)}
          />
        </CCol>

        <CCol md={12}>
          <CFormSelect
            id="inputGender"
            label="Giới tính"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option>Nam</option>
            <option>Nữ</option>
          </CFormSelect>
        </CCol>

        <CCol xs={12}>
          <CFormInput
            id="inputAddress"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </CCol>

        <CCol md={12}>
          <CFormInput
            id="inputPhoneNumber"
            label="Điên thoại di động"
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
