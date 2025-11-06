import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'
import { MyDatePicker } from '../../components/profileCreate/MyDatePicker'
import ReportBase from '.'
import { MyDropdown } from '../../components/common/MyComponents'

const deadlines = [
  'Hôm nay',
  'Tuần này',
  'Tháng này',
  'Ngày mai',
  'Tuần sau',
  'Tháng sau',
  'Tất cả',
  'Tùy chọn',
]
const states = ['Tất cả', 'Còn hạn', 'Quá hạn']

const EmployeeLackOfPaper = () => {
  const [deadline, setDealine] = useState(deadlines[6])
  const [state, setState] = useState(states[0])

  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const ArgChildren = () => {
    return (
      <>
        <MyDropdown
          title="Hạn nộp"
          defaultValue={deadline}
          items={deadlines}
          handleClick={setDealine}
        />
        <MyDropdown title="Trạng thái" defaultValue={state} items={states} handleClick={setState} />
        {/* <MyDatePicker
          id="inputDateOfBirth"
          label="Đến ngày"
          selected={toDate}
          onChange={(date) => setToDate(date)}
        /> */}
      </>
    )
  }

  return <ReportBase title="Báo cáo thống kê số lượng nhân sự" ArgChildren={ArgChildren} />
}

export default EmployeeLackOfPaper
