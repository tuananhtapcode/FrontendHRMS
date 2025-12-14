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
import { overtimeRequestCols } from '../../components/tableColumns'
import { forwardRef, useState } from 'react'
import {
  getMineOvertimeRequestApproved,
  getMineOvertimeRequestPending,
  getMineOvertimeRequestRejected,
  getMineOvertimeRequestsAll,
} from '../../api/api'

const states = [
  { button: 'Tất cả', getAPI: getMineOvertimeRequestsAll },
  { button: 'Chờ duyệt', getAPI: getMineOvertimeRequestPending },
  { button: 'Đã duyệt', getAPI: getMineOvertimeRequestApproved },
  { button: 'Bị từ chối', getAPI: getMineOvertimeRequestRejected },
]

const First = forwardRef(({ onUpdate }, ref) => {
  const [visible, setVisible] = useState(false)
  const [currentState, setCurrentState] = useState(0)

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [reason, setReason] = useState('')

  const handleRowClick = (item) => {
    setVisible(true)
    setDate(item.date)
    setStartTime(item.startTime)
    setEndTime(item.endTime)
    setReason(item.reason)
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
                    name="vbtnradio-tab1"
                    id={`vbtnradio${index}-tab1`}
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
            columns={overtimeRequestCols}
            getAPI={states[currentState].getAPI}
            onRowClick={handleRowClick}
            onUpdate={onUpdate}
          />
        </CCol>
      </CRow>

      <CModal size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Xem đơn đăng ký làm thêm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput label={requiredLabel('Làm thêm ngày')} value={date} disabled />
              <CFormInput label={requiredLabel('Làm từ giờ')} value={startTime} disabled />
              <CFormInput label={requiredLabel('Làm đến giờ')} value={endTime} disabled />
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
