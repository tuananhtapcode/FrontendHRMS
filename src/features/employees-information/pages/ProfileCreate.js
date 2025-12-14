import { CButton, CCol, CContainer, CForm, CFormCheck, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { useEffect, useRef, useState } from 'react'
import UploadAvatar from '../components/profileCreate/UploadAvatar'
import 'react-datepicker/dist/react-datepicker.css'
import GeneralInfoForm from '../components/profileCreate/generalInfoForm'
import AccountInfoForm from '../components/profileCreate/AccountInfoForm'
import JobInfoForm from '../components/profileCreate/jobInfoForm'
import { useNavigate } from 'react-router-dom'

const ProfileCreate = () => {
  const navigate = useNavigate()
  const formRef = useRef()

  const [formData, setFormData] = useState({
    isUser: true,
    isEmployee: true,

    employeeId: '',
    lastName: '',
    firstName: '',
    fullName: '',
    dateOfBirth: new Date(),
    gender: 'Nam',
    address: '',
    phoneNumber: '',
    personalEmail: '',

    jobPosition: '',
    status: 'Đang làm việc',
    probationaryDate: new Date(),
    officialDate: new Date(),
    companyPhone: '',
    companyEmail: '',
    accountEmail: '',
    sendActivation: true,
  })

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (prev[field] === value) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleAdd = () => {
    const form = formRef.current
    if (form && !form.checkValidity()) {
      console.log('Form chưa hợp lệ!')
      form.reportValidity()
      return
    }

    console.log('Form hợp lệ')
  }

  console.log(formData)

  useEffect(() => {
    handleChange('fullName', formData.lastName + ' ' + formData.firstName)
  }, [formData.firstName, formData.lastName])

  return (
    <>
      <CRow className="align-items-center">
        {/* BÊN TRÁI */}
        <CCol className="d-flex align-items-center gap-2">
          <CButton color="light" onClick={() => navigate(-1)}>
            <CIcon size="lg" icon={cilArrowLeft} />
          </CButton>
          <h5 className="mb-0 fw-bold">Thêm hồ sơ</h5>
        </CCol>

        {/* BÊN PHẢI */}
        <CCol xs="auto">
          <CButton color="info" className="text-white fw-bold" onClick={handleAdd}>
            Thêm
          </CButton>
        </CCol>
      </CRow>

      <CContainer
        style={{ backgroundColor: 'white', padding: 16, marginBottom: 16, marginTop: 16 }}
      >
        <h1>Loại đối tượng</h1>

        <CCol
          className="d-flex align-items-center gap-3"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <CFormCheck
            id="isUser"
            label="Là người dùng"
            checked={formData.isUser}
            onChange={(e) => handleChange('isUser', e.target.checked)}
          />
          <div className="vr"></div>
          <CFormCheck
            id="isEmployee"
            label="Là nhân viên"
            checked={formData.isEmployee}
            onChange={(e) => handleChange('isEmployee', e.target.checked)}
          />
        </CCol>
      </CContainer>

      <CForm
        ref={formRef}
        noValidate
        className="needs-validation"
        validated={true}
        style={{ backgroundColor: 'white', padding: 16, marginBottom: 16, marginTop: 16 }}
      >
        <UploadAvatar />
        <CRow>
          <CCol className="position-relative">
            <GeneralInfoForm formData={formData} handleChange={handleChange} />
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default ProfileCreate
