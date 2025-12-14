import api from '../../../api/api'
import { unwrap } from '../../../api/unwrap'

// 1) Lấy danh sách kỳ lương
export const fetchPayrollPeriods = async () => {
  const res = await api.get('/api/v1/payroll-periods')
  return unwrap(res)
}

// 2) Lấy tổng hợp chi trả theo kỳ (✅ tên export đúng như UI)
export const fetchPaymentSummaryByPeriod = async (periodId) => {
  const res = await api.get(`/api/v1/payroll-actions/periods/${periodId}/summary`)
  return unwrap(res)
}

// 3) Duyệt kỳ lương
export const approvePayrollPeriod = async (periodId) => {
  const res = await api.post(`/api/v1/payroll-actions/periods/${periodId}/approve`)
  return unwrap(res)
}

// 4) Chi trả kỳ lương (bulk)
export const payPayrollPeriod = async (periodId, req) => {
  const res = await api.post(`/api/v1/payroll-actions/periods/${periodId}/pay`, req ?? null)
  return unwrap(res)
}

// 5) Chi trả 1 payroll
export const paySinglePayroll = async (payrollId, req) => {
  const res = await api.post(`/api/v1/payroll-actions/payrolls/${payrollId}/pay`, req ?? null)
  return unwrap(res)
}
