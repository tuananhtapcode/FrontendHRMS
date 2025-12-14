import {
  CBadge,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger']

const HumanResourceStats = ({ data }) => {
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
  return (
    <>
      <CCard className="shadow-sm rounded-4 border-0">
        <CCardBody>
          <CCardTitle>Tổng số nhân viên</CCardTitle>
          <CCardText className="text-center fs-3 fw-bold">1000</CCardText>
        </CCardBody>
        <CListGroup flush>
          {data.map((s, i) => (
            <Item key={i} label={s.label} color={colors[i]} count={s.count} />
          ))}
        </CListGroup>
      </CCard>
    </>
  )
}

export default HumanResourceStats
