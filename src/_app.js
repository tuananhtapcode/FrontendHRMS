import {
  cilDollar,
  cilFingerprint,
  cilPeople,
  cilSettings,
  cilStar,
  cilTask,
  cilUser,
} from '@coreui/icons'

const _app = [
  {
    name: 'Hệ thống',
    icon: cilSettings,
    to: '/system',
  },
  {
    name: 'Tiền lương',
    icon: cilDollar,
    to: '/payroll',
  },
  {
    name: 'Bảo hiểm xã hội',
    icon: cilSettings,
    to: '/bhxh',
  },
  {
    name: 'Tuyển dụng',
    icon: cilSettings,
    to: '/recruit',
  },
  {
    name: 'Nhân viên',
    icon: cilUser,
    to: '/employee',
  },
  {
    name: 'Chấm công',
    icon: cilFingerprint,
    to: '/timesheet',
  },
  {
    name: 'Đánh giá',
    icon: cilStar,
    to: '/review',
  },
  {
    name: 'Thuế TNCN',
    icon: cilSettings,
    to: '/mintax',
  },
  {
    name: 'Mục tiêu',
    icon: cilTask,
    to: '/goal',
  },
  {
    name: 'Thông tin nhân sự',
    icon: cilPeople,
    to: '/employees-information',
  },
]

export default _app
