import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CTooltip,
} from '@coreui/react'
import { deparmentCols } from '../../components/tableColumns'
import { SearchableTable } from '../../../../components/zReuse/zComponents'
import { useEffect, useState } from 'react'
import {
  createDepartment,
  deleteDepartment,
  exportDepartment,
  getDepartments,
  getEmployees,
} from '../../api/api'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPlus } from '@coreui/icons'

const SettingDepartmentalStructure = () => {
  const [visible, setVisible] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedManagerId, setSelectedManagerId] = useState(null)
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployees(0, 999999)
        setEmployees(data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (employees.length > 0 && !selectedManagerId) {
      setSelectedManagerId(employees[0].employeeId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees])

  const handleCancel = () => {
    setVisible(false)
  }

  const handleExport = async () => {
    try {
      await exportDepartment()
    } catch (error) {
      console.error(err)
    }
  }

  const handleSave = async () => {
    try {
      const res = await createDepartment(name, description, selectedManagerId)
      console.log(res)
    } catch (err) {
      console.error('ERROR: ', err)
    }
  }

  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Cơ cấu phòng ban
        </CCol>
        <CCol className="gap-2 d-flex justify-content-end align-items-center">
          <CTooltip content="Xuất file Excel" placement="bottom">
            <CButton color="secondary" onClick={() => handleExport()}>
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CTooltip>
          <CButton color="info" onClick={() => setVisible(!visible)}>
            <CIcon icon={cilPlus} />
            Thêm
          </CButton>
        </CCol>
      </CRow>

      <SearchableTable
        columns={deparmentCols}
        getAPI={getDepartments}
        deleteAPI={deleteDepartment}
        limit={5}
      />

      <CModal alignment="center" backdrop="static" visible={visible} onClose={handleCancel}>
        <CModalHeader>
          <CModalTitle>Thêm phòng ban</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Tên phòng ban"
            placeholder="Nhập tên phòng ban"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CFormTextarea
            label="Mô tả"
            placeholder="Nhập mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <CFormSelect label="Người quản lý">
            {employees.map((e, i) => (
              <option key={i} value={e.fullName} onClick={() => setSelectedManagerId(e.employeeId)}>
                {e.fullName}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(!visible)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={() => handleSave()}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SettingDepartmentalStructure
