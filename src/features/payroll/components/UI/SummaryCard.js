import { CCard, CCardBody } from '@coreui/react'

export default function SummaryCard({ title, sub, value }) {
  return (
    <CCard className="summary-card shadow-sm border-0">
      <CCardBody>
        <div className="text-medium-emphasis small">{title}</div>
        {sub ? <div className="text-secondary small">{sub}</div> : null}
        <div className="fs-4 fw-bold mt-2">{value ?? '—'}</div>
      </CCardBody>
    </CCard>
  )
}
