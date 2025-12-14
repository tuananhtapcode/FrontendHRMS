import { cilEnvelopeClosed, cilFingerprint, cilSpeedometer, cilUser } from '@coreui/icons'
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
    component: CNavGroup,
    name: 'Đơn từ',
    to: '/employee/timesheet',
    icon: <CIcon icon={cilEnvelopeClosed} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Đơn xin nghỉ',
        to: '/employee/timesheet/attendance',
      },
      {
        component: CNavItem,
        name: 'Đăng ký làm thêm',
        to: '/employee/timesheet/overtime-request',
      },
      // {
      //   component: CNavItem,
      //   name: 'Đề nghị đổi ca',
      //   to: '/employee/timesheet/change-shift',
      // },
    ],
  },
]

export default _nav
