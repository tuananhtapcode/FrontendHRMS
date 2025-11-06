import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const MyDatePicker = ({ id, label, selected, onChange }) => {
  return (
    <>
      <div className="form-label" htmlFor={id}>
        {label}
      </div>
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        className="form-control"
        wrapperClassName="d-block"
        dateFormat="dd/MM/yyyy"
      />
    </>
  )
}
