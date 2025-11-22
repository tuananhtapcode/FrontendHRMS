import {
  CCard,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
} from '@coreui/react'
import styles from './css.module.scss'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce'

const SearchableTable = ({
  columns = [],
  states = [],
  searchPlaceHolder = 'Tìm kiếm...',
  debounceTime = 1000,
  getAPI,
  searchAPI,
}) => {
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
        </CCol>
      </CRow>

      <CTable
        responsive
        columns={columns}
        items={data}
        striped
        bordered
        hover
        className={styles.customTable}
      />
    </CCard>
  )
}

export { SearchableTable }
