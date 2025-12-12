import {
  CCard,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
} from '@coreui/react'
import styles from './css.module.scss'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilSettings } from '@coreui/icons'
import { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import { vi } from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('vi', vi)

const SearchableTable = ({
  columns = [],
  states = [],
  searchPlaceHolder = 'Tìm kiếm...',
  debounceTime = 1000,
  getAPI,
  searchAPI,
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((col) => !col.hidden).map((col) => col.key),
  )
  const [state, setState] = useState((states && states[0]) || '')
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI()
        setData(res)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(async (value) => {
      console.log('Searching for: ', value)
      // call api
      try {
        const res = await searchAPI(value)
        setData(res)
      } catch (err) {
        console.error(err)
      }
    }, debounceTime),
    [],
  )

  const handleSearch = (text) => {
    setSearch(text)
    if (text.length > 0) {
      debounceSearch(text)
    }
  }

  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key],
    )
  }

  return (
    <CCard className="p-3">
      <CRow className="mb-3 align-items-center">
        {/* MENU TRÁI */}
        <CCol md={4} className="d-flex align-items-center">
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder={`${searchPlaceHolder}`}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </CInputGroup>
        </CCol>

        {/* MENU PHẢI */}
        <CCol md={8} className="d-flex justify-content-end align-items-center">
          {states.length > 0 && (
            <>
              <CFormLabel className="me-2 mb-0">Trạng thái</CFormLabel>
              <CDropdown>
                <CDropdownToggle color="secondary">{state}</CDropdownToggle>
                <CDropdownMenu>
                  {states.map((value) => (
                    <CDropdownItem key={value} onClick={() => setState(value)}>
                      {value}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </>
          )}
          <CDropdown>
            <CDropdownToggle color="info">
              <CIcon icon={cilSettings} />
            </CDropdownToggle>

            <CDropdownMenu
              style={{
                padding: '8px 12px',
                minWidth: '240px',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <div className="fw-bold text-muted small mb-2">Tùy chỉnh cột hiển thị</div>
              {columns.map((col) => (
                <CFormCheck
                  label={col.label}
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => toggleColumn(col.key)}
                  style={{ cursor: 'pointer' }}
                  className="me-2"
                />
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>

      <CTable
        responsive
        columns={columns.filter((col) => visibleColumns.includes(col.key))}
        items={data}
        striped
        bordered
        hover
        className={styles.customTable}
      />
    </CCard>
  )
}

const EmployeeCard = ({ title, quantity, icon, backgroundIcon }) => {
  return (
    <CCard
      className="p-3 d-flex flex-row justify-content-between align-items-center shadow-sm rounded-3"
      style={{ minHeight: 120 }}
    >
      <div>
        <h6 className="text-muted mb-1">{title}</h6>
        <h3 className="fw-bold mb-0">{quantity}</h3>
      </div>
      <div
        className="d-flex justify-content-center align-items-center rounded-circle"
        style={{
          width: 50,
          height: 50,
          background: backgroundIcon,
        }}
      >
        <CIcon icon={icon} size="xl" />
      </div>
    </CCard>
  )
}

const FormDateTimePicker = ({ label, selectedDate, selectedTime, onChangeDate, onChangeTime }) => {
  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <div className={styles.mydatepickerwrapper}>
        <div style={{ flex: 7 }}>
          <DatePicker
            className="form-control"
            locale="vi"
            selected={selectedDate}
            minDate={new Date()}
            onChange={onChangeDate}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div style={{ flex: 3 }}>
          <DatePicker
            className="form-control"
            selected={selectedTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Giờ"
            onChange={onChangeTime}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </div>
      </div>
    </>
  )
}

const FormDatePicker = ({ label, selected, onChange }) => {
  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <div className={styles.mydatepickerwrapper}>
        <DatePicker
          className="form-control"
          locale="vi"
          selected={selected}
          minDate={new Date()}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
        />
      </div>
    </>
  )
}

const FormTimePicker = ({ label, selected, onChange }) => {
  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <div className={styles.mydatepickerwrapper}>
        <DatePicker
          className="form-control"
          selected={selected}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Giờ"
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          onChange={onChange}
        />
      </div>
    </>
  )
}

const requiredLabel = (label) => {
  return (
    <>
      {label} <span style={{ color: 'red' }}>*</span>
    </>
  )
}

export {
  EmployeeCard,
  SearchableTable,
  FormDateTimePicker,
  FormDatePicker,
  FormTimePicker,
  requiredLabel,
}
