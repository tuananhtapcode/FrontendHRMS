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
import First from './changeShiftPages/First'
import Second from './changeShiftPages/Second'
import Third from './changeShiftPages/Third'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import { FormDatePicker } from '../../../components/zReuse/zComponents'

const leaveTypes = ['Ca hành chính', 'Ca 123']

const TimesheetChangeShift = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol>
          <h2 className="m-0">Đề nghị đổi ca</h2>
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
                label="Ngày làm việc *"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <CFormSelect label="Ca hiện tại">
                {leaveTypes.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
              <FormDatePicker
                label="Ngày đăng ký ca đổi *"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <CFormSelect label="Ca đăng ký đổi">
                {leaveTypes.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol>
              <CFormSelect label="Đổi ca với">
                {leaveTypes.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
              <CFormTextarea label="Lý do đổi ca" rows={4} />
              <CFormSelect label="Người duyệt">
                {leaveTypes.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
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

export default TimesheetChangeShift
