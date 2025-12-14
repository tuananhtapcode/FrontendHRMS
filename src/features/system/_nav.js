import { cilAppsSettings, cilHistory, cilHome, cilSpeedometer } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Thông tin công ty',
    to: '/system/company-info/general-info',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'Quản lý danh mục',
    to: '/system/category/member',
    icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Nhật ký hoạt động',
    to: '/system/logs',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },
]

export default _nav
