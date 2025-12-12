import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useRef, useState } from 'react'
// import api from '../../../api/api'

const fields = [
  {
    key: 'fullName',
    label: (
      <>
        Tên đầy đủ <span style={{ color: 'red' }}>*</span>
      </>
    ),
    placeholder: 'Nhập họ và tên',
    required: true,
  },
  {
    key: 'gender',
    type: 'select',
    label: (
      <>
        Giới tính <span style={{ color: 'red' }}>*</span>
      </>
    ),
    options: [
      { label: 'Nam', value: 'Nam' },
      { label: 'Nữ', value: 'Nữ' },
      { label: 'U I A Cat', value: 'U I A Cat' },
    ],
  },
  {
    key: 'taxCode',
    label: (
      <>
        Ngày sinh <span style={{ color: 'red' }}>*</span>
      </>
    ),
    required: true,
    feedbackInvalid: 'Không được để trống',
  },
  {
    key: 'address',
    label: (
      <>
        {' '}
        Địa chỉ <span style={{ color: 'red' }}>*</span>{' '}
      </>
    ),
    placeholder: 'Nhập địa chỉ',
    required: true,
  },
  {
    key: 'phoneNumber',
    label: (
      <>
        Điện thoại <span style={{ color: 'red' }}>*</span>
      </>
    ),
    placeholder: 'Nhập số điện thoại',
    required: true,
    pattern: '^(0|84)(3|5|7|8|9)[0-9]{8}$',
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Nhập email',
  },
]

const Profile = () => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState([
    { key: 'fullName', value: 'Lam Bai Tap' },
    { key: 'gender', value: 'Nam' },
    { key: 'dateOfBirth', value: '0123456789-223' },
    { key: 'email', value: 'ziptghz@gmail.com' },
    { key: 'phoneNumber', value: '0323456789' },
    { key: 'address', value: '123' },
  ])
  const [form, setForm] = useState({})
  const [posting, setPosting] = useState(false)
  const formRef = useRef()

  const handleEdit = () => {
    const converted = data.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {})
    setForm(converted)
    setVisible(!visible)
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      console.log('Form chưa hợp lệ!')
      formRef.current.reportValidity()
      return
    }
    try {
      setPosting(true)
      console.log('POST form: ', form)
      // await api.post('/api/abc', form)
      await new Promise((r) => setTimeout(r, 1000))
      const newData = data.map((item) => ({
        ...item,
        value: form[item.key] || '',
      }))
      setData(newData)
      setVisible(false)
      console.log('Updated data: ', newData)
    } catch (err) {
      alert(err.response?.data?.message || 'Unknown error. Please try again!')
    } finally {
      setPosting(false)
    }
  }

  console.log(form)

  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white border-bottom-0">
          <div>
            <h2 className="mb-1 fw-semibold">Thông tin nhân viên</h2>
            <small className="text-muted">
              Khai báo và cập nhật thông tin để hệ thống tự động lấy lên các báo cáo, tài liệu...
            </small>
          </div>
          <CButton color="primary" variant="outline" onClick={() => handleEdit()}>
            Chỉnh sửa
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CTable striped bordered hover responsive className="align-middle">
            <CTableBody>
              {fields.map((field, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell
                    style={{ width: '30%', whiteSpace: 'nowrap' }}
                    className="fw-semibold bg-light"
                  >
                    {field.label}
                  </CTableHeaderCell>
                  <CTableDataCell>{data[index].value}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        backdrop="static"
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Chỉnh sửa thông tin công ty</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm ref={formRef} noValidate validated={true}>
            {fields.map((field) => {
              if (field.type === 'select')
                return (
                  <CFormSelect
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    style={{ marginBottom: 4 }}
                  />
                )
              else {
                const { key, ...rest } = field
                return (
                  <CFormInput
                    key={key}
                    {...rest}
                    value={form[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    style={{ marginBottom: 4 }}
                  />
                )
              }
            })}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Hủy
          </CButton>
          <CButton color="info" onClick={() => handleSave()} disabled={posting}>
            {posting && <CSpinner size="sm" color="danger" />} Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Profile
