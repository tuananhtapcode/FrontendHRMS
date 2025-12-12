// src/features/payroll/api/periodApi.js
import axios from 'axios'
import { PAYROLL_API_BASE, USE_MOCK } from '../config'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ================= MOCK DATA KỲ LƯƠNG =================

const mockPayrollPeriods = [
  {
    id: 'ky-luong-06-2025',
    code: 'KL_06_2025',
    name: 'Kỳ lương 06/2025',
    status: 'Đã duyệt',
    timeRange: '01/06/2025 – 30/06/2025',
    paymentDate: '05/07/2025',
    createdBy: 'Nguyễn Văn A',
    totalPaid: 5432100000,
    headcount: 1050,
  },
  {
    id: 'ky-luong-05-2025',
    code: 'KL_05_2025',
    name: 'Kỳ lương 05/2025',
    status: 'Đã duyệt',
    timeRange: '01/05/2025 – 31/05/2025',
    paymentDate: '05/06/2025',
    createdBy: 'Nguyễn Văn B',
    totalPaid: 5400000000,
    headcount: 1040,
  },
  {
    id: 'ky-luong-07-2025',
    code: 'KL_07_2025',
    name: 'Kỳ lương 07/2025',
    status: 'Chờ phê duyệt',
    timeRange: '01/07/2025 – 31/07/2025',
    paymentDate: '05/08/2025',
    createdBy: 'Nguyễn Văn C',
    totalPaid: 5500000000,
    headcount: 1060,
  },
  {
    id: 'ky-luong-08-2025',
    code: 'KL_08_2025',
    name: 'Kỳ lương 08/2025',
    status: 'Bản nháp',
    timeRange: '01/08/2025 – 31/08/2025',
    paymentDate: '05/09/2025',
    createdBy: 'Nguyễn Văn D',
    totalPaid: null,
    headcount: 1065,
  },
]

console.log('[periodApi] BASE =', PAYROLL_API_BASE, 'USE_MOCK =', USE_MOCK)

// ================= PUBLIC API =================

// Lấy danh sách các kỳ lương (sau này dùng cho trang "Quản lý kỳ lương")
export async function fetchPayrollPeriods(params = {}) {
  // MOCK MODE
  if (USE_MOCK) {
    await delay(300) // fake loading
    // Có thể lọc theo params (status, keyword, ...) ở đây nếu muốn
    return mockPayrollPeriods
  }

  // CALL BACKEND
  const res = await axios.get(`${PAYROLL_API_BASE}/periods`, { params })
  return res.data
}

// Lấy chi tiết 1 kỳ lương theo id
export async function fetchPayrollPeriodById(id) {
  if (!id) throw new Error('Missing period id')

  // MOCK MODE
  if (USE_MOCK) {
    await delay(300)
    const found =
      mockPayrollPeriods.find(
        (p) => p.id === id || p.code === id,
      ) || null

    if (!found) {
      throw new Error('Mock period not found: ' + id)
    }

    return found
  }

  // CALL BACKEND
  const res = await axios.get(
    `${PAYROLL_API_BASE}/periods/${encodeURIComponent(id)}`,
  )
  return res.data
}
