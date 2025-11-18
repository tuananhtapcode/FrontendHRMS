// src/features/payroll/components/charts/AvgIncomeTimeChart.js

import { CChartLine } from '@coreui/react-chartjs'

export default function AvgIncomeTimeChart({ data }) {
  const labels = data.map((d) => d.month)
  const values = data.map((d) => d.value)

  return (
    <div style={{ height: 240 }}>
      <CChartLine
        data={{
          labels,
          datasets: [
            {
              label: 'Thu nhập bình quân (triệu)',
              data: values,
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: {
                callback: (v) => `${v}tr`,
              },
            },
          },
        }}
      />
    </div>
  )
}
