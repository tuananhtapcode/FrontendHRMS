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
  CFormTextarea,
  CFormLabel,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CTooltip,
} from '@coreui/react'
import { requiredLabel, SearchableTable } from '../../../../components/zReuse/zComponents'
import { useRef, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPlus } from '@coreui/icons'
import {
  createJobPosition,
  deleteJobPosition,
  exportEmployees,
  exportJobPosition,
  getActiveJobPositions,
  getInactiveJobPositions,
  getJobPositions,
  updateJobPosition,
} from '../../api/api'
import { jobPositionCols } from '../../components/tableColumns'

const jobLevels = [
  'Intern',
  'Fresher',
  'Junior',
  'Mid',
  'Senior',
  'Lead',
  'Manager',
  'Director',
  'C-Level',
]

const SettingJobPosition = () => {
  const [visible, setVisible] = useState(false)

  const [isUpdate, setIsUpdate] = useState(false)
  const [id, setId] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState(jobLevels[0])
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')

  const tableRef = useRef(null)
  const handleCancel = () => {
    setVisible(false)
  }

  const onUpdate = (item) => {
    setIsUpdate(true)
    setVisible(true)
    setId(item.id)
    setCode(item.code)
    setName(item.name)
    setDescription(item.description)
    setLevel(item.level)
    setMinSalary(item.minSalary)
    setMaxSalary(item.maxSalary)
  }

  const handleAdd = () => {
    setIsUpdate(false)
    setVisible(true)
    setId('')
    setCode('')
    setName('')
    setDescription('')
    setLevel(jobLevels[0])
    setMinSalary('')
    setMaxSalary('')
  }

  const handleUpdate = async () => {
    try {
      const res = await updateJobPosition(id, code, name, description, level, minSalary, maxSalary)
      console.log(res)
      tableRef.current.reload()
    } catch (err) {
      console.error('ERROR: ', err)
    }
  }

  const handleExport = async () => {
    try {
      await exportEmployees()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    try {
      await createJobPosition(code, name, description, level, minSalary, maxSalary)
      tableRef.current.reload()
      setVisible(false)
    } catch (err) {
      const data = err.response?.data

      if (Array.isArray(data)) {
        alert(data.join('\n'))
      } else {
        alert(data || 'Có lỗi xảy ra')
      }

      console.error('ERROR: ', err)
    }
  }

  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Vị trí công việc
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

      <CTabs defaultActiveItemKey={3}>
        <CTabList variant="underline-border">
          <CTab itemKey={1}>Đang hoạt động</CTab>
          <CTab itemKey={2}>Không hoạt động</CTab>
          <CTab itemKey={3}>Tất cả</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel itemKey={1}>
            <SearchableTable
              columns={jobPositionCols}
              getAPI={getActiveJobPositions}
              onUpdate={onUpdate}
              deleteAPI={deleteJobPosition}
              limit={5}
              ref={tableRef}
            />
          </CTabPanel>
          <CTabPanel itemKey={2}>
            <SearchableTable
              columns={jobPositionCols}
              getAPI={getInactiveJobPositions}
              onUpdate={onUpdate}
              deleteAPI={deleteJobPosition}
              limit={5}
              ref={tableRef}
            />
          </CTabPanel>
          <CTabPanel itemKey={3}>
            <SearchableTable
              columns={jobPositionCols}
              getAPI={getJobPositions}
              onUpdate={onUpdate}
              deleteAPI={deleteJobPosition}
              limit={5}
              ref={tableRef}
            />
          </CTabPanel>
        </CTabContent>
      </CTabs>

      <CModal alignment="center" backdrop="static" visible={visible} onClose={handleCancel}>
        <CModalHeader>
          <CModalTitle>Thêm vị trí công việc</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label={requiredLabel('Mã vị trí')}
            placeholder="Nhập mã vị trí"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <CFormInput
            label={requiredLabel('Tên vị trí')}
            placeholder="Nhập mã vị trí"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <CFormTextarea
            label="Mô tả"
            placeholder="Nhập mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div>
            <CFormLabel>Trình độ</CFormLabel>
          </div>
          <div>
            <CDropdown>
              <CDropdownToggle color="primary">{level}</CDropdownToggle>
              <CDropdownMenu>
                {jobLevels.map((l, i) => {
                  return (
                    <CDropdownItem
                      key={i}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setLevel(l)}
                    >
                      {l}
                    </CDropdownItem>
                  )
                })}
              </CDropdownMenu>
            </CDropdown>
          </div>
          <CFormInput
            label={requiredLabel('Lương thấp nhất')}
            placeholder="Nhập lương thấp nhất"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <CFormInput
            label={requiredLabel('Lương cao nhất')}
            placeholder="Nhập lương cao nhất"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
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

export default SettingJobPosition
