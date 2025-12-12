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
import Third from './attendancePages/Third'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import { FormDatePicker } from '../../../components/zReuse/zComponents'

const leaveTypes = [
  'Nghỉ phép',
  'Nghỉ không lương',
  'Nghỉ kết hôn',
  'Nghỉ ma chay',
  'Nghỉ hưởng chế độ BHXH',
  'Nghỉ thai sản',
  'Nghỉ bù',
]

const TimesheetAttendance = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Đơn xin nghỉ</h2>
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
          <CTab itemKey={3}>Chuyển tiếp</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-3" itemKey={1}>
            <First />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={2}>
            <Second />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={3}>
            <Third />
          </CTabPanel>
        </CTabContent>
      </CTabs>

      <CModal size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm đơn xin nghỉ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <FormDatePicker
                label="Từ ngày"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <FormDatePicker
                label="Đến ngày"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <CFormSelect label="Số ngày nghỉ">
                {leaveTypes.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
              <CFormInput label="Tỉ lệ hưởng lương" value={100} disabled></CFormInput>
              <CFormInput label="Tỉ lệ hưởng lương" value={100} disabled></CFormInput>
            </CCol>
            <CCol>
              <CFormInput label="Số NP được sử dụng" value={0} disabled></CFormInput>
              <CFormInput label="Số NP đã nghỉ" value={0} disabled></CFormInput>
              <CFormInput label="Số NP còn lại" value={0} disabled></CFormInput>
              <CFormTextarea label="Lý do nghỉ" rows={4} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary">Hủy</CButton>
          <CButton color="primary">Gửi</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TimesheetAttendance
