// src/features/payroll/components/charts/SalaryTrendLine.js

import { CChartLine } from '@coreui/react-chartjs'

export default function SalaryTrendLine({ data }) {
  const labels = data.map((d) => d.month)
  const total = data.map((d) => Math.round(d.total / 1_000_000)) // triệu
  const avg   = data.map((d) => Math.round(d.avg / 1_000_000))   // triệu

  return (
    <div style={{ height: 260 }}>
      <CChartLine
        data={{
          labels,
          datasets: [
            {
              label: 'Tổng quỹ lương (triệu)',
              data: total,
              borderWidth: 2,
              tension: 0.3,
            },
            {
              label: 'Lương bình quân (triệu)',
              data: avg,
              borderWidth: 2,
              borderDash: [4, 4],
              tension: 0.3,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
          },
          scales: {
            y: {
              ticks: {
                callback: (v) => `${v} tr`,
              },
            },
          },
        }}
      />
    </div>
  )
}
