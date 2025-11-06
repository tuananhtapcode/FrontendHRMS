import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'
import { MyDatePicker } from '../../components/profileCreate/MyDatePicker'
import ReportBase from '.'

const EmployeeRetirement = () => {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const ArgChildren = () => {
    return (
      <>
        <MyDatePicker
          id="inputFromDate"
          label="Từ ngày"
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
        />
        <MyDatePicker
          id="inputToDate"
          label="Đến ngày"
          selected={toDate}
          onChange={(date) => setToDate(date)}
        />
      </>
    )
  }

  return (
    <ReportBase title="Báo cáo thống kê nhân viên đến tuổi nghỉ hưu" ArgChildren={ArgChildren} />
  )
}

export default EmployeeRetirement
