import { useEffect, useRef, useState } from 'react'
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CTooltip,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { cilCloudDownload, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { SearchableTable } from '../../../components/zReuse/zComponents'
import { employeeColumns } from './components/tableColumns'
import {
  createEmployees,
  exportEmployees,
  getActiveJobPositions,
  getDepartments,
  getEmployees,
  updateEmployees,
} from '../api/api'

const ProfileView = () => {
  const formRef = useRef(null)
  const tableRef = useRef(null)

  const [isUpdate, setIsUpdate] = useState(false)
  const [employeeId, setEmployeeId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [jobPositions, setJobPositions] = useState([])
  const [departments, setDeparments] = useState([])
  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    departmentId: 1,
    jobPositionId: 1,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDepartments(0, 9999)
        const cleaned = res.data.map(({ departmentId, name }) => ({
          departmentId,
          name,
        }))
        setDeparments(cleaned)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getActiveJobPositions(0, 9999)
        const cleaned = res.data.map(({ id, name }) => ({
          id,
          name,
        }))
        setJobPositions(cleaned)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (prev[field] === value) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleAdd = () => {
    setIsUpdate(false)
    setVisible(true)
    setFormData({
      employeeCode: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      departmentId: departments[0].departmentId,
      jobPositionId: jobPositions[0].id,
    })
  }

  const handleExport = async () => {
    try {
      await exportEmployees()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleSubmit = async () => {
    try {
      await createEmployees(
        formData.employeeCode,
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.departmentId,
        formData.jobPositionId,
      )
    } catch (error) {
      const message = error.response.data
      alert(message)
      console.error(error)
    }
  }
  const onUpdate = (employee) => {
    setIsUpdate(true)
    setVisible(true)
    setEmployeeId(employee.employeeId)
    setFormData({
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      departmentId: employee.departmentId,
      jobPositionId: employee.jobPositionId,
    })
  }
  const handleUpdate = async () => {
    try {
      await updateEmployees(
        employeeId,
        formData.employeeCode,
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.departmentId,
        formData.jobPositionId,
      )
      setVisible(false)
      tableRef.current?.reload()
    } catch (error) {
      const message = error.response?.data || 'Có lỗi xảy ra'
      alert(message)
      console.error(error)
    }
  }
  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Thông tin nhân sự
        </CCol>
        <CCol className="gap-2 d-flex justify-content-end align-items-center">
          <CTooltip content="Xuất file Excel" placement="bottom">
            <CButton color="secondary" onClick={() => handleExport()}>
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CTooltip>
          <CButton color="info" onClick={() => handleAdd()}>
            <CIcon icon={cilPlus} />
            Thêm
          </CButton>
        </CCol>
      </CRow>
      <SearchableTable
        ref={tableRef}
        columns={employeeColumns}
        getAPI={getEmployees}
        limit={10}
        onUpdate={onUpdate}
      />

      <CModal alignment="center" backdrop="static" visible={visible} onClose={handleCancel}>
        <CModalHeader>
          <CModalTitle>Thêm vị trí công việc</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            ref={formRef}
            noValidate
            className="needs-validation"
            validated={true}
            style={{ backgroundColor: 'white', padding: 16, marginBottom: 16, marginTop: 16 }}
          >
            <CRow>
              <CCol className="position-relative">
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
                  <CCol md={12}>
                    <CFormInput
                      id="inputFullName"
                      label="Họ và tên"
                      value={formData.fullName}
                      placeholder="Nhập họ và tên"
                      required
                      onChange={(e) => handleChange('fullName', e.target.value)}
                    />
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
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      type="email"
                      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      feedbackInvalid="Email không hợp lệ"
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormSelect label="Chọn nhân viên">
                      {departments.map((d, i) => (
                        <option
                          key={i}
                          value={d.name}
                          onClick={() => handleChange('departmentId', d.departmentId)}
                        >
                          {d.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={12}>
                    <CFormSelect label="Chọn nhân viên">
                      {jobPositions.map((j, i) => (
                        <option
                          key={i}
                          value={j.name}
                          onClick={() => handleChange('jobPositionId', j.id)}
                        >
                          {j.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(!visible)}>
            Hủy
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              isUpdate ? handleUpdate() : handleSubmit()
            }}
          >
            {isUpdate ? 'Cập nhật' : 'Thêm'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ProfileView
