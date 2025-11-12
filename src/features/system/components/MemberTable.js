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
import styles from '../css.module.scss'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { useMemo, useState } from 'react'

const states = ['Tất cả', 'Đang làm việc', 'Đã nghỉ việc']

const MemberTable = ({ data, columns }) => {
  const [state, setState] = useState(states[0])
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (state !== 'Tất cả' && item.status !== state) return false

      const keyword = search.toLowerCase()
      return (
        item.fullName?.toLowerCase().includes(keyword) ||
        item.personalEmail?.toLowerCase().includes(keyword) ||
        item.phoneNumber?.toLowerCase().includes(keyword)
      )
    })
  }, [data, search, state])

  console.log(filteredData)

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
              placeholder="Tìm kiếm theo tên, email, số điện thoại"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CInputGroup>
        </CCol>

        {/* MENU PHẢI */}
        <CCol md={8} className="d-flex justify-content-end align-items-center">
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
        </CCol>
      </CRow>

      <CTable
        responsive
        columns={columns}
        items={filteredData}
        striped
        bordered
        hover
        className={styles.customTable}
      />
    </CCard>
  )
}

export { MemberTable }
