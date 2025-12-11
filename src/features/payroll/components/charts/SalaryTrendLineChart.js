import { CChartLine } from '@coreui/react-chartjs'
import { useMemo, useState } from 'react'

function SalaryTrendLineChart({ data, formatVND, onPeriodClick }) {
  if (!data || data.length === 0) return null

  // Lấy tối đa 12 kỳ gần nhất
  const recent = data.slice(-12)

  const labels = recent.map((d) => d.month)
  const totals = recent.map((d) => d.total)
  const avgs = recent.map((d) => d.avg ?? null)

  // Kỳ đang chọn (mặc định: kỳ mới nhất)
  const [activeIndex, setActiveIndex] = useState(recent.length - 1)

  const totalAll = useMemo(
    () => totals.reduce((sum, v) => sum + (v || 0), 0),
    [totals],
  )

  const active = recent[activeIndex] || recent[recent.length - 1]
  const prev =
    activeIndex > 0 ? recent[activeIndex - 1] : null

  const deltaTotal = prev ? active.total - prev.total : 0
  const deltaPercent =
    prev && prev.total
      ? ((deltaTotal / prev.total) * 100).toFixed(1)
      : null

  const isUp = deltaTotal > 0
  const isDown = deltaTotal < 0

  const colors = {
    total: '#2EB85C',
    totalFill: 'rgba(46, 184, 92, 0.12)',
    avg: '#39A8FF',
    avgFill: 'rgba(57, 168, 255, 0.08)',
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Tổng quỹ lương',
        data: totals,
        yAxisID: 'yTotal',
        borderColor: colors.total,
        backgroundColor: colors.totalFill,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
      {
        label: 'Lương bình quân',
        data: avgs,
        yAxisID: 'yAvg',
        borderColor: colors.avg,
        backgroundColor: colors.avgFill,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          font: { size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label || ''
            const val = ctx.parsed.y
            if (val == null) return label
            const money = formatVND ? formatVND(val) : val
            return `${label}: ${money}`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          font: { size: 11 },
        },
        grid: { display: false },
      },
      yTotal: {
        type: 'linear',
        position: 'left',
        ticks: { font: { size: 11 } },
        grid: { color: '#e9edef' },
      },
      yAvg: {
        type: 'linear',
        position: 'right',
        ticks: { font: { size: 11 } },
        grid: { drawOnChartArea: false },
      },
    },
    // CLICK VÀO 1 ĐIỂM TRÊN BIỂU ĐỒ
    onClick: (event, elements, chart) => {
      if (!elements || !elements.length) return
      const idx = elements[0].index
      setActiveIndex(idx)

      // Nếu parent truyền onPeriodClick thì gọi ra ngoài luôn
      if (typeof onPeriodClick === 'function') {
        const period = recent[idx]
        onPeriodClick({
          ...period,
          index: idx,
          totalAll,
        })
      }
    },
  }

  const fmt = (n) =>
    n == null ? '—' : (formatVND ? formatVND(n) : n.toLocaleString('vi-VN'))

  return (
    <div
      className="ovw-chart--line"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: 280,
      }}
    >
      {/* Biểu đồ */}
      <div style={{ flex: 1 }}>
        <CChartLine data={chartData} options={options} />
      </div>

      {/* Dòng tóm tắt KỲ ĐANG CHỌN */}
      {active && (
        <div
          style={{
            fontSize: 12,
            color: '#516174',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <div>
            <strong>Kỳ đang chọn: </strong>
            {active.month} · Tổng quỹ lương:{' '}
            <strong>{fmt(active.total)}</strong>
            {active.avg != null && (
              <>
                {' · '}Lương bình quân:{' '}
                <strong>{fmt(active.avg)}</strong>
              </>
            )}
          </div>

          {deltaPercent && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isUp
                  ? '#2EB85C'
                  : isDown
                  ? '#E55353'
                  : '#8A98A9',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>
                {isUp && '↑'}
                {isDown && '↓'}
                {!isUp && !isDown && '→'}
              </span>
              <span>
                {Math.abs(deltaPercent)}% so với kỳ trước
              </span>
            </div>
          )}
        </div>
      )}

      {!active && (
        <div
          style={{
            fontSize: 12,
            color: '#8A98A9',
            marginTop: 4,
          }}
        >
          Nhấn vào 1 điểm trên biểu đồ để xem chi tiết kỳ lương.
        </div>
      )}
    </div>
  )
}

export default SalaryTrendLineChart
