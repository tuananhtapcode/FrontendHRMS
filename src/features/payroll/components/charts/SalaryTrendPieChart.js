// src/features/payroll/components/charts/SalaryTrendPieChart.js
import { CChartDoughnut } from '@coreui/react-chartjs'
import { useMemo, useState } from 'react'

function SalaryTrendPieChart({ data, formatVND }) {
  if (!data || data.length === 0) return null

  // Lấy 6 tháng gần nhất
  const recent = data.slice(-6)

  const labels = recent.map((d) => d.month)
  const values = recent.map((d) => d.total)

  const [activeIndex, setActiveIndex] = useState(null)

  const totalAll = useMemo(
    () => values.reduce((sum, v) => sum + v, 0),
    [values],
  )

  const colors = [
    '#2EB85C',
    '#39A8FF',
    '#321FDB',
    '#F9B115',
    '#E55353',
    '#8A63D2',
  ]

  // dataset cho chart – viền dày hơn nếu đang được chọn
  const dataset = {
    data: values,
    backgroundColor: labels.map((_, i) => colors[i % colors.length]),
    borderWidth: labels.map((_, i) => (i === activeIndex ? 3 : 0)),
    borderColor: labels.map((_, i) =>
      i === activeIndex ? '#111827' : 'transparent',
    ),
  }

  const chartData = {
    labels,
    datasets: [dataset],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    layout: { padding: 0 },
    plugins: {
      legend: {
        display: false, // dùng legend custom bên phải
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || ''
            const val = ctx.parsed
            if (typeof val !== 'number') return label
            const percent = totalAll
              ? ((val / totalAll) * 100).toFixed(1)
              : 0
            const money = formatVND ? formatVND(val) : val
            return `${label}: ${money} (${percent}%)`
          },
        },
      },
    },
    // click vào slice
    onClick: (_evt, elements) => {
      if (!elements || !elements.length) {
        setActiveIndex(null)
        return
      }
      const idx = elements[0].index
      setActiveIndex(idx)
    },
  }

  const totalText = formatVND
    ? formatVND(totalAll)
    : totalAll.toLocaleString('vi-VN')

  const selected =
    activeIndex != null ? recent[activeIndex] : null
  const selectedPercent =
    selected && totalAll
      ? ((selected.total / totalAll) * 100).toFixed(1)
      : null

  return (
    <div
      className="ovw-chart--donut"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        height: 260,
      }}
    >
      {/* TRÁI: Tổng quỹ lương + donut */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
          <div
            style={{
              fontSize: 14,
              color: '#8A98A9',
              fontWeight: 500,
            }}
          >
            Tổng quỹ lương
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#1F2D3D',
              fontWeight: 700,
            }}
          >
            {totalText}
          </div>
        </div>

        <div
          style={{
            width: 220,
            height: 220,
          }}
        >
          <CChartDoughnut
            data={chartData}
            options={options}
          />
        </div>
      </div>

      {/* PHẢI: Legend + chi tiết kỳ lương được chọn */}
      <div style={{ minWidth: 280 }}>
        <div
          style={{
            fontSize: 13,
            color: '#8A98A9',
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Các kỳ lương
        </div>

        {/* Legend 2 cột */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            rowGap: 10,
            columnGap: 32,
            marginBottom: 12,
          }}
        >
          {labels.map((label, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={label}
                type="button"
                onClick={() =>
                  setActiveIndex(
                    isActive ? null : idx,
                  )
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 13,
                  color: isActive ? '#111827' : '#516174',
                  fontWeight: isActive ? 600 : 400,
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor:
                      colors[idx % colors.length],
                    marginRight: 8,
                  }}
                />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        {/* Box chi tiết */}
        <div
          style={{
            padding: 10,
            borderRadius: 8,
            background: '#f7f8f9',
            border: '1px solid #e6e7e9',
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          {selected ? (
            <>
              <div>
                <strong>Kỳ lương: </strong>
                {selected.month}
              </div>
              <div>
                <strong>Tổng quỹ lương: </strong>
                {formatVND
                  ? formatVND(selected.total)
                  : selected.total}
              </div>
              {selected.avg != null && (
                <div>
                  <strong>Lương bình quân: </strong>
                  {formatVND
                    ? formatVND(selected.avg)
                    : selected.avg}
                </div>
              )}
              {selectedPercent && (
                <div>
                  <strong>Tỷ trọng: </strong>
                  {selectedPercent} % tổng quỹ
                </div>
              )}
            </>
          ) : (
            <span style={{ color: '#8A98A9' }}>
              Nhấn vào 1 kỳ lương trên biểu đồ để xem
              chi tiết.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalaryTrendPieChart
