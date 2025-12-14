// src/features/payroll/api/masterDataApi.js
import api from '../../../api/api'
import { unwrap } from '../../../api/unwrap'

// ===== Payroll Periods =====
export const fetchPayrollPeriods = async () => {
  const res = await api.get('/api/v1/payroll-periods')
  return unwrap(res) // List<PayrollPeriod>
}

export const createPayrollPeriod = async ({ name, startDate, endDate, paymentDate }) => {
  const res = await api.post('/api/v1/payroll-periods', {
    name,
    startDate,
    endDate,
    paymentDate,
  })
  return unwrap(res)
}

export const closePayrollPeriod = async (id) => {
  const res = await api.patch(`/api/v1/payroll-periods/${id}/close`)
  return unwrap(res)
}

// ===== Salary Components =====
export const fetchSalaryComponents = async ({ type } = {}) => {
  const res = await api.get('/api/v1/salary-components', { params: { type } })
  return unwrap(res)
}

export const createSalaryComponent = async ({ code, name, type, description, isActive = true }) => {
  const res = await api.post('/api/v1/salary-components', {
    code,
    name,
    type,
    description,
    isActive,
  })
  return unwrap(res)
}

export const toggleSalaryComponentActive = async (id) => {
  const res = await api.patch(`/api/v1/salary-components/${id}/toggle-active`)
  return unwrap(res)
}

export const updateSalaryComponent = async (id, payload) => {
  const res = await api.put(`/api/v1/salary-components/${id}`, payload)
  return unwrap(res)
}

// ===== Salary Profiles by employee =====
export const fetchEmployeeSalaryProfiles = async (employeeId) => {
  const res = await api.get(`/api/v1/employees/${employeeId}/salary-profiles`)
  return unwrap(res)
}

export const upsertEmployeeSalaryProfile = async (employeeId, { salaryComponentId, amount, note }) => {
  const res = await api.post(`/api/v1/employees/${employeeId}/salary-profiles`, {
    salaryComponentId,
    amount,
    note,
  })
  return unwrap(res)
}

export const updateEmployeeSalaryProfile = async (employeeId, profileId, { salaryComponentId, amount, note }) => {
  const res = await api.put(`/api/v1/employees/${employeeId}/salary-profiles/${profileId}`, {
    salaryComponentId,
    amount,
    note,
  })
  return unwrap(res)
}
