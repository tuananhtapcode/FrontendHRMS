// src/features/payroll/components/charts/AvgIncomeByUnitChart.js

import { CChartBar } from '@coreui/react-chartjs'

export default function AvgIncomeByUnitChart({ data }) {
  const labels = data.map((d) => d.unit)
  const values = data.map((d) => d.value)

  return (
    <div style={{ height: 220 }}>
      <CChartBar
        data={{
          labels,
          datasets: [
            {
              label: 'Thu nhập bình quân (triệu)',
              data: values,
            },
          ],
        }}
        options={{
          indexAxis: 'y', // Bar ngang
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
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
