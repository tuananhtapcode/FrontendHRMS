import {
  cibOpsgenie,
  cilFingerprint,
  cilNotes,
  cilObjectGroup,
  cilPaw,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilWallet,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Tổng quan',
    to: '/employee/overview',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Hồ sơ',
    to: '/employee/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Chấm công',
    to: '/employee/timesheet',
    icon: <CIcon icon={cilFingerprint} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Chấm công trên ứng dụng',
        to: '/employee/timesheet/timekeeping-remote',
      },
      {
        component: CNavItem,
        name: 'Bảng phân ca',
        to: '/employee/timesheet/shiftplan',
      },
      {
        component: CNavItem,
        name: 'Bảng chấm công',
        to: '/employee/timesheet/timesheet-grid',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Đơn từ',
    to: '/employee/profile',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tiền lương',
    to: '/employee/profile',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Phúc lợi',
    to: '/employee/profile',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Đồng phục',
    to: '/employee/profile',
    icon: <CIcon icon={cibOpsgenie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tài sản',
    to: '/employee/profile',
    icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Đánh giá',
    to: '/employee/profile',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
]

export default _nav
