import { CButton } from '@coreui/react'
import GaugeCard from './GaugeCard'

// helper format tiền
const formatVND = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
    : '—'

const riskMeta = (risk = 'low') => {
  const r = String(risk).toLowerCase()
  if (r === 'high') {
    return { label: 'Nguy cơ cao', cls: 'risk-high' }
  }
  if (r === 'medium') {
    return { label: 'Nguy cơ trung bình', cls: 'risk-medium' }
  }
  return { label: 'Nguy cơ thấp', cls: 'risk-low' }
}

export default function BudgetCard({
  budget,
  onViewDetail,
  onOpenReport,
  onSetupAlert,
}) {
  if (!budget) return null

  const { percent = 0, plan = 100, actual = 0, topCosts = [], forecast } = budget
  const risk = riskMeta(forecast?.risk)

  return (
    <div className="budget-card">
      {/* 1) Gauge */}
      <div className="budget-card__gauge">
        <GaugeCard percent={percent} plan={plan} actual={actual} />
      </div>

      {/* 2) Top khoản tăng chi */}
      <div className="budget-card__section">
        <div className="budget-card__title">
          Top khoản tăng chi
        </div>

        {topCosts?.length ? (
          <div className="budget-card__list">
            {topCosts.map((c, i) => {
              const up = (c.delta ?? 0) >= 0
              return (
                <div className="budget-card__row" key={i}>
                  <div className="left">
                    <div className="label">{c.label}</div>
                    <div className="value">{formatVND(c.value)}</div>
                  </div>
                  <div className={`delta ${up ? 'is-up' : 'is-down'}`}>
                    {up ? '+' : ''}
                    {c.delta ?? 0}%
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="budget-card__empty-mini">
            Chưa có dữ liệu phân rã chi phí.
          </div>
        )}
      </div>

      {/* 3) Dự báo cuối kỳ */}
      <div className="budget-card__section">
        <div className="budget-card__title">
          Dự báo cuối kỳ
        </div>

        {forecast ? (
          <div className="budget-card__forecast">
            <div className="forecast-left">
              <div className="forecast-big">
                {forecast.endPercent ?? '—'}%
              </div>
              <div className={`forecast-risk ${risk.cls}`}>
                {risk.label}
              </div>
            </div>
            <div className="forecast-right">
              <div className="forecast-note">
                {forecast.note || 'Chưa có ghi chú.'}
              </div>
              <div className="forecast-hint">
                Nếu giữ tốc độ hiện tại, ngân sách có thể đạt{' '}
                <strong>{forecast.endPercent}%</strong> vào cuối kỳ.
              </div>
            </div>
          </div>
        ) : (
          <div className="budget-card__empty-mini">
            Chưa có mô hình dự báo.
          </div>
        )}
      </div>

      {/* 4) Quick actions */}
      <div className="budget-card__actions">
        <CButton
          color="link"
          size="sm"
          className="px-0"
          onClick={onViewDetail}
        >
          Xem chi tiết ngân sách
        </CButton>
        <span className="dot-sep">•</span>
        <CButton
          color="link"
          size="sm"
          className="px-0"
          onClick={onOpenReport}
        >
          Báo cáo chi phí
        </CButton>
        <span className="dot-sep">•</span>
        <CButton
          color="link"
          size="sm"
          className="px-0"
          onClick={onSetupAlert}
        >
          Thiết lập cảnh báo
        </CButton>
      </div>
    </div>
  )
}
