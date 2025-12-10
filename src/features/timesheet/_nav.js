import {
  cilCalendar,
  cilChartLine,
  cilFile,
  cilHome,
  cilListRich, // Icon Báo cáo
  cilSettings
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Tổng quan',
    to: '/timesheet',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Ca làm việc',
    to: '/ca-lam-viec',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách ca',
        to: '/timesheet/shiftscheduleShow',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Phân ca chi tiết',
        to: '/timesheet/ShiftAssignmentDetail',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Bảng phân ca tổng hợp',
        to: '/timesheet/shiftassignmentSummary',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Đăng kí ca',
        to: '/timesheet/shiftsRegistration',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Chấm công',
    to: '/cham-cong',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Bảng chấm công chi tiết',
        to: '/timesheet/detailedTimesheet',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Bảng chấm công tổng hợp',
        to: '/timesheet/summaryTimesheet',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Dữ liệu chấm công',
        to: '/timesheet/dataTimesheet',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý đơn',
    to: '/quan-ly-don',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Đơn xin nghỉ',
        to: '/timesheet/leaveRequest',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Đăng kí làm thêm',
        to: '/timesheet/overtimeRequest',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Đề nghị đổi ca',
        to: '/timesheet/shiftSwap',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },
  // --- PHẦN BÁO CÁO ĐÃ THÊM 'title' ---
  {
    component: CNavGroup,
    name: 'Báo cáo',
    to: '/bao-cao',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách đi muộn, về sớm, nghỉ',
        to: '/timesheet/lateearlyReport',
        //icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        title: 'Danh sách nhân viên đi muộn, về sớm, nghỉ', // <-- ĐÃ THÊM
      },
      
      {
        component: CNavItem,
        name: 'Tổng hợp tình hình đi muộn về sớm của nhân viên',
        to: '/timesheet/summarylateearlyReport',
       // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        title: 'Tổng hợp tình hình đi muộn về sớm của nhân viên', // <-- ĐÃ THÊM
      },
      {
        component: CNavItem,
        name: 'Thống kê tình hình đi làm, vắng mặt theo ca làm việc',
        to: '/timesheet/attendancebyShift',
       // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        title: 'Thống kê tình hình đi làm, vắng mặt theo ca làm việc', // <-- ĐÃ THÊM
      },
      {
        component: CNavItem,
        name: 'Tổng hợp số giờ làm việc của nhân viên',
        to: '/timesheet/totalworkingHours',
       // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        title: 'Tổng hợp số giờ làm việc của nhân viên', // <-- ĐÃ THÊM
      },
      {
        component: CNavItem,
        name: 'Danh sách nhân viên làm thêm giờ',
        to: '/timesheet/overtimeEList',
       // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        title: 'Danh sách nhân viên làm thêm giờ', // <-- ĐÃ THÊM
      },
      {
        component: CNavItem,
        name: 'Tổng hợp tình hình làm thêm của nhân viên',
        to: '/timesheet/overtimeSummary',
       // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        title: 'Tổng hợp tình hình làm thêm của nhân viên', // <-- ĐÃ THÊM
      },
      
    ],
  },
  // --- HẾT PHẦN BÁO CÁO ---
  {
    component: CNavGroup,
    name: 'Thiết lập',
    to: '/thiet-lap',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Nhân viên',
        to: '/timesheet/employeeList',
        // icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Quy định chấm công',
        to: '/timesheet/attendanceRules',
        // icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav