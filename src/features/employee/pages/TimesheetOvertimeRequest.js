import {
  CButton,
  CCol,
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
import { useState } from 'react'
import {
  FormDatePicker,
  FormTimePicker,
  requiredLabel,
} from '../../../components/zReuse/zComponents'
import { createOvertimeRequest } from '../api/api'

const TimesheetOvertimeRequest = () => {
  const [visible, setVisible] = useState(false)
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

  const handleSubmit = async () => {
    try {
      const res = await createOvertimeRequest()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Đăng ký làm thêm</h2>
        </CCol>
        <CCol className="text-end">
          <CButton color="primary" onClick={() => setVisible(true)}>
            <CIcon icon={cilPlus} /> Thêm
          </CButton>
        </CCol>
      </CRow>

      <CTabs defaultActiveItemKey={1}>
        <CTabList variant="underline-border">
          <CTab itemKey={1}>Của tôi</CTab>
          <CTab itemKey={2}>Tôi duyệt</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-3" itemKey={1}>
            <First />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={2}>
            <Second />
          </CTabPanel>
        </CTabContent>
      </CTabs>

      <CModal size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm đơn đăng ký làm thêm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <FormDatePicker label={requiredLabel('Làm thêm ngày')} value={date} />
              <FormTimePicker label={requiredLabel('Làm từ giờ')} value={startTime} />
              <FormTimePicker label={requiredLabel('Làm đến giờ')} value={endTime} />
            </CCol>
            <CCol>
              <CFormTextarea label={requiredLabel('Lý do làm thêm')} rows={4} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary">Hủy</CButton>
          <CButton color="primary" onClick={() => handleSubmit()}>
            Gửi
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TimesheetOvertimeRequest
