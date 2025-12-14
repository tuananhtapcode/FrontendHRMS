// src/features/payroll/api/payrollApi.js
import api from '../../../api/api'
import { unwrap } from '../../../api/unwrap'

// ✅ List payroll theo kỳ (paging)
export const fetchPayrolls = async ({ periodId, page = 0, size = 20 }) => {
  const res = await api.get('/api/v1/payrolls', { params: { periodId, page, size } })
  return unwrap(res) // data = Page<PayrollListItemDTO>
}

// ✅ Chi tiết payslip
export const fetchPayrollDetail = async (payrollId) => {
  const res = await api.get(`/api/v1/payrolls/${payrollId}`)
  return unwrap(res) // PayrollResponseDTO
}

// ✅ Tính lương 1 nhân viên (ADMIN/HR)
export const calculatePayroll = async ({ employeeId, payrollPeriodId, month, year }) => {
  const res = await api.post('/api/v1/payrolls/calculate', {
    employeeId,
    payrollPeriodId,
    month,
    year,
  })
  return unwrap(res)
}

// ✅ Tính batch theo period + month/year
export const calculatePayrollBatch = async ({ periodId, month, year }) => {
  const res = await api.post('/api/v1/payrolls/calculate-batch', null, {
    params: { periodId, month, year },
  })
  return unwrap(res) // { processedEmployees: n }
}

/**
 * (Tuỳ bạn có endpoint ME)
 * Nhân viên xem payroll của chính mình theo kỳ
 */
export const fetchMyPayrolls = async ({ periodId, page = 0, size = 20 }) => {
  const res = await api.get('/api/v1/me/payrolls', { params: { periodId, page, size } })
  return unwrap(res)
}

export const fetchMyPayrollDetail = async (payrollId) => {
  const res = await api.get(`/api/v1/me/payrolls/${payrollId}`)
  return unwrap(res)
}
// unwrap ApiResponse<T>
// const unwrap = (res) => res?.data?.data ?? res?.data ?? res

export const createPayrollPeriod = async (payload) => {
  const res = await api.post('/api/v1/payroll-periods', payload)
  return unwrap(res)
}


// ✅ Lấy danh sách tất cả kỳ lương
export const fetchPayrollPeriods = async () => {
  const res = await api.get('/api/v1/payroll-periods')
  return unwrap(res)
}

// ✅ Lấy chi tiết 1 kỳ lương theo ID
export const fetchPayrollPeriodById = async (id) => {
  // Nếu backend chưa có API get by ID riêng, bạn có thể filter từ list
  // Nhưng chuẩn nhất là nên có endpoint này:
  const res = await api.get(`/api/v1/payroll-periods/${id}`)
  return unwrap(res)
}

// ✅ Đóng kỳ lương (Khóa sổ)
export const closePayrollPeriod = async (id) => {
  const res = await api.patch(`/api/v1/payroll-periods/${id}/close`)
  return unwrap(res)
}