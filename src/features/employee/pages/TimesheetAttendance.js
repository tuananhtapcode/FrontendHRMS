import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
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
import First from './attendancePages/First'
import Second from './attendancePages/Second'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormDatePicker } from '../../../components/zReuse/zComponents'
import { getEmployees } from '../../employees-information/api/api'
import dayjs from 'dayjs'
import { createAttendance, updateAttendance } from '../api/api'

const leaveTypes = ['PAID', 'UNPAID']

const TimesheetAttendance = () => {
  const tableRef = useRef(null)
  const isAdmin = useMemo(() => {
    return localStorage.getItem('Role') === 'ADMIN'
    // return true
  }, [])
  const [isUpdate, setIsUpdate] = useState(false)
  const [employees, setEmployees] = useState([])
  const [employeeId, setEmployeeId] = useState(1)

  const [visible, setVisible] = useState(false)
  const [attendanceId, setAttendanceId] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [leaveType, setLeaveType] = useState('PAID')
  const [reason, setReason] = useState('')

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

    setAttendanceId(item.leaveRequestId)
    setStartDate(dayjs(item.startDate, 'DD/MM/YYYY').toDate())
    setEndDate(dayjs(item.endDate, 'DD/MM/YYYY').toDate())
    setLeaveType(item.leaveType)
    setReason(item.reason)
  }

  const handleUpdate = async () => {
    try {
      await updateAttendance(attendanceId, startDate, endDate, leaveType, reason)
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
      await createAttendance(isAdmin ? employeeId : null, startDate, endDate, leaveType, reason)
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
          <h2 className="m-0">Đơn xin nghỉ</h2>
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
              <First onUpdate={(item) => onUpdate(item)} ref={tableRef} />
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
          <CModalTitle>Thêm đơn xin nghỉ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {isAdmin && (
                <CFormSelect label="Chọn nhân viên">
                  {employees.map((e, i) => (
                    <option key={i} value={e.fullName} onClick={() => setEmployeeId(e.employeeId)}>
                      {e.fullName}
                    </option>
                  ))}
                </CFormSelect>
              )}
              <FormDatePicker
                label="Từ ngày"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <FormDatePicker
                label="Đến ngày"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
              <CFormSelect label="Loại nghỉ">
                {leaveTypes.map((value, index) => (
                  <option key={index} value={value} onClick={() => setLeaveType(value)}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
              <CFormInput label="Tỉ lệ hưởng lương" value={100} disabled></CFormInput>
            </CCol>
            <CCol>
              <CFormInput label="Số NP được sử dụng" value={0} disabled></CFormInput>
              <CFormInput label="Số NP đã nghỉ" value={0} disabled></CFormInput>
              <CFormInput label="Số NP còn lại" value={0} disabled></CFormInput>
              <CFormTextarea
                label="Lý do nghỉ"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
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

export default TimesheetAttendance
