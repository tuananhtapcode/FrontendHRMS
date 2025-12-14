import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { employeeColumns } from '../../employees-information/pages/components/tableColumns'
import { getMyEmployeeInformation } from '../api/api'
import { updateEmployees } from '../../employees-information/api/api'

const Profile = () => {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (prev[field] === value) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleEdit = () => {
    setFormData({
      fullName: data.fullName || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
    })
    setVisible(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyEmployeeInformation()
        console.log(res)
        setData(res)
      } catch (error) {
        console.error('Error fetching employee profile:', error)
      }
    }
    fetchData()
  }, [])

  const handleUpdate = async () => {
    try {
      await updateEmployees(
        data.employeeId,
        data.employeeCode,
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        data.departmentId,
        data.jobPositionId,
      )
      setVisible(false)
      const res = await getMyEmployeeInformation()
      setData(res)
    } catch (error) {
      console.error(error)
      const message = error.response?.data.message || 'Có lỗi xảy ra'
      alert(message)
    }
  }

  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white border-bottom-0">
          <div>
            <h2 className="mb-1 fw-semibold">Thông tin nhân viên</h2>
          </div>
          <CButton color="primary" variant="outline" onClick={() => handleEdit()}>
            Chỉnh sửa
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CTable striped bordered hover responsive className="align-middle">
            <CTableBody>
              {employeeColumns.map((col, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell
                    style={{ width: '30%', whiteSpace: 'nowrap' }}
                    className="fw-semibold bg-light"
                  >
                    {col.label}
                  </CTableHeaderCell>
                  <CTableDataCell>{data[col.key]}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Chỉnh sửa thông tin nhân viên</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Họ và tên"
            value={formData.fullName}
            placeholder="Nhập họ và tên"
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          <CFormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <CFormInput
            label="Điện thoại"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
          {/* Có thể thêm select department/jobPosition nếu cần */}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleUpdate}>
            Cập nhật
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Profile
