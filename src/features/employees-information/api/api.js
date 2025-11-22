import api from 'src/api/api'
import { fakeDepartmentData, fakeJobPositionData } from './fakeData'

const getDepartmentData = async (page, size) => {
  //fake api
  return fakeDepartmentData

  //riel api
  // try {
  //   const res = await api.get('/api/v1/departments', { params: { page, size } })
  //   console.log(res)
  //   return res.data
  // } catch (err) {
  //   console.log('Lỗi gọi API getDepartmentData: ', err)
  //   throw(err)
  // }
}

const getJobPositions = async (page, limit) => {
  //fake api
  return fakeJobPositionData

  //riel api
  // try {
  //   const res = await api.get('/api/v1/job-positions', { params: { page, limit } })
  //   console.log(res)
  //   return res.data
  // } catch (err) {
  //   console.error('Lỗi gọi API getJobPositions: ', err)
  //   throw err
  // }
}

export { getDepartmentData, getJobPositions }
