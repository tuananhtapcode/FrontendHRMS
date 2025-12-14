import api from '../../../api/api'
import { unwrap } from '../../../api/unwrap'

// 1. Lấy danh sách mẫu lương
export const fetchSalaryTemplates = async () => {
  // Giả định API Backend: GET /api/v1/salary-templates
  const res = await api.get('/api/v1/salary-templates')
  return unwrap(res)
}

// 2. Tạo mới mẫu lương
export const createSalaryTemplate = async (data) => {
  const res = await api.post('/api/v1/salary-templates', data)
  return unwrap(res)
}

// 3. Cập nhật mẫu lương
export const updateSalaryTemplate = async (id, data) => {
  const res = await api.put(`/api/v1/salary-templates/${id}`, data)
  return unwrap(res)
}

// 4. Xóa hoặc Đổi trạng thái
export const deleteSalaryTemplate = async (id) => {
  const res = await api.delete(`/api/v1/salary-templates/${id}`)
  return unwrap(res)
}