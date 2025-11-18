// src/features/payroll/components/charts/BudgetByMonthChart.js

import { CChartLine } from '@coreui/react-chartjs'

export default function BudgetByMonthChart({ data }) {
  const labels = data.map((d) => d.month)
  const plan = data.map((d) => d.plan)
  const actual = data.map((d) => d.actual)

  return (
    <div style={{ height: 260 }}>
      <CChartLine
        data={{
          labels,
          datasets: [
            {
              label: 'Kế hoạch',
              data: plan,
              borderWidth: 2,
              tension: 0.3,
            },
            {
              label: 'Thực hiện',
              data: actual,
              borderWidth: 2,
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
                callback: (v) => `${v}`,
              },
            },
          },
        }}
      />
    </div>
  )
}
