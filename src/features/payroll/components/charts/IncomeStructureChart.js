// src/features/payroll/components/charts/IncomeStructureChart.js

import { CChartDoughnut } from '@coreui/react-chartjs'

export default function IncomeStructureChart({ data }) {
  const labels = data.map((d) => d.label)
  const values = data.map((d) => d.value)

  return (
    <div style={{ height: 260, maxWidth: 380, margin: '0 auto' }}>
      <CChartDoughnut
        data={{
          labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12 },
            },
          },
        }}
      />
    </div>
  )
}
