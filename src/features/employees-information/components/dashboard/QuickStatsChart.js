import { cilArrowTop, cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'

const QuickStatsChart = ({ title, color, data }) => {
  return (
    <CWidgetStatsA
      color={color}
      value={data}
      title={title}
      action={
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            <CIcon icon={cilOptions} />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Tuần này</CDropdownItem>
            <CDropdownItem>Tháng này</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      chart={
        <CChartLine
          className="mt-3"
          style={{ height: '70px' }}
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [78, 81, 80, 45, 34, 12, 40],
                fill: true,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
            elements: {
              line: {
                borderWidth: 2,
                tension: 0.4,
              },
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }}
        />
      }
    />
  )
}

export default QuickStatsChart
