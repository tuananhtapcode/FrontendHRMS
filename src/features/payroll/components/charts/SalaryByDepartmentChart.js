// src/features/payroll/components/charts/SalaryByDepartmentChart.js

import { CChartBar } from '@coreui/react-chartjs'

export default function SalaryByDepartmentChart({ data }) {
  const labels = data.map((d) => d.department)
  const values = data.map((d) => Math.round(d.avgSalary / 1000000)) // đổi sang triệu

  return (
    <div style={{ height: 260 }}>
      <CChartBar
        data={{
          labels,
          datasets: [
            {
              label: 'Lương bình quân (triệu)',
              data: values,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => `${value}tr`,
              },
            },
          },
        }}
      />
    </div>
  )
}
