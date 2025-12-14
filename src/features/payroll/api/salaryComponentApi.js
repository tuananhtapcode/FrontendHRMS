import api from '../../../api/api'
import { unwrap } from '../../../api/unwrap'

// ✅ 1. Lấy danh sách (GET)
export const fetchSalaryComponents = async (params) => {
  const res = await api.get('/api/v1/salary-components', { params })
  return unwrap(res)
}

// ✅ 2. Tạo mới (POST)
export const createSalaryComponent = async (data) => {
  const res = await api.post('/api/v1/salary-components', data)
  return unwrap(res)
}

// ✅ 3. Cập nhật (PUT)
export const updateSalaryComponent = async (id, data) => {
  const res = await api.put(`/api/v1/salary-components/${id}`, data)
  return unwrap(res)
}

// ✅ 4. Đổi trạng thái (PATCH)
export const toggleSalaryComponentActive = async (id) => {
  const res = await api.patch(`/api/v1/salary-components/${id}/toggle-active`)
  return unwrap(res)
}

// ✅ 5. Xóa (DELETE) - Mới thêm vào đây
export const deleteSalaryComponent = async (id) => {
  const res = await api.delete(`/api/v1/salary-components/${id}`)
  return unwrap(res)
}