import { cilChartPie, cilSettings, cilSpeedometer, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Tổng quan',
    to: '/employees-information/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Hồ sơ',
    to: '/employees-information/profile/view',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Báo cáo',
    to: '/employees-information/report/list',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Thiết lập',
    to: '/employees-information/setting',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tạo phòng ban',
        to: '/employees-information/setting/organization/departmental-structure',
      },
      {
        component: CNavItem,
        name: 'Vị trí công việc',
        to: '/employees-information/setting/organization/job-position',
      },
    ],
  },
]

export default _nav
