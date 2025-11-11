import {
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // --- Trang đơn ---
  {
    component: CNavItem,
    name: 'Tổng quan',
    to: '/payroll',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Thành phần lương',
    to: '/payroll/components',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mẫu bảng lương',
    to: '/payroll/templates',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  // --- Khối tính lương ---
  { component: CNavTitle, name: 'Tiền lương' },

  // Dữ liệu tính lương
  {
    component: CNavGroup,
    name: 'Dữ liệu tính lương',
    to: '/payroll/data',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Chấm công',        to: '/payroll/data/timekeeping' },
      { component: CNavItem, name: 'Doanh số',         to: '/payroll/data/sales' },
      { component: CNavItem, name: 'KPI',              to: '/payroll/data/kpi' },
      { component: CNavItem, name: 'Sản phẩm',         to: '/payroll/data/product' },
      { component: CNavItem, name: 'Thu nhập khác',    to: '/payroll/data/other-income' },
      { component: CNavItem, name: 'Khấu trừ khác',    to: '/payroll/data/other-deductions' },
    ],
  },

  // Tính lương
  {
    component: CNavGroup,
    name: 'Tính lương',
    to: '/payroll/calculation',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Bảng lương',         to: '/payroll/calculation/payroll-table' },
      { component: CNavItem, name: 'Tạm ứng',            to: '/payroll/calculation/advance' },
      { component: CNavItem, name: 'Tổng hợp lương',     to: '/payroll/calculation/summary' },
      { component: CNavItem, name: 'Phân bổ lương',      to: '/payroll/calculation/allocation' },
      { component: CNavItem, name: 'Ngân sách lương',    to: '/payroll/calculation/budget' },
      { component: CNavItem, name: 'Bảng thuế',          to: '/payroll/calculation/tax-table' },
      { component: CNavItem, name: 'Quyết toán thuế',    to: '/payroll/calculation/tax-finalization' },
    ],
  },

  // Chi trả
  {
    component: CNavGroup,
    name: 'Chi trả',
    to: '/payroll/payment',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Bảng chi trả',     to: '/payroll/payment/payment-table' },
      { component: CNavItem, name: 'Tổng hợp chi trả', to: '/payroll/payment/payment-summary' },
    ],
  },

  // Báo cáo
  {
    component: CNavGroup,
    name: 'Báo cáo',
    to: '/payroll/reports',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Tổng thu nhập nhân viên',    to: '/payroll/reports/employee-income' },
      { component: CNavItem, name: 'Thống kê lương theo giờ',    to: '/payroll/reports/hourly-statistics' },
      { component: CNavItem, name: 'Cơ cấu thu nhập',            to: '/payroll/reports/income-structure' },
      { component: CNavItem, name: 'Tổng hợp chi phí lương',     to: '/payroll/reports/cost-summary' },
      { component: CNavItem, name: 'Tổng hợp chi trả lương',     to: '/payroll/reports/payment-summary' },
      { component: CNavItem, name: 'Lịch sử lương nhân viên',    to: '/payroll/reports/salary-history' },
      { component: CNavItem, name: 'Tổng công nợ',               to: '/payroll/reports/debt-summary' },
      { component: CNavItem, name: 'Thực hiện ngân sách',        to: '/payroll/reports/budget-status' },
    ],
  },

  // Thiết lập
  {
    component: CNavGroup,
    name: 'Thiết lập',
    to: '/payroll/settings',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Nhân viên',         to: '/payroll/settings/employees' },
      { component: CNavItem, name: 'Thông số mặc định', to: '/payroll/settings/defaults' },
      { component: CNavItem, name: 'Biểu mẫu tuỳ chỉnh',to: '/payroll/settings/templates' },
      { component: CNavItem, name: 'Vai trò người dùng',to: '/payroll/settings/roles' },
      { component: CNavItem, name: 'Kết nối hệ thống',  to: '/payroll/settings/integrations' },
      { component: CNavItem, name: 'Thùng rác',         to: '/payroll/settings/trash' },
    ],
  },
]

export default _nav
