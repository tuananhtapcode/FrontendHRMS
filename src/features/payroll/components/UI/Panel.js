import { CCard, CCardBody, CCardHeader } from '@coreui/react'

export default function Panel({ title, subtitle, children }) {
  return (
    <CCard className="panel border-light shadow-sm">
      <CCardHeader className="bg-light">
        <div className="fw-semibold">{title}</div>
        {subtitle ? <div className="small text-medium-emphasis">{subtitle}</div> : null}
      </CCardHeader>
      <CCardBody>{children}</CCardBody>
    </CCard>
  )
}
