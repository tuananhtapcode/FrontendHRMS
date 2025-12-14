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
import { requiredLabel, SearchableTable } from '../../../../components/zReuse/zComponents'
import { attendanceCols } from '../../components/tableColumns'
import {
  approveAttendance,
  getIApproveAttendanceAll,
  getIApproveAttendanceApproved,
  getIApproveAttendanceCount,
  getIApproveAttendancePending,
  getIApproveAttendanceRejected,
  rejectAttendance,
} from '../../api/api'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getEmployeeById } from '../../../employees-information/api/api'

const states = [
  { key: 'total', button: 'Tất cả', getAPI: getIApproveAttendanceAll },
  { key: 'pending', button: 'Chờ duyệt', getAPI: getIApproveAttendancePending },
  { key: 'approve', button: 'Đã duyệt', getAPI: getIApproveAttendanceApproved },
  { key: 'reject', button: 'Bị từ chối', getAPI: getIApproveAttendanceRejected },
]

const Second = () => {
  const tableRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [currentState, setCurrentState] = useState(0)

  const [selectedId, setSelectedId] = useState(null)
  const [employeeName, setEmployeeName] = useState('')
  const [status, setStatus] = useState('')
  const [createdDate, setCreatedDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalDay, setTotalDay] = useState('')
  const [leaveType, setLeaveType] = useState('')
  const [reason, setReason] = useState('')
  const [managerNote, setManagerNote] = useState('')

  const [counts, setCounts] = useState({
    pending: 0,
    approve: 0,
    reject: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      const [r1, r2, r3] = await Promise.all([
        getIApproveAttendanceCount('PENDING'),
        getIApproveAttendanceCount('APPROVED'),
        getIApproveAttendanceCount('REJECTED'),
      ])

      setCounts({
        pending: r1,
        approve: r2,
        reject: r3,
      })
    }

    fetchCounts()
  }, [])

  const total = useMemo(() => {
    return counts.pending + counts.approve + counts.reject
  }, [counts])

  const countMap = {
    total: total,
    pending: counts.pending,
    approve: counts.approve,
    reject: counts.reject,
  }

  const handleRowClick = async (item) => {
    setVisible(true)
    setSelectedId(item.leaveRequestId)
    setCreatedDate(item.createdAt)
    setStartDate(item.startDate)
    setEndDate(item.endDate)
    setTotalDay(item.totalDays)
    setLeaveType(item.leaveType)
    setReason(item.reason)
    setManagerNote('')
    setStatus(item.status)
    setManagerNote('')
    try {
      const res = await getEmployeeById(item.employeeId)
      setEmployeeName(res.fullName)
    } catch (error) {
      console.error(error)
    }
  }

  const handleReject = async () => {
    try {
      await rejectAttendance(selectedId, managerNote)
      setVisible(false)
      tableRef.current?.reload()
    } catch (error) {
      const message = error.response.data.message
      alert(message)
    }
  }

  const handleApprove = async () => {
    try {
      console.log(selectedId)
      await approveAttendance(selectedId, managerNote)
      setVisible(false)
      tableRef.current?.reload()
    } catch (error) {
      const message = error.response.data.message
      alert(message)
    }
  }

  return (
    <>
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
                    name="vbtnradio-tab2"
                    id={`vbtnradio${index}-tab2`}
                    autoComplete="off"
                    defaultChecked={index === currentState}
                    label={
                      <div className="d-flex justify-content-between align-items-center w-100 px-2">
                        <span>{state.button}</span>
                        <span className="badge bg-primary">{countMap[state.key] ?? -1}</span>
                      </div>
                    }
                    onClick={() => setCurrentState(index)}
                  />
                )
              })}
            </CButtonGroup>
          </CCard>
        </CCol>
        <CCol style={{ width: '1px' }}>
          <SearchableTable
            ref={tableRef}
            columns={attendanceCols}
            getAPI={states[currentState].getAPI}
            onRowClick={handleRowClick}
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
              <CFormInput label={requiredLabel('Người nộp đơn')} value={employeeName} disabled />
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
              <CFormTextarea
                label="Ghi chú"
                rows={4}
                value={managerNote}
                onChange={(e) => setManagerNote(e.target.value)}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          {status === 'PENDING' ? (
            <>
              <CButton color="danger" onClick={() => handleReject()}>
                Từ chối
              </CButton>
              <CButton color="success" onClick={() => handleApprove()}>
                Duyệt
              </CButton>
            </>
          ) : (
            <CButton color="info" onClick={() => setVisible(false)}>
              OK
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Second
