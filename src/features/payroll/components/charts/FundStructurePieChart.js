// src/features/payroll/components/charts/FundStructurePieChart.js
import { useMemo, useState } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts'

const COLORS = ['#2eb85c', '#39a8ff', '#ffb547', '#f86c6b', '#6f42c1']

const formatVND = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
    : '-'

// shape dùng để vẽ miếng đang được chọn (phóng to + viền ngoài)
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props

  return (
    <g>
      {/* miếng donut phóng to */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* viền ngoài mờ mờ cho đẹp */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.25}
      />
    </g>
  )
}

export default function FundStructurePieChart({ data, height = 260 }) {
  // null = trạng thái tổng quát (không focus mục nào)
  const [activeIndex, setActiveIndex] = useState(null)

  // chuẩn hoá data + gán màu
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || !data.length) return []
    return data.map((item, idx) => ({
      ...item,
      color: COLORS[idx % COLORS.length],
    }))
  }, [data])

  const total = useMemo(
    () => chartData.reduce((sum, x) => sum + (x.value || 0), 0),
    [chartData],
  )

  const active =
    activeIndex !== null && chartData[activeIndex]
      ? chartData[activeIndex]
      : null

  const activePercent =
    active && total > 0
      ? ((active.value / total) * 100).toFixed(1)
      : null

  // click vào 1 miếng / legend:
  //   - nếu đang chọn miếng đó => bỏ chọn (quay về tổng quát)
  //   - nếu khác => chọn miếng mới
  const toggleActive = (idx) => {
    setActiveIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="fund-card">
      {/* BÊN TRÁI: donut */}
      <div className="fund-card-left">
        <div className="fund-card-donut">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={2}
                  minAngle={5} // mỗi miếng tối thiểu 5 độ cho đỡ bị mất hút
                  activeIndex={activeIndex ?? -1}
                  activeShape={renderActiveShape}
                  onClick={(_, idx) => toggleActive(idx)}
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatVND(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="fund-card-empty">
              Chưa có dữ liệu quỹ lương.
            </div>
          )}

          {/* Tổng quỹ lương ở giữa donut */}
          <div className="fund-card-center">
            <div className="label">Tổng quỹ lương</div>
            <div className="value">{formatVND(total)}</div>
          </div>
        </div>
      </div>

      {/* BÊN PHẢI: legend + chi tiết mục đang chọn */}
      <div className="fund-card-right">
        <div className="fund-card-legend">
          {chartData.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              className={
                'fund-card-legend-item' +
                (idx === activeIndex ? ' is-active' : '')
              }
              onClick={() => toggleActive(idx)}
            >
              <span
                className="dot"
                style={{ backgroundColor: item.color }}
              />
              <span className="name">{item.label}</span>
              <span className="value">
                {formatVND(item.value)}
                {total > 0 && (
                  <>
                    {' '}
                    ·{' '}
                    {((item.value / total) * 100).toFixed(1)}
                    %
                  </>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* text chi tiết mục đang xem */}
        {active ? (
          <div className="fund-card-active">
            Đang xem:{' '}
            <strong>{active.label}</strong>
            {activePercent && (
              <>
                {' '}
                – <strong>{activePercent}%</strong> tổng quỹ
                lương
              </>
            )}
          </div>
        ) : (
          // trạng thái tổng quát
          <div className="fund-card-active">
            Đang xem: <strong>Tất cả khoản thu nhập / khấu trừ</strong>
          </div>
        )}

        <div className="fund-card-hint">
          Nhấn vào 1 phần trên biểu đồ hoặc legend để xem chi tiết.
          Nhấn lại lần nữa để quay về tổng quát.
        </div>
      </div>
    </div>
  )
}
