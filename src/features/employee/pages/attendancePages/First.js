import {
  CButton,
  CButtonGroup,
  CCard,
  CCol,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { cil4k } from '@coreui/icons'
import {
  EmployeeCard,
  requiredLabel,
  SearchableTable,
} from '../../../../components/zReuse/zComponents'
import { attendanceCols } from '../../components/tableColumns'
import {
  getMineAttendanceAll,
  getMineAttendanceApproved,
  getMineAttendancePending,
} from '../../api/api'
import { forwardRef, useState } from 'react'

const states = [
  { button: 'Tất cả', getAPI: getMineAttendanceAll },
  { button: 'Chờ duyệt', getAPI: getMineAttendancePending },
  { button: 'Đã duyệt', getAPI: getMineAttendanceApproved },
  // { button: 'Bị từ chối', getAPI: getMineOvertimeRequestRejected },
]

const First = forwardRef(({ onUpdate }, ref) => {
  const [currentState, setCurrentState] = useState(0)
  const [visible, setVisible] = useState(false)

  const [createdDate, setCreatedDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalDay, setTotalDay] = useState('')
  const [leaveType, setLeaveType] = useState('')
  const [reason, setReason] = useState('')

  const handleRowClick = (item) => {
    setVisible(true)
    setCreatedDate(item.createdAt)
    setStartDate(item.startDate)
    setEndDate(item.endDate)
    setTotalDay(item.totalDays)
    setLeaveType(item.leaveType)
    setReason(item.reason)
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <EmployeeCard
            title="Số ngày phép cả năm"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#e8f0ff"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày phép đã nghỉ"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#e8fff3"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày phép còn lại cả năm"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#fff6e8"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày còn lại đến tháng hiện tại"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#ffe8e8"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày nghỉ không lương"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#ffe8e8"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={2}>
          <CCard>
            <CButtonGroup vertical role="group" className="w-100">
              {states.map((state, index) => {
                return (
                  <CFormCheck
                    key={index}
                    type="radio"
                    button={{ color: 'primary', variant: 'outline' }}
                    name="vbtnradio-tab1"
                    id={`attendance${index}-tab1`}
                    autoComplete="off"
                    defaultChecked={index === currentState}
                    label={state.button}
                    onClick={() => setCurrentState(index)}
                  />
                )
              })}
            </CButtonGroup>
          </CCard>
        </CCol>
        <CCol style={{ width: '1px' }}>
          <SearchableTable
            ref={ref}
            columns={attendanceCols}
            getAPI={states[currentState].getAPI}
            onRowClick={handleRowClick}
            onUpdate={onUpdate}
          />
        </CCol>
      </CRow>

      <CModal size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Xem đơn nghỉ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput label={requiredLabel('Ngày nộp đơn')} value={createdDate} disabled />
              <CFormInput label={requiredLabel('Từ ngày')} value={startDate} disabled />
              <CFormInput label={requiredLabel('Đến ngày')} value={endDate} disabled />
              <CFormInput label={requiredLabel('Loại nghỉ')} value={leaveType} disabled />
              <CFormInput label={requiredLabel('Số ngày nghỉ')} value={totalDay} disabled />
              <CFormInput label={requiredLabel('Lý do nghỉ')} value={reason} disabled />
            </CCol>
            <CCol>
              <CFormTextarea
                label={requiredLabel('Lý do làm thêm')}
                rows={4}
                value={reason}
                disabled
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setVisible(false)}>
            OK
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
})

export default First
