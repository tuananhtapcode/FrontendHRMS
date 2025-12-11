// src/features/payroll/mocks/payroll/components/componentsApi.mock.js
import { payrollComponentsMock } from './components.mock'

export const componentsApiMock = {
  // Lấy danh sách thành phần lương
  list: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          message: 'Thành công',
          data: payrollComponentsMock,
        })
      }, 500)
    }),

  // Lấy chi tiết theo mã
  getByCode: (code) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = payrollComponentsMock.find((x) => x.code === code)
        if (found) resolve({ status: 200, data: found })
        else reject({ status: 404, message: 'Không tìm thấy thành phần lương' })
      }, 300)
    }),

  // Tạo mới (mock)
  create: (newItem) =>
    new Promise((resolve) => {
      setTimeout(() => {
        payrollComponentsMock.push({
          ...newItem,
          status: 'Đang theo dõi',
          source: 'Người dùng',
        })
        resolve({ status: 201, message: 'Tạo thành công' })
      }, 400)
    }),

  // Cập nhật (mock)
  update: (code, data) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = payrollComponentsMock.findIndex((x) => x.code === code)
        if (idx === -1) return reject({ status: 404, message: 'Không tìm thấy' })
        payrollComponentsMock[idx] = { ...payrollComponentsMock[idx], ...data }
        resolve({ status: 200, message: 'Cập nhật thành công' })
      }, 400)
    }),

  // Xóa (mock)
  delete: (code) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = payrollComponentsMock.findIndex((x) => x.code === code)
        if (idx === -1) return reject({ status: 404, message: 'Không tìm thấy' })
        payrollComponentsMock.splice(idx, 1)
        resolve({ status: 200, message: 'Xóa thành công' })
      }, 300)
    }),
}
