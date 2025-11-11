import { CCol, CRow } from '@coreui/react'

export default function GaugeCard({ percent = 0, plan = 0, actual = 0 }) {
  const p = Math.max(0, Math.min(100, percent))
  const totalDash = 376 // xấp xỉ nửa chu vi arc để dùng strokeDasharray

  return (
    <CRow className="align-items-center">
      <CCol xs={12} md={8}>
        <svg width="100%" height="160" viewBox="0 0 300 160">
          <path d="M30,130 A120,120 0 0 1 270,130" fill="none" stroke="#eee" strokeWidth="18" />
          <path
            d="M30,130 A120,120 0 0 1 270,130"
            fill="none"
            stroke="#2eb85c"
            strokeWidth="18"
            strokeDasharray={`${(p / 100) * totalDash} ${totalDash}`}
          />
          <text x="150" y="100" textAnchor="middle" fontSize="20" fontWeight="700">{p}%</text>
          <text x="30"  y="145" fontSize="12" fill="#666">0%</text>
          <text x="270" y="145" textAnchor="end" fontSize="12" fill="#666">100%</text>
        </svg>
      </CCol>
      <CCol xs={12} md={4}>
        <div className="small mb-1">Kế hoạch: <strong>{plan}</strong></div>
        <div className="small mb-1">Thực hiện: <strong>{actual}</strong></div>
        <div className="small">Chênh lệch: <strong>{plan - actual}</strong></div>
      </CCol>
    </CRow>
  )
}
