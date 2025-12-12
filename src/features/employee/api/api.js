import api from '../../../api/api'

const createOvertimeRequest = async (date, startTime, endTime, reason) => {
  try {
    const res = await api.get('/api/v1/departments', {
      params: { date, startTime, endTime, reason },
    })
    console.log(res)
    return res.data
  } catch (err) {
    throw err
  }
}

const getEmployees = async (page, size) => {
  try {
    const res = await api.get('/api/v1/employees', { params: { page, size } })
    return { data: res.data.data.employees, totalPages: res.data.data.totalPages }
  } catch (err) {
    throw err
  }
}

export { createOvertimeRequest, getEmployees }
