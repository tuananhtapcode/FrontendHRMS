import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'
import { MyDatePicker } from '../../components/profileCreate/MyDatePicker'
import ReportBase from '.'

const statistics = ['Tính chất lao động', 'Loại hợp đồng']

const VaccinationStatus = () => {
  const [stat, setStat] = useState(statistics[0])
  const [toDate, setToDate] = useState(new Date())

  const ArgChildren = () => {
    return (
      <>
        <div style={{ marginBottom: 4, color: 'gray' }}>Thống kê theo</div>
        <CDropdown>
          <CDropdownToggle color="primary">{stat}</CDropdownToggle>
          <CDropdownMenu>
            {statistics.map((s, i) => (
              <CDropdownItem key={i} onClick={() => setStat(s)}>
                {s}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
        <MyDatePicker
          id="inputDateOfBirth"
          label="Đến ngày"
          selected={toDate}
          onChange={(date) => setToDate(date)}
        />
      </>
    )
  }

  return <ReportBase title="Báo cáo thống kê số lượng nhân sự" ArgChildren={ArgChildren} />
}

export default VaccinationStatus
