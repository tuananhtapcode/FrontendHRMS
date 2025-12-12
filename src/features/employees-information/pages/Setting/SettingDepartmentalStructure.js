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
} from '@coreui/react'
import { deparmentCols } from '../../components/tableColumns'
import { SearchableTable } from '../../../../components/zReuse/zComponents'
import { useEffect, useState } from 'react'
import { createDepartment, deleteDepartment, getDepartments } from '../../api/api'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { getEmployees } from '../../../employee/api/api'

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

  const handleSave = async (data) => {
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
          <div>
            <CFormLabel>Người quản lý</CFormLabel>
          </div>
          <CDropdown>
            <CDropdownToggle color="primary">
              {employees.find((e) => e.employeeId === selectedManagerId)?.fullName ||
                'Chọn người quản lý'}
            </CDropdownToggle>
            <CDropdownMenu>
              {employees.map((e, i) => (
                <CDropdownItem
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedManagerId(e.employeeId)}
                >
                  {e.fullName}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
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
