import dayjs from 'dayjs'
import api from '../../../api/api'

/// EMPLOYEES
const createEmployees = async (
  employeeCode,
  fullName,
  email,
  phoneNumber,
  departmentId,
  jobPositionId,
) => {
  try {
    // console.log(employeeCode)
    // console.log(fullName)
    // console.log(email)
    // console.log(phoneNumber)
    // console.log(departmentId)
    // console.log(jobPositionId)
    const res = await api.post('/api/v1/employees', {
      employeeCode,
      fullName,
      email,
      phoneNumber,
      departmentId,
      jobPositionId,
      roleId: 3,
    })
    return res
  } catch (error) {
    throw error
  }
}
const updateEmployees = async (
  id,
  employeeCode,
  fullName,
  email,
  phoneNumber,
  departmentId,
  jobPositionId,
) => {
  try {
    const res = await api.put(`/api/v1/employees/${id}`, {
      employeeCode,
      fullName,
      email,
      phoneNumber,
      departmentId,
      jobPositionId,
      roleId: 3,
    })
    return res
  } catch (error) {
    throw error
  }
}
const getEmployees = async (page, size) => {
  try {
    const res = await api.get('/api/v1/employees/search', { params: { page, size } })
    // console.log(res)
    const employees = res.data.data.employees.map((e) => ({
      ...e,
      dateOfBirth: dayjs(e.dateOfBirth).format('DD/MM/YYYY'),
      hireDate: dayjs(e.hireDate).format('DD/MM/YYYY'),
    }))
    return { data: employees, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getEmployeeById = async (id) => {
  try {
    const res = await api.get(`/api/v1/employees/${id}`)
    return res.data.data
  } catch (error) {
    throw error
  }
}
const exportEmployees = async () => {
  try {
    const res = await api.get('/api/v1/employees/export', {
      responseType: 'blob', // 🔥 CỰC KỲ QUAN TRỌNG
    })

    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'employees.xlsx' // tên file
    document.body.appendChild(a)
    a.click()

    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error(err)
  }
}

/// DEPARTMENTS
const createDepartment = async (name, description, managerId) => {
  try {
    const res = await api.post('/api/v1/departments', { name, description, managerId })
    return res
  } catch (error) {
    throw error
  }
}

const getDepartments = async (page, size = 5) => {
  try {
    const res = await api.get('/api/v1/departments', { params: { page, size } })
    return { data: res.data.departmentResponseList, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}

const updateDepartment = async () => {
  try {
  } catch (error) {
    throw error
  }
}

const deleteDepartment = async (item) => {
  try {
    const id = item.departmentId
    const res = await api.delete(`/api/v1/departments/${id}`)
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}
const exportDepartment = async () => {
  try {
    const res = await api.get('/api/v1/departments/export/excel', {
      responseType: 'blob',
    })

    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'departments.xlsx'
    document.body.appendChild(a)
    a.click()

    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

/// JOB POSITIONS
const createJobPosition = async (code, name, description, level, minSalary, maxSalary) => {
  try {
    const res = await api.post('/api/v1/job-positions', {
      code,
      name,
      description,
      level,
      minSalary,
      maxSalary,
    })
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}
const updateJobPosition = async (id, code, name, description, level, minSalary, maxSalary) => {
  try {
    const res = await api.put(`/api/v1/job-positions/${id}`, {
      code,
      name,
      description,
      level,
      minSalary,
      maxSalary,
    })
    console.log(res)
    return res
  } catch (error) {
    console.error(error)
  }
}
const getJobPositions = async (page, limit) => {
  try {
    const res = await api.get('/api/v1/job-positions', { params: { page, limit } })
    console.log(res)
    return { data: res.data.data.jobPositionResponses, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getActiveJobPositions = async (page, limit) => {
  try {
    const res = await api.get('/api/v1/job-positions/active', {
      params: { page, limit },
    })
    return { data: res.data.data.jobPositionResponses, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getInactiveJobPositions = async (page, limit) => {
  try {
    const res = await api.get('/api/v1/job-positions/inactive', {
      params: { page, limit },
    })
    return { data: res.data.data.jobPositionResponses, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const deleteJobPosition = async (item) => {
  try {
    const id = item.id
    const res = await api.delete(`api/v1/job-positions/${id}`)
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}
const exportJobPosition = async () => {
  try {
    const res = await api.get('/api/v1/job-positions/export/excel', {
      responseType: 'blob', // 🔥 quan trọng nhất
    })

    // Tạo blob từ response
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Tạo link download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job_positions.xlsx' // tên file
    document.body.appendChild(a)
    a.click()

    // cleanup
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}
/// DASHBOARD
const getDeparmentsStats = async () => {
  try {
    const res = await api.get('/api/v1/departments/stats')
    return res.data.data
  } catch (error) {
    throw error
  }
}
const getEmployeesStats = async () => {
  try {
    const res = await api.get('/api/v1/employees/dashboard-stats')
    return res.data.data
  } catch (error) {
    throw error
  }
}

export {
  /// DASHBOARD
  getDeparmentsStats,
  getEmployeesStats,
  /// EMPLOYEES
  createEmployees,
  updateEmployees,
  getEmployees,
  getEmployeeById,
  exportEmployees,
  /// DEPARTMENTS
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  exportDepartment,
  /// JOB POSITIONS
  createJobPosition,
  getJobPositions,
  getActiveJobPositions,
  getInactiveJobPositions,
  updateJobPosition,
  deleteJobPosition,
  exportJobPosition,
}
