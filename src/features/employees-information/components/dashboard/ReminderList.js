import { CCard, CCardTitle, CCol, CListGroup, CListGroupItem, CRow, CBadge } from '@coreui/react'

const ReminderList = () => {
  const Item = ({ i, label, color, count }) => {
    return (
      <CListGroupItem key={i} className="d-flex justify-content-between align-items-center">
        {label}
        <CBadge color={color ?? 'red'} shape="rounded-pill">
          {count}
        </CBadge>
      </CListGroupItem>
    )
  }

  const data = {
    labels: [
      'Hết hạn hợp đồng',
      'Chưa ký hợp đồng',
      'NPT hết thời gian giảm trừ',
      'Sinh nhật',
      'Kỳ niệm ngày vào làm',
      'Giấy tờ hết hạn',
    ],
    datasets: [573, 7, 537, 14, 28, 20],
  }

  return (
    <CCard>
      <CRow style={{ padding: 16 }}>
        <CCol>
          <CCardTitle>Nhắc việc</CCardTitle>
        </CCol>
        <CCol>
          <CCardTitle className="text-end fs-6 text-decoration-underline fst-italic text-primary">
            Xem chi tiết
          </CCardTitle>
        </CCol>
      </CRow>
      <CListGroup flush>
        {data.labels.map((label, i) => (
          <Item i={i} label={label} color="primary" count={data.datasets[i]} />
        ))}
      </CListGroup>
    </CCard>
  )
}

export default ReminderList
