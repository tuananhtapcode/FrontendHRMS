import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
  CFormSwitch,
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
import Third from './overtimeRequestPages/Third'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import {
  FormDatePicker,
  FormDateTimePicker,
  FormTimePicker,
  requiredLabel,
} from '../../../components/zReuse/zComponents'

const leaveTypes = [
  'Nghỉ phép',
  'Nghỉ không lương',
  'Nghỉ kết hôn',
  'Nghỉ ma chay',
  'Nghỉ hưởng chế độ BHXH',
  'Nghỉ thai sản',
  'Nghỉ bù',
]

const TimesheetOvertimeRequest = () => {
  const [isMultiDay, setIsMultiDay] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [visible, setVisible] = useState(false)

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
          <CModalTitle>Thêm đơn đăng ký làm thêm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSwitch
            label="Tạo đơn nhiều ngày"
            defaultChecked={isMultiDay}
            onChange={() => setIsMultiDay(!isMultiDay)}
          />
          {isMultiDay ? (
            <>
              <CRow className="pb-3 border-bottom">
                <CCol>
                  <CFormSelect label={requiredLabel('Thời điểm làm thêm')}>
                    {leaveTypes.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormSelect label={requiredLabel('Ca áp dụng')}>
                    {leaveTypes.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol>
                  <CFormTextarea label={requiredLabel('Lý do làm thêm')} rows={4} />
                  <CFormSelect label={requiredLabel('Người duyệt')}>
                    {leaveTypes.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="pt-2">
                <CCol>
                  <FormTimePicker
                    label={requiredLabel('Làm thêm từ')}
                    selected=""
                    onChange={null}
                  />
                  <FormTimePicker label="Nghỉ giữa ca từ" selected="" onChange={null} />
                  <FormTimePicker label="Nghỉ giữa ca đến" selected="" onChange={null} />
                  <FormTimePicker
                    label={requiredLabel('Làm thêm đến')}
                    selected=""
                    onChange={null}
                  />
                </CCol>
                <CCol>
                  <FormDatePicker
                    label={requiredLabel('Ngày bắt đầu')}
                    selected=""
                    onChange={null}
                  />
                  <FormDatePicker
                    label={requiredLabel('Ngày kết thúc')}
                    selected=""
                    onChange={null}
                  />
                  <FormDatePicker label="Lặp lại vào" selected="" onChange={null} />
                  <CFormInput label="Số giờ làm thêm" value="0" disabled />
                </CCol>
              </CRow>
            </>
          ) : (
            <CRow>
              <CCol>
                <FormDateTimePicker
                  label={requiredLabel('Làm thêm từ')}
                  selectedTime={new Date()}
                />
                <FormDateTimePicker
                  label="Nghỉ giữa ca từ"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <FormDateTimePicker
                  label="Nghỉ giữa ca đến"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <FormDateTimePicker
                  label={requiredLabel('Làm thêm đến')}
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
                <CFormInput label="Số giờ làm thêm" value={100} disabled></CFormInput>
              </CCol>
              <CCol>
                <CFormSelect label={requiredLabel('Thời điểm làm thêm')}>
                  {leaveTypes.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </CFormSelect>
                <CFormSelect label={requiredLabel('Ca áp dụng')}>
                  {leaveTypes.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </CFormSelect>
                <CFormTextarea label={requiredLabel('Lý do làm thêm')} rows={4} />
                <CFormSelect label={requiredLabel('Người duyệt')}>
                  {leaveTypes.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary">Hủy</CButton>
          <CButton color="primary">Gửi</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TimesheetOvertimeRequest
