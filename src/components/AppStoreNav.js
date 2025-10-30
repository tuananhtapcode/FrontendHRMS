import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CContainer, CNavLink } from '@coreui/react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import 'simplebar-react/dist/simplebar.min.css'

export const AppStoreNav = ({ items }) => {
  const app = (item, index) => {
    return (
      <CNavLink key={index} as={NavLink} to={item.to} className="app-card">
        <CCard
          className="text-center hover-app"
          style={{
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          <CCardBody style={{ paddingLeft: 4, paddingRight: 4, paddingBottom: 0 }}>
            <CIcon icon={item.icon} customClassName="app-icon" />
            <div className="mt-2" style={{ fontSize: 14 }}>
              {item.name}
            </div>
          </CCardBody>
        </CCard>
      </CNavLink>
    )
  }

  return (
    <CContainer className="app-store-grid">
      {items && items.map((item, index) => app(item, index))}
    </CContainer>
  )
}

AppStoreNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
