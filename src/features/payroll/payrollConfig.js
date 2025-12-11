// src/features/payroll/payrollConfig.js

// Bật/tắt mock cho module payroll
// - true  => dùng mock data (không gọi backend)
// - false => gọi backend qua PAYROLL_API_BASE_URL
export const PAYROLL_USE_MOCK = true

// Base URL backend cho payroll (sau này đổi sang Spring Boot của bạn)
export const PAYROLL_API_BASE_URL = 'http://localhost:8080/api/payroll'
