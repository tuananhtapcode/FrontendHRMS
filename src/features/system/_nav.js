import { cilAppsSettings, cilChartPie, cilHome, cilSpeedometer, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Thông tin công ty',
    to: '/system/company-info/general-info',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Quản lý danh mục',
    to: '/system/category/member',
    icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Báo cáo',
  //   to: '/employees-information/report/list',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
]

export default _nav