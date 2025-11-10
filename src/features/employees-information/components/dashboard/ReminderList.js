import { useState } from 'react'
import {
  CCard,
  CCardTitle,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CBadge,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
} from '@coreui/react'

const ReminderList = ({ className }) => {
  const [visible, setVisible] = useState(false)

  const Item = ({ i, label, color, count }) => (
    <CListGroupItem key={i} className="d-flex justify-content-between align-items-center">
      {label}
      <CBadge color={color ?? 'red'} shape="rounded-pill">
        {count}
      </CBadge>
    </CListGroupItem>
  )

  const data = {
    labels: [
      'Hết hạn hợp đồng',
      'Chưa ký hợp đồng',
      'NPT hết thời gian giảm trừ',
      'Sinh nhật',
      'Kỷ niệm ngày vào làm',
      'Giấy tờ hết hạn',
    ],
    datasets: [573, 7, 537, 14, 28, 20],
  }

  return (
    <>
      <CCard className={`shadow-sm rounded-4 border-0 ${className}`}>
        <CRow style={{ padding: 16 }}>
          <CCol>
            <CCardTitle>Nhắc việc</CCardTitle>
          </CCol>
          <CCol className="text-end">
            <CButton
              color="link"
              className="fs-6 text-decoration-underline fst-italic text-primary p-0"
              onClick={() => setVisible(true)}
            >
              Xem chi tiết
            </CButton>
          </CCol>
        </CRow>
        <CListGroup flush>
          {data.labels.map((label, i) => (
            <Item i={i} label={label} color="primary" count={data.datasets[i]} />
          ))}
        </CListGroup>
      </CCard>

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        size="xl"
        alignment="center"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Chi tiết nhắc việc</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Bạn có thể render chi tiết bảng, chart hoặc nội dung khác */}
          <CListGroup flush>
            {data.labels.map((label, i) => (
              <Item i={i} label={label} color="primary" count={data.datasets[i]} />
            ))}
          </CListGroup>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ReminderList
