import dayjs from 'dayjs'
import api from '../../../api/api'

///=== OVERTIME REQUEST ===
const createOvertimeRequest = async (employeeId, date, startTime, endTime, reason) => {
  try {
    const params = {
      date: dayjs(date).format('YYYY-MM-DD'),
      startTime: dayjs(startTime).format('HH:mm'),
      endTime: dayjs(endTime).format('HH:mm'),
      reason,
      ...(employeeId && { employeeId }),
    }
    console.log(params)
    const res = await api.post('/api/v1/overtime-requests', params)
    console.log(res)
    return res.data
  } catch (err) {
    throw err
  }
}
const updateOvertimeRequest = async (id, date, startTime, endTime, reason) => {
  try {
    const res = await api.put(`/api/v1/overtime-requests/${id}`, {
      date,
      startTime,
      endTime,
      reason,
    })
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}
const approveOvertimeRequest = async (id, note) => {
  try {
    const res = await api.post(`/api/v1/overtime-requests/${id}/approve`, {
      managerNote: note,
    })
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}
const rejectOvertimeRequest = async (id, note) => {
  try {
    const res = await api.post(`/api/v1/overtime-requests/${id}/reject`, {
      managerNote: note,
    })
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}

/// MINE
const getMineOvertimeRequestsAll = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/me', { params: { page, size } })
    const content = res.data.data.content
    const formatted = content.map((c) => ({
      ...c,
      createdAt: dayjs(c.createdAt).format('DD-MM-YYYY HH:mm'),
      date: dayjs(c.date).format('DD/MM/YYYY'),
    }))

    return { data: formatted, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getMineOvertimeRequestPending = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/my/pending', { params: { page, size } })
    console.log(res)
    return { data: res.data.data.jobPositionResponses, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getMineOvertimeRequestApproved = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/my/approved', { params: { page, size } })
    console.log(res)
    return { data: res.data.data.jobPositionResponses, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getMineOvertimeRequestRejected = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/my/rejected', { params: { page, size } })
    console.log(res)
    return { data: res.data.data.jobPositionResponses, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}

///I APPROVE
const getIApproveOvertimeRequestsAll = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests', { params: { page, size } })
    return { data: res.data.data.content, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveOvertimeRequestPending = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/pending', { params: { page, size } })
    console.log(res)
    return { data: res.data.content, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveOvertimeRequestApproved = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/approved', { params: { page, size } })
    console.log(res)
    return { data: res.data.content, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveOvertimeRequestRejected = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/rejected', { params: { page, size } })
    console.log(res)
    return { data: res.data.content, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}

const getIApproveOvertimeRequestPendingCount = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/dashboard/pending', {
      params: { page, size },
    })
    return res.data.data
  } catch (error) {
    throw error
  }
}
const getIApproveOvertimeRequestApprovedCount = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/dashboard/approved', {
      params: { page, size },
    })
    return res.data.data
  } catch (error) {
    throw error
  }
}
const getIApproveOvertimeRequestRejectedCount = async (page, size) => {
  try {
    const res = await api.get('/api/v1/overtime-requests/dashboard/rejected', {
      params: { page, size },
    })
    return res.data.data
  } catch (error) {
    throw error
  }
}

///=== ATTENDANCE ===
const createAttendance = async (employeeId, startDate, endDate, leaveType, reason) => {
  try {
    const params = {
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      leaveType,
      reason,
      ...(employeeId && { employeeId }),
    }
    console.log(params)
    const res = await api.post('/api/v1/leave-requests', params)
    console.log(res)
    return res.data
  } catch (err) {
    throw err
  }
}
const updateAttendance = async (id, startDate, endDate, leaveType, reason) => {
  try {
    const res = await api.put(`/api/v1/leave-requests/${id}`, {
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      leaveType,
      reason,
    })
    console.log(res)
    return res
  } catch (error) {
    throw error
  }
}
const approveAttendance = async (id, note) => {
  try {
    const res = await api.post(`/api/v1/leave-requests/${id}/approve`, {
      managerNote: note,
    })
    return res
  } catch (error) {
    throw error
  }
}
const rejectAttendance = async (id, note) => {
  try {
    const res = await api.post(`/api/v1/leave-requests/${id}/reject`, {
      managerNote: note,
    })
    return res
  } catch (error) {
    throw error
  }
}
/// MINE
const getMineAttendanceAll = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests/me', { params: { page, size } })
    console.log(res)
    const formatted = res.data.content.map((c) => ({
      ...c,
      approvedAt: c.approvedAt ? dayjs(c.approvedAt).format('DD-MM-YYYY HH:mm:ss') : '',
      startDate: dayjs(c.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(c.startDate).format('DD/MM/YYYY'),
    }))
    return { data: formatted, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getMineAttendancePending = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests/my/pending', { params: { page, size } })
    return { data: res.data.content, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getMineAttendanceApproved = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests/my/approved', { params: { page, size } })
    console.log(res)
    return { data: res.data.data.content, totalPages: res.data.data.totalPages }
  } catch (error) {
    throw error
  }
}

///I APPROVE
const getIApproveAttendanceAll = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests', { params: { page, size } })
    const formatted = res.data.content.map((c) => ({
      ...c,
      createdAt: dayjs(c.createdAt).format('DD-MM-YYYY HH:mm:ss'),
      approvedAt: c.approvedAt ? dayjs(c.approvedAt).format('DD-MM-YYYY HH:mm:ss') : '',
      startDate: dayjs(c.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(c.startDate).format('DD/MM/YYYY'),
    }))
    return { data: formatted, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveAttendancePending = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests/pending', { params: { page, size } })
    const formatted = res.data.content.map((c) => ({
      ...c,
      createdAt: dayjs(c.createdAt).format('DD-MM-YYYY HH:mm:ss'),
      approvedAt: c.approvedAt ? dayjs(c.approvedAt).format('DD-MM-YYYY HH:mm:ss') : '',
      startDate: dayjs(c.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(c.startDate).format('DD/MM/YYYY'),
    }))
    return { data: formatted, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveAttendanceApproved = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests/approved', { params: { page, size } })
    const formatted = res.data.content.map((c) => ({
      ...c,
      createdAt: dayjs(c.createdAt).format('DD-MM-YYYY HH:mm:ss'),
      approvedAt: c.approvedAt ? dayjs(c.approvedAt).format('DD-MM-YYYY HH:mm:ss') : '',
      startDate: dayjs(c.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(c.startDate).format('DD/MM/YYYY'),
    }))
    return { data: formatted, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveAttendanceRejected = async (page, size) => {
  try {
    const res = await api.get('/api/v1/leave-requests/rejected', { params: { page, size } })
    const formatted = res.data.content.map((c) => ({
      ...c,
      createdAt: dayjs(c.createdAt).format('DD-MM-YYYY HH:mm:ss'),
      approvedAt: c.approvedAt ? dayjs(c.approvedAt).format('DD-MM-YYYY HH:mm:ss') : '',
      startDate: dayjs(c.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(c.startDate).format('DD/MM/YYYY'),
    }))
    return { data: formatted, totalPages: res.data.totalPages }
  } catch (error) {
    throw error
  }
}
const getIApproveAttendanceCount = async (status) => {
  try {
    const res = await api.get('/api/v1/leave-requests/count/status', { params: { status } })
    console.log(res)
    return res.data
  } catch (error) {
    throw error
  }
}
const getTimeSheet = async () => {
  try {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const res = await api.get('/api/v1/timesheets/me', { params: { month, year } })
    console.log(res)
    return res.data.data.dailyRecords
  } catch (error) {
    throw error
  }
}
/// CHECK-IN / CHECK-OUT
const checkIn = async () => {
  try {
    const res = await api.post('/api/v1/attendance/check-in')
    console.log(res)
    return res.data
  } catch (error) {
    throw error
  }
}
const checkOut = async () => {
  try {
    const res = await api.post('/api/v1/attendance/check-out')
    console.log(res)
    return res.data
  } catch (error) {
    throw error
  }
}
/// Employee Information
const getMyEmployeeInformation = async () => {
  try {
    const res = await api.get('/api/v1/employees/me')
    return res.data.data
  } catch (error) {
    throw error
  }
}
const getEmployeeShiftPlan = async (id, month, year) => {
  try {
    const startDate = dayjs(`${year}-${month}-01`).startOf('day').format('YYYY-MM-DD')
    const endDate = dayjs(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD')

    const res = await api.get(`/api/v1/shift-assignments/employee/${id}`, {
      params: { startDate, endDate },
    })
    return res.data.data
  } catch (error) {
    throw error
  }
}

export {
  /// Employee Information
  getMyEmployeeInformation,
  getEmployeeShiftPlan,
  /// CHECK-IN / CHECK-OUT
  checkIn,
  checkOut,
  ///=== TIMESHEET ===
  getTimeSheet,
  ///=== ATTENDANCE ===
  createAttendance,
  updateAttendance,
  approveAttendance,
  rejectAttendance,
  /// Mine
  getMineAttendanceAll,
  getMineAttendancePending,
  getMineAttendanceApproved,
  /// I approve
  getIApproveAttendanceAll,
  getIApproveAttendancePending,
  getIApproveAttendanceApproved,
  getIApproveAttendanceRejected,
  getIApproveAttendanceCount,
  ///=== OVERTIME REQUEST ===
  createOvertimeRequest,
  updateOvertimeRequest,
  approveOvertimeRequest,
  rejectOvertimeRequest,
  /// Mine
  getMineOvertimeRequestsAll,
  getMineOvertimeRequestPending,
  getMineOvertimeRequestApproved,
  getMineOvertimeRequestRejected,
  /// I approve
  getIApproveOvertimeRequestsAll,
  getIApproveOvertimeRequestPending,
  getIApproveOvertimeRequestApproved,
  getIApproveOvertimeRequestRejected,
  getIApproveOvertimeRequestPendingCount,
  getIApproveOvertimeRequestApprovedCount,
  getIApproveOvertimeRequestRejectedCount,
}
