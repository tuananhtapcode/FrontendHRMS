// // src/features/payroll/api/overviewApi.js
// import { PAYROLL_API_BASE_URL, PAYROLL_USE_MOCK } from '../payrollConfig'

// const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// // ================= MOCK DATA =================

// // KPI tổng quát cho kỳ lương
// const mockSummary = {
//   totalSalary: 5432100000,
//   personalIncomeTax: 850000000,
//   insuranceDeduction: 1230000000,
//   headcount: 1050,
// }

// // Cơ cấu quỹ lương
// const mockFundStructure = [
//   { label: 'Lương cơ bản', value: 3200000000 },
//   { label: 'Phụ cấp', value: 900000000 },
//   { label: 'Tăng ca', value: 450000000 },
//   { label: 'Thưởng', value: 380000000 },
//   { label: 'Khấu trừ', value: -500000000 },
// ]

// // Biến động quỹ lương theo tháng
// const mockSalaryTrend = [
//   { month: '01/2025', total: 4800000000, avg: 9000000 },
//   { month: '02/2025', total: 5100000000, avg: 9200000 },
//   { month: '03/2025', total: 5200000000, avg: 9400000 },
//   { month: '04/2025', total: 5300000000, avg: 9500000 },
//   { month: '05/2025', total: 5400000000, avg: 9600000 },
//   { month: '06/2025', total: 5432100000, avg: 9700000 },
// ]

// // Thông tin kỳ lương hiện tại
// const mockCurrentPeriod = {
//   id: 'ky-luong-06-2025',              // 👈 dùng cho route /payroll/periods/:id
//   code: 'KL_06_2025',
//   name: 'Kỳ lương 06/2025',
//   status: 'Đã duyệt',
//   timeRange: '01/06/2025 – 30/06/2025',
//   paymentDate: '05/07/2025',
//   approver: 'Nguyễn Văn A',
//   createdBy: 'Nguyễn Văn A',           // 👈 để trang detail hiển thị "Người lập"
//   totalPaid: 5432100000,
//   headcount: 1050,
// }

// // Lời nhắc
// const mockReminders = [
//   {
//     color: 'warning',
//     title: 'CHƯA GỬI PHIẾU LƯƠNG',
//     desc: 'Còn 12 nhân viên chưa gửi',
//   },
//   {
//     color: 'info',
//     title: 'NV CHÍNH THỨC CHƯA THAM GIA BHXH',
//     desc: '3 nhân viên cần bổ sung',
//   },
//   {
//     color: 'success',
//     title: 'LƯƠNG ĐÓNG BH NGOÀI QUY ĐỊNH',
//     desc: 'Không có dữ liệu bất thường',
//   },
// ]

// // Ngân sách lương
// const mockBudget = {
//   percent: 68, // %
//   plan: 100,
//   actual: 68,
// }

// // Gom mock vào một object cho gọn
// const mockOverviewData = {
//   summary: mockSummary,
//   fundStructure: mockFundStructure,
//   salaryTrend: mockSalaryTrend,
//   currentPeriod: mockCurrentPeriod,
//   reminders: mockReminders,
//   budget: mockBudget,
// }

// // ================= CONFIG =================

// const USE_MOCK = PAYROLL_USE_MOCK
// const BASE_URL = PAYROLL_API_BASE_URL

// console.log('[overviewApi] USE_MOCK =', USE_MOCK, 'BASE_URL =', BASE_URL)

// // ================= NORMALIZE BACKEND =================

// function normalizeOverviewFromBackend(raw = {}) {
//   const summary = raw.summary || {}

//   return {
//     summary: {
//       totalSalary: summary.totalSalary ?? 0,
//       personalIncomeTax: summary.personalIncomeTax ?? 0,
//       insuranceDeduction: summary.insuranceDeduction ?? 0,
//       headcount: summary.headcount ?? 0,
//     },
//     fundStructure: raw.fundStructure ?? [],
//     salaryTrend: raw.salaryTrend ?? [],
//     currentPeriod: raw.currentPeriod ?? null,
//     reminders: raw.reminders ?? [],
//     budget: raw.budget ?? null,
//   }
// }

// // ================= PUBLIC API =================

// export async function fetchOverviewData() {
//   // 1. Nếu đang bật mock → trả mock
//   if (USE_MOCK) {
//     await delay(300) // fake loading cho đẹp
//     return mockOverviewData
//   }

//   // 2. Còn không thì gọi backend
//   const res = await fetch(`${BASE_URL}/overview`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })

//   if (!res.ok) {
//     throw new Error('Failed to fetch overview data')
//   }

//   const data = await res.json()
//   return normalizeOverviewFromBackend(data)
// }

// src/features/payroll/api/overviewApi.js
import { PAYROLL_API_BASE_URL, PAYROLL_USE_MOCK } from '../config'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ===== MOCK DATA (giống bạn đang dùng) =====
const mockSummary = {
  totalSalary: 5432100000,
  personalIncomeTax: 850000000,
  insuranceDeduction: 1230000000,
  headcount: 1050,
}

const mockFundStructure = [
  { label: 'Lương cơ bản', value: 3200000000 },
  { label: 'Phụ cấp', value: 900000000 },
  { label: 'Tăng ca', value: 450000000 },
  { label: 'Thưởng', value: 380000000 },
  { label: 'Khấu trừ', value: -500000000 },
]

const mockSalaryTrend = [
  { month: '01/2025', total: 4800000000, avg: 9000000 },
  { month: '02/2025', total: 5100000000, avg: 9200000 },
  { month: '03/2025', total: 5200000000, avg: 9400000 },
  { month: '04/2025', total: 5300000000, avg: 9500000 },
  { month: '05/2025', total: 5400000000, avg: 9600000 },
  { month: '06/2025', total: 5432100000, avg: 9700000 },
]

const mockCurrentPeriod = {
  name: 'Kỳ lương 06/2025',
  status: 'Đã duyệt',
  timeRange: '01/06/2025 – 30/06/2025',
  paymentDate: '05/07/2025',
  approver: 'Nguyễn Văn A',
  totalPaid: 5432100000,
  headcount: 1050,
}

const mockReminders = [
  {
    color: 'warning',
    title: 'CHƯA GỬI PHIẾU LƯƠNG',
    desc: 'Còn 12 nhân viên chưa gửi',
  },
  {
    color: 'info',
    title: 'NV CHÍNH THỨC CHƯA THAM GIA BHXH',
    desc: '3 nhân viên cần bổ sung',
  },
  {
    color: 'success',
    title: 'LƯƠNG ĐÓNG BH NGOÀI QUY ĐỊNH',
    desc: 'Không có dữ liệu bất thường',
  },
]

const mockBudget = {
  percent: 68,
  plan: 100,
  actual: 68,
  // NEW: top khoản tăng chi
  topCosts: [
    { label: 'Lương cơ bản', value: 3200000000, delta: 4.2 },
    { label: 'Phụ cấp', value: 900000000, delta: 1.1 },
    { label: 'Tăng ca', value: 450000000, delta: 12.5 },
    { label: 'Thưởng', value: 380000000, delta: -2.0 },
  ],

  // NEW: dự báo cuối kỳ
  forecast: {
    endPercent: 92,
    risk: 'medium', // low | medium | high
    note: 'OT tăng nhanh trong 2 tuần gần đây.',
  },
}
// Hướng dẫn nghiệp vụ (guides)
const mockGuides = [
  {
    title: 'Quy trình chốt kỳ lương',
    desc: 'Checklist, các bước duyệt và khóa kỳ.',
    href: '#',
  },
  {
    title: 'Hướng dẫn xử lý BHXH',
    desc: 'Cách kiểm tra và bổ sung dữ liệu thiếu.',
    href: '#',
  },
]

const mockOverviewData = {
  summary: mockSummary,
  fundStructure: mockFundStructure,
  salaryTrend: mockSalaryTrend,
  currentPeriod: mockCurrentPeriod,
  reminders: mockReminders,
  budget: mockBudget,
  guides: mockGuides,
}

const USE_MOCK = PAYROLL_USE_MOCK
const BASE_URL = PAYROLL_API_BASE_URL

console.log('[overviewApi] USE_MOCK=', USE_MOCK, 'BASE_URL=', BASE_URL)

function normalizeOverviewFromBackend(raw) {
  const budget = raw.budget ?? null
  return {
    summary: {
      totalSalary: raw.summary.totalSalary,
      personalIncomeTax: raw.summary.personalIncomeTax,
      insuranceDeduction: raw.summary.insuranceDeduction,
      headcount: raw.summary.headcount,
    },
    fundStructure: raw.fundStructure ?? [],
    salaryTrend: raw.salaryTrend ?? [],
    currentPeriod: raw.currentPeriod ?? null,
    reminders: raw.reminders ?? [],
    budget: budget
      ? {
          percent: budget.percent ?? 0,
          plan: budget.plan ?? 100,
          actual: budget.actual ?? 0,
          topCosts: budget.topCosts ?? [],
          forecast: budget.forecast ?? null,
        }
      : null,
    guides: raw.guides ?? [],
  }
}

export async function fetchOverviewData() {
  // 👉 ĐANG TEST MOCKDATA → DÙNG NHÁNH NÀY
  if (USE_MOCK) {
    await delay(300)
    return mockOverviewData
  }

  // Sau này nối BE thì chỉ cần set PAYROLL_USE_MOCK = 0
  const res = await fetch(`${BASE_URL}/overview`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch overview data')
  }

  const data = await res.json()
  return normalizeOverviewFromBackend(data)
}
