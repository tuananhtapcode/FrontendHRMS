// src/features/payroll/config.ts

/**
 * 🔹 Base URL cho API Payroll
 * - Mặc định: '/api/payroll'
 * - Nếu muốn đổi (ví dụ test với BE ở localhost:8080), bạn chỉ cần:
 *     localStorage.setItem('PAYROLL_API_BASE_URL', 'http://localhost:8080/api/payroll')
 */
export const PAYROLL_API_BASE_URL =
  localStorage.getItem('PAYROLL_API_BASE_URL') || '/api/payroll'

/**
 * 🔹 Bật / tắt mock
 * - '1' => dùng mockdata (mặc định)
 * - '0' => tắt mock, gọi API thật
 *
 * Trên Console:
 *   localStorage.setItem('PAYROLL_USE_MOCK', '1')  // bật mock
 *   localStorage.setItem('PAYROLL_USE_MOCK', '0')  // tắt mock
 */
export const PAYROLL_USE_MOCK =
  (localStorage.getItem('PAYROLL_USE_MOCK') ?? '1') === '1'

// alias cho tiện dùng ở chỗ khác
export const PAYROLL_API_BASE = PAYROLL_API_BASE_URL
export const USE_MOCK = PAYROLL_USE_MOCK

// Log cho dễ debug (có thể xoá nếu bạn không thích log)
console.log('[payrollConfig] BASE =', PAYROLL_API_BASE_URL, 'USE_MOCK =', PAYROLL_USE_MOCK)
