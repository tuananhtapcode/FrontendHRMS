import api from '../../../api/api'

/// DEPARTMENT
const createDepartment = async (name, description, managerId) => {
  try {
    const res = await api.post('/api/v1/departments', { name, description, managerId })
    return res
  } catch (err) {
    throw err
  }
}

const getDepartments = async (page, size = 5) => {
  try {
    const res = await api.get('/api/v1/departments', { params: { page, size } })
    return { data: res.data.departmentResponseList, totalPages: res.data.totalPages }
  } catch (err) {
    console.log('Lỗi gọi API getDepartmentData: ', err)
    throw err
  }
}

const updateDepartment = async () => { }

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

/// JOB POSITION
const createJobPosition = async (code, name, description, level, minSalary, maxSalary) => {
  try {
    const res = await api.post('/api/v1/job-positions', {
      params: {
        code,
        name,
        description,
        level,
        minSalary,
        maxSalary,
      },
    })
    console.log(res)
    return res
  } catch (err) {
    console.error(err)
  }
}

const updateJobPosition = async (code, name, description, level, minSalary, maxSalary) => {
  try {
    const res = await api.put('/api/v1/job-positions', {
      params: {
        code,
        name,
        description,
        level,
        minSalary,
        maxSalary,
      },
    })
    console.log(res)
    return res
  } catch (err) {
    console.error(err)
  }
}

const getJobPositions = async (page, limit = 10) => {
  try {
    const res = await api.get('/api/v1/job-position', { params: { page, limit } })
    console.log(res)
    return res.data
  } catch (err) {
    console.log('Lỗi gọi API getDepartmentData: ', err)
    throw err
  }
}

export {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  createJobPosition,
  getJobPositions,
}
