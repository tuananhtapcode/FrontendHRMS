// src/features/payroll/components/charts/CurrentPeriodChartCard.js
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

const COLORS = ['#2eb85c', '#39a8ff', '#ffb547', '#f86c6b', '#6f42c1']

const capitalizeFirst = (str) =>
  !str ? '' : str.charAt(0).toUpperCase() + str.slice(1)


const formatVND = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
    : '-'

  
export default function CurrentPeriodChartCard({
  period,
  fundStructure,
  onViewDetail,
}) {
  if (!period) return null

  // Chuẩn hoá data cột
  const chartData = useMemo(() => {
    if (!Array.isArray(fundStructure)) return []
    return fundStructure.map((item, idx) => ({
      key: capitalizeFirst(item.label.replace('Lương ', '')), // "cơ bản", "phụ cấp"...
      label: item.label,
      value: item.value,
      color: COLORS[idx % COLORS.length],
    }))
  }, [fundStructure])

  const total = useMemo(
    () => chartData.reduce((sum, x) => sum + (x.value || 0), 0),
    [chartData],
  )

  // null = trạng thái tổng quát
  const [activeIndex, setActiveIndex] = useState(null)

  const active =
    activeIndex !== null && chartData[activeIndex]
      ? chartData[activeIndex]
      : null

  const activePercent =
    active && total > 0
      ? ((active.value / total) * 100).toFixed(1)
      : null

  const toggleActive = (idx) => {
    setActiveIndex((prev) => (prev === idx ? null : idx))
  }

  const handleViewDetail = () => {
    if (onViewDetail) onViewDetail(period)
    else console.log('Xem chi tiết kỳ lương:', period)
  }

  const isApproved =
    String(period.status || '').toLowerCase().includes('duyệt')

  return (
    <div className="period-card">
      {/* ==== BÊN TRÁI: BIỂU ĐỒ CỘT ==== */}
      <div className="period-card-chart">
        {chartData.length ? (
          <div
            className="period-card-chart-inner"
            tabIndex={-1} // tránh focus outline
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 0, left: 0, bottom: 18 }}
              >
                <XAxis
                  dataKey="key"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                  formatter={(v) => formatVND(v)}
                  labelFormatter={(label) => label}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  // KHÔNG dùng background để khỏi có cột xám
                  onClick={(_, idx) => toggleActive(idx)}
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={entry.key}
                      fill={entry.color}
                      stroke={idx === activeIndex ? '#111827' : 'none'}
                      strokeWidth={idx === activeIndex ? 2 : 0}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Tóm tắt dưới chart */}
            <div className="period-bar-summary">
              {active ? (
                <>
                  <div className="title">{active.label}</div>
                  <div className="line">
                    <span className="value">
                      {formatVND(active.value)}
                    </span>
                    {activePercent && (
                      <span className="percent">
                        Chiếm {activePercent}% tổng quỹ kỳ này
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="title">Tổng quỹ kỳ này</div>
                  <div className="line">
                    <span className="value">{formatVND(total)}</span>
                    <span className="percent">
                      Gồm {chartData.length} khoản thu nhập/khấu trừ
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="period-card-chart-empty">
            Chưa có dữ liệu cơ cấu kỳ lương.
          </div>
        )}
      </div>

      {/* ==== BÊN PHẢI: THÔNG TIN KỲ LƯƠNG ==== */}
      <div className="period-card-info">
        <div className="period-card-header">
          <div className="period-card-name">{period.name}</div>
          <span
            className={
              'period-card-status ' +
              (isApproved ? 'status-approved' : 'status-pending')
            }
          >
            {period.status}
          </span>
        </div>

        <div className="period-card-row">
          <span className="label">Thời gian:</span>
          <span className="value">{period.timeRange}</span>
        </div>
        <div className="period-card-row">
          <span className="label">Ngày chi trả dự kiến:</span>
          <span className="value">{period.paymentDate}</span>
        </div>
        <div className="period-card-row">
          <span className="label">Người phê duyệt:</span>
          <span className="value">{period.approver}</span>
        </div>
        <div className="period-card-row">
          <span className="label">Tổng thực chi:</span>
          <span className="value strong">
            {formatVND(period.totalPaid)}
          </span>
        </div>
        <div className="period-card-row">
          <span className="label">Nhân sự:</span>
          <span className="value">{period.headcount} người</span>
        </div>

        <div className="period-card-actions">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={handleViewDetail}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  )
}
