import {
  CButton,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import First from './overtimeRequestPages/First'
import Second from './overtimeRequestPages/Second'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FormDatePicker,
  FormTimePicker,
  requiredLabel,
} from '../../../components/zReuse/zComponents'
import { createOvertimeRequest, updateOvertimeRequest } from '../api/api'
import { getEmployees } from '../../employees-information/api/api'
import dayjs from 'dayjs'

const TimesheetOvertimeRequest = () => {
  const tableRef = useRef(null)
  const isAdmin = useMemo(() => {
    return localStorage.getItem('Role') === 'ADMIN'
    // return true
  }, [])
  const [employees, setEmployees] = useState([])
  const [visible, setVisible] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  const [overtimeId, setOvertimeId] = useState(null)
  const [employeeId, setEmployeeId] = useState(1)
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(() => {
    const d = new Date()
    d.setHours(8, 0, 0, 0)
    return d
  })
  const [endTime, setEndTime] = useState(() => {
    const d = new Date()
    d.setHours(17, 0, 0, 0)
    return d
  })
  const [reason, setReason] = useState('')

  const overtimeHours = useMemo(() => {
    return dayjs(endTime).diff(dayjs(startTime), 'hour')
  }, [startTime, endTime])

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await getEmployees(0, 9999)
      const cleaned = res.data.map(({ employeeId, fullName }) => ({
        employeeId,
        fullName,
      }))
      setEmployees(cleaned)
    }
    if (isAdmin) {
      fetchEmployees()
    }
  }, [isAdmin])

  const onUpdate = (item) => {
    setVisible(true)
    setIsUpdate(true)
    setOvertimeId(item.id)
    console.log(item.date)
    setDate(dayjs(item.date, 'DD/MM/YYYY'))
    setStartTime(dayjs(`${item.date} ${item.startTime}`, 'DD/MM/YYYY HH:mm:ss').toDate())
    setEndTime(dayjs(`${item.date} ${item.endTime}`, 'DD/MM/YYYY HH:mm:ss').toDate())
    setReason(item.reason)
  }

  const handleUpdate = async () => {
    try {
      await updateOvertimeRequest(overtimeId, date, startTime, endTime, reason)
      setVisible(false)
      tableRef.current?.reload()
    } catch (error) {
      console.error(error)
      const message = error.response.data.message
      alert(message)
    }
  }

  const handleSubmit = async () => {
    try {
      await createOvertimeRequest(isAdmin ? employeeId : null, date, startTime, endTime, reason)
      setVisible(false)
      tableRef.current?.reload()
    } catch (error) {
      const message = error.response.data.message
      alert(message)
    }
  }
  const handleAdd = () => {
    setIsUpdate(false)
    setVisible(true)
  }
  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Đăng ký làm thêm</h2>
        </CCol>
        <CCol className="text-end">
          <CButton color="primary" onClick={() => handleAdd()}>
            <CIcon icon={cilPlus} /> Thêm
          </CButton>
        </CCol>
      </CRow>

      <CTabs defaultActiveItemKey={isAdmin ? 2 : 1}>
        <CTabList variant="underline-border">
          {!isAdmin && <CTab itemKey={1}>Của tôi</CTab>}
          {isAdmin && <CTab itemKey={2}>Tôi duyệt</CTab>}
        </CTabList>
        <CTabContent>
          {!isAdmin && (
            <CTabPanel className="p-3" itemKey={1}>
              <First ref={tableRef} onUpdate={(item) => onUpdate(item)} />
            </CTabPanel>
          )}
          {isAdmin && (
            <CTabPanel className="p-3" itemKey={2}>
              <Second />
            </CTabPanel>
          )}
        </CTabContent>
      </CTabs>

      <CModal size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm đơn đăng ký làm thêm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {isAdmin && (
                <>
                  <div>
                    <CFormLabel>Chọn nhân viên</CFormLabel>
                  </div>
                  <div>
                    <CDropdown>
                      <CDropdownToggle color="primary">
                        {employees.find((e) => e.employeeId === employeeId)?.fullName ||
                          'Chọn nhân viên'}
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {employees.map((employee) => (
                          <CDropdownItem
                            key={employee.employeeId}
                            onClick={() => setEmployeeId(employee.employeeId)}
                          >
                            {employee.fullName}
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>
                  </div>
                </>
              )}
              <FormDatePicker
                label={requiredLabel('Làm thêm ngày')}
                value={date}
                onChange={(date) => setDate(date)}
              />
              <FormTimePicker
                label={requiredLabel('Làm từ giờ')}
                value={startTime}
                onChange={(time) => setStartTime(time)}
              />
              <FormTimePicker
                label={requiredLabel('Làm đến giờ')}
                value={endTime}
                onChange={(time) => setEndTime(time)}
              />
            </CCol>
            <CCol>
              <CFormTextarea
                label={requiredLabel('Lý do làm thêm')}
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <CFormInput label="Thời gian làm thêm" value={overtimeHours} disabled />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Hủy
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              isUpdate ? handleUpdate() : handleSubmit()
            }}
          >
            {isUpdate ? 'Cập nhật' : 'Gửi'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TimesheetOvertimeRequest
