// src/features/payroll/config.ts

/**
 * 🔹 Base URL cho API Payroll
 * - Backend của bạn đang chạy port 1234, nên phải trỏ thẳng vào đó.
 * - Nếu để '/api/payroll' nó sẽ gọi vào localhost:3000 (Frontend) -> Sai.
 */
export const PAYROLL_API_BASE_URL =
  localStorage.getItem('PAYROLL_API_BASE_URL') || 'http://localhost:1234' // <--- SỬA DÒNG NÀY

/**
 * 🔹 Bật / tắt mock
 * - Logic cũ của bạn bị ngược. Sửa lại: Nếu giá trị là '1' thì mới True.
 * - Mặc định (?? '0') sẽ là False.
 */
export const PAYROLL_USE_MOCK =
  (localStorage.getItem('PAYROLL_USE_MOCK') ?? '0') === '1' // <--- SỬA SỐ 0 THÀNH 1 Ở CUỐI

// alias cho tiện dùng ở chỗ khác
export const PAYROLL_API_BASE = PAYROLL_API_BASE_URL
export const USE_MOCK = PAYROLL_USE_MOCK

console.log('[payrollConfig] BASE =', PAYROLL_API_BASE_URL, 'USE_MOCK =', PAYROLL_USE_MOCK)