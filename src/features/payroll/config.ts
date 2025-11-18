// src/features/payroll/config.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const env = (import.meta as any).env

// export const PAYROLL_USE_MOCK = env?.VITE_PAYROLL_USE_MOCK === 'true'
// export const PAYROLL_API_BASE_URL = env?.VITE_PAYROLL_API_URL || '/api/payroll'

// Bật/tắt mock mà không đụng env chung
export const USE_MOCK = (localStorage.getItem('PAYROLL_USE_MOCK') ?? '1') === '1'
export const PAYROLL_API_BASE = '/api/payroll'
