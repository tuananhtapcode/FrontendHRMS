import {
  CBadge,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const HumanResourceStats = () => {
  const Item = ({ i, label, color, count }) => {
    return (
      <CListGroupItem key={i} className="d-flex justify-content-between align-items-center">
        {label}
        <CBadge color={color} shape="rounded-pill">
          {count}
        </CBadge>
      </CListGroupItem>
    )
  }

  const status = [
    { label: 'Chính thức', count: 26, color: 'primary' },
    { label: 'Thử việc', count: 8, color: 'info' },
    { label: 'Nghỉ thai sản', count: 2, color: 'warning' },
    { label: 'Khác', count: 5, color: 'secondary' },
  ]

  return (
    <>
      <CCard className="shadow-sm rounded-4 border-0">
        <CCardBody>
          <CCardTitle>Tổng số nhân viên</CCardTitle>
          <CCardText className="text-center fs-3 fw-bold">1000</CCardText>
        </CCardBody>
        <CListGroup flush>
          {status.map((s, i) => (
            <Item key={i} label={s.label} color={s.color} count={s.count} />
          ))}
        </CListGroup>
      </CCard>
    </>
  )
}

export default HumanResourceStats
