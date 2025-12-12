import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'

const MyDropdown = ({ title, defaultValue, items, handleClick }) => {
  return (
    <div style={{ marginBottom: 12 }}>
      {title && <div style={{ marginBottom: 4, color: 'gray', fontSize: 14 }}>{title}</div>}
      <CDropdown>
        <CDropdownToggle color="primary" className="d-flex align-items-center gap-2 fw-bold">
          <CIcon icon={cilFilter} /> {defaultValue}
        </CDropdownToggle>
        <CDropdownMenu>
          {items.map((item, index) => (
            <CDropdownItem key={index} onClick={() => handleClick(item)}>
              {item}
            </CDropdownItem>
          ))}
        </CDropdownMenu>
      </CDropdown>
    </div>
  )
}

export { MyDropdown }
