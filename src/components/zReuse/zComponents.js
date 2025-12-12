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
import { use, useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import { vi } from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
import ReactPaginate from 'react-paginate'

registerLocale('vi', vi)

const SearchableTable = ({
  columns = [],
  states = [],
  searchPlaceHolder = 'Tìm kiếm...',
  debounceTime = 1000,
  getAPI,
  searchAPI,
  deleteAPI,
  limit = 5,
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((col) => !col.hidden).map((col) => col.key),
  )
  const [state, setState] = useState((states && states[0]) || '')
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [selected, setSelected] = useState([])

  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  const editableColumns = [
    {
      key: '_select',
      label: (
        <CFormCheck
          checked={selected.length === data.length}
          onChange={() =>
            selected.length === data.length ? setSelected([]) : setSelected(data.map((i) => i.id))
          }
        />
      ),
      _props: {
        scope: 'col',
        style: {
          width: '40px',
          textAlign: 'center',
          position: 'sticky',
          left: 0,
          zIndex: 5, // để nó nổi lên trên mấy cột khác
          background: '#fff', // chống bị trong suốt khi scroll ngang
        },
      },
    },
    ...columns,
    {
      key: '_actions',
      label: 'Actions',
      _props: { scope: 'col', style: { width: '80px', textAlign: 'center' } },
    },
  ]

  const fetchData = async () => {
    try {
      const data = await getAPI(page, limit)
      // must data.data and data.totalPages

      const formatted = data.data.map((item) => ({
        ...item,
        _select: (
          <div
            style={{
              position: 'sticky',
              left: 0,
              background: '#fff',
              zIndex: 4,
              textAlign: 'center',
            }}
          >
            <CFormCheck
              checked={selected.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
            />
          </div>
        ),
        _actions: (
          <CDropdown>
            <CDropdownToggle color="light" size="sm">
              ⋮
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => onEdit(item)}>Sửa</CDropdownItem>
              <CDropdownItem className="text-danger" onClick={() => handleDelete(item)}>
                Xoá
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        ),
      }))
      setData(formatted)
      setPageCount(data.totalPages)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(async (value) => {
      console.log('Searching for: ', value)
      // call api
      try {
        const res = await searchAPI(value)

        const editableData = res.map((item) => ({
          ...item,
          _select: (
            <div
              style={{
                position: 'sticky',
                left: 0,
                background: '#fff',
                zIndex: 4,
                textAlign: 'center',
              }}
            >
              <CFormCheck
                checked={selected.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
            </div>
          ),
          _actions: (
            <CDropdown>
              <CDropdownToggle color="light" size="sm">
                ⋮
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => onEdit(item)}>Sửa</CDropdownItem>
                <CDropdownItem className="text-danger" onClick={() => handleDelete(item)}>
                  Xoá
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          ),
        }))

        setData(editableData)
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

  const toggleSelect = (key) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]))
  }

  const handlePageClick = (event) => {
    setPage(event.selected)
  }

  const handleDelete = async (item) => {
    try {
      const res = await deleteAPI(item)
      setPage(0)
      await fetchData()
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <CCard className="p-3">
      <CRow className="mb-3 align-items-center">
        {/* MENU TRÁI */}
        <CCol md={4} className="d-flex align-items-center">
          {searchAPI && (
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
          )}
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
              {columns.map((col, index) => (
                <CFormCheck
                  key={index}
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
        columns={editableColumns.filter(
          (col) => visibleColumns.includes(col.key) || col.key.startsWith('_'),
        )}
        items={data}
        striped
        bordered
        hover
        className={styles.customTable}
      />

      <ReactPaginate
        forcePage={page}
        previousLabel={'← Trước'}
        nextLabel={'Sau →'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={1} // hiển thị 1 page ở mép
        pageRangeDisplayed={3} // hiển thị 3 page ở giữa
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center gap-2 mt-4'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link px-3 py-1 border rounded hover:bg-gray-100'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link px-3 py-1 border rounded hover:bg-gray-100'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link px-3 py-1 border rounded'}
        activeClassName={'bg-blue-500 text-white'}
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

const FormDatePicker = ({ label, value, onChange }) => {
  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <div className={styles.mydatepickerwrapper}>
        <DatePicker
          className="form-control"
          locale="vi"
          selected={value}
          minDate={new Date()}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
        />
      </div>
    </>
  )
}

const FormTimePicker = ({ label, value, onChange }) => {
  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <div className={styles.mydatepickerwrapper}>
        <DatePicker
          className="form-control"
          selected={value}
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
