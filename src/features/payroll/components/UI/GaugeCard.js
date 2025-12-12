// src/features/payroll/components/UI/GaugeCard.js
import { CBadge, CCol, CRow } from '@coreui/react'
import clsx from 'clsx'

// helper format number
const formatNumber = (n) =>
  typeof n === 'number' ? new Intl.NumberFormat('vi-VN').format(n) : '—'

// status rules
function getBudgetStatus(percent) {
  if (percent >= 100) {
    return { key: 'over', label: 'Vượt ngân sách' }
  }
  if (percent >= 85) {
    return { key: 'warning', label: 'Cần theo dõi' }
  }
  return { key: 'good', label: 'Đúng kế hoạch' }
}

export default function GaugeCard({
  // bạn có thể chỉ truyền plan/actual, không cần percent
  percent,
  plan = 0,
  actual = 0,

  // nâng cấp UX
  titlePlan = 'Kế hoạch',
  titleActual = 'Thực hiện',
  titleDelta = 'Chênh lệch',
  unit = '', // ví dụ: 'tỷ', 'đ', '%'...

  // hiển thị dạng tiền
  isMoney = false,

  // cho phép override mô tả
  hint,
}) {
  const computedPercent =
    typeof percent === 'number'
      ? percent
      : plan > 0
      ? Math.round((actual / plan) * 100)
      : 0

  const p = Math.max(0, Math.min(999, computedPercent))
  const safeP = Math.min(100, p)

  const delta = typeof plan === 'number' && typeof actual === 'number'
    ? plan - actual
    : null

  const status = getBudgetStatus(p)

  const totalDash = 376

  const displayValue = (n) => {
    if (n == null) return '—'
    if (isMoney) return formatNumber(n) + ' đ'
    return unit ? `${formatNumber(n)} ${unit}` : formatNumber(n)
  }

  return (
    <div className="gauge-card">
      <CRow className="align-items-center g-3">
        {/* LEFT: Gauge */}
        <CCol xs={12} md={7}>
          <div className="gauge-card__visual">
            <svg width="100%" height="180" viewBox="0 0 320 180">
              {/* track */}
              <path
                d="M40,140 A120,120 0 0 1 280,140"
                fill="none"
                className="gauge-card__track"
                strokeWidth="18"
              />

              {/* progress */}
              <path
                d="M40,140 A120,120 0 0 1 280,140"
                fill="none"
                className={clsx(
                  'gauge-card__progress',
                  `is-${status.key}`,
                )}
                strokeWidth="18"
                strokeDasharray={`${(safeP / 100) * totalDash} ${totalDash}`}
              />

              {/* center percent */}
              <text
                x="160"
                y="105"
                textAnchor="middle"
                className="gauge-card__percent"
              >
                {safeP}%
              </text>

              {/* min/max */}
              <text x="40" y="160" className="gauge-card__min">0%</text>
              <text x="280" y="160" textAnchor="end" className="gauge-card__max">
                100%
              </text>
            </svg>

            {/* status badge */}
            <div className="gauge-card__badge">
              <CBadge
                className={clsx('gauge-card__badge-chip', `is-${status.key}`)}
              >
                {status.label}
              </CBadge>
            </div>
          </div>
        </CCol>

        {/* RIGHT: Numbers */}
        <CCol xs={12} md={5}>
          <div className="gauge-card__meta">
            <div className="gauge-card__row">
              <span className="lbl">{titlePlan}</span>
              <span className="val">{displayValue(plan)}</span>
            </div>

            <div className="gauge-card__row">
              <span className="lbl">{titleActual}</span>
              <span className="val strong">{displayValue(actual)}</span>
            </div>

            <div className="gauge-card__row">
              <span className="lbl">{titleDelta}</span>
              <span
                className={clsx(
                  'val',
                  'delta',
                  delta != null && delta < 0 && 'is-negative',
                )}
              >
                {delta == null ? '—' : displayValue(delta)}
              </span>
            </div>

            <div className="gauge-card__divider" />

            <div className="gauge-card__hint">
              {hint ||
                (status.key === 'over'
                  ? 'Đã vượt mức kế hoạch. Cần rà soát các khoản tăng đột biến.'
                  : status.key === 'warning'
                  ? 'Tiệm cận ngưỡng kế hoạch. Theo dõi các bộ phận chi phí cao.'
                  : 'Đang theo đúng kế hoạch ngân sách.')}
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  )
}
