// src/features/payroll/components/charts/FundStructurePie.js

import { CChartPie } from '@coreui/react-chartjs'

export default function FundStructurePie({ data }) {
  const labels = data.map((d) => d.label)
  const values = data.map((d) => Math.abs(d.value)) // lấy trị tuyệt đối để vẽ tỷ trọng

  return (
    <div style={{ height: 260 }}>
      <CChartPie
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
              position: 'bottom',
              labels: { boxWidth: 14 },
            },
          },
        }}
      />
    </div>
  )
}
