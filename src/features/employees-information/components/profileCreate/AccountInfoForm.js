import { CCol, CFormCheck, CFormInput } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'

const AccountInfoForm = ({ formData, handleChange }) => {
  return (
    <>
      <h5 className="fw-bold">THÔNG TIN TÀI KHOẢN</h5>
      <CCol md={12}>
        <CFormInput
          id="inputAccountEmail"
          label="Email tài khoản"
          placeholder="Nhập email"
          value={formData.accountEmail}
          onChange={(e) => handleChange('accountEmail', e.target.value)}
          type="email"
          required
        />
      </CCol>
      <CCol xs={12}>
        <CFormCheck
          type="checkbox"
          id="gridCheck"
          label="Gửi email kích hoạt"
          checked={formData.sendActivation}
          onChange={(e) => handleChange('sendActivation', !e.target.value)}
        />
      </CCol>
    </>
  )
}

export default AccountInfoForm
