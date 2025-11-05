import { CChart } from '@coreui/react-chartjs'
import { useEffect, useRef } from 'react'
import { getStyle } from '@coreui/utils'
import { CCard, CCardBody, CCardSubtitle, CCardTitle } from '@coreui/react'

const EmployeeStructureChart = ({ title }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current
      if (chartInstance) {
        const { options } = chartInstance

        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle('--cui-body-color')
        }

        chartInstance.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  const data = {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10],
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        },
      },
    },
  }

  const today = new Date()

  return (
    <CCard style={{ padding: 16 }}>
      <CCardTitle>{title}</CCardTitle>
      <CCardSubtitle className="mb-2 text-body-secondary">
        Tất cả đơn vị - Đến ngày {today.toLocaleDateString()}
      </CCardSubtitle>
      <CCardBody>
        {data?.datasets?.[0]?.data?.length ? (
          <CChart type="doughnut" data={data} options={options} ref={chartRef} />
        ) : (
          <div className="text-center text-muted py-5">Không có dữ liệu</div>
        )}{' '}
      </CCardBody>
    </CCard>
  )
}

export default EmployeeStructureChart
