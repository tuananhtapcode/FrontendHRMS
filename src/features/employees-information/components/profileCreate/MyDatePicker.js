import DatePicker from 'react-datepicker'

export const MyDatePicker = ({ id, label, selected, onChange }) => {
  return (
    <>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        className="form-control"
        wrapperClassName="d-block"
      />
    </>
  )
}
