import api from '../../../api/api'
import { unwrap } from '../../../api/unwrap'

// ============================================================
// 1. DỮ LIỆU KỲ CÔNG (Dùng chung Payroll Period)
// ============================================================

// Lấy danh sách các kỳ để hiển thị ở trang danh sách (List View)
// API này lấy từ Payroll Period vì Bảng công đi theo Kỳ lương
export const fetchTimekeepingPeriods = async () => {
  const res = await api.get('/api/v1/payroll-periods')
  return unwrap(res)
}

// ============================================================
// 2. ADMIN / HR / MANAGER (Quản lý bảng công tổng hợp)
// ============================================================

/**
 * Lấy bảng công tổng hợp (Chi tiết Monthly Timesheet)
 * Mapping: GET /api/v1/timesheets
 * @param {Object} params { month, year, departmentId, search }
 */
export const fetchMonthlyTimesheets = async ({ month, year, departmentId, search }) => {
  const res = await api.get('/api/v1/timesheets', { 
    params: { 
      month, 
      year,
      // Nếu departmentId hoặc search có giá trị thì mới gửi lên, không thì thôi
      ...(departmentId && { departmentId }),
      ...(search && { search })
    } 
  })
  return unwrap(res) // Trả về List<MonthlyTimesheetDTO>
}

/**
 * Chạy tính toán/tổng hợp công (Nút "Tính công" hoặc "Làm mới")
 * Mapping: POST /api/v1/timesheets/calculate
 * @param {Object} params { month, year }
 */
export const calculateTimesheet = async ({ month, year }) => {
  // Lưu ý: Controller dùng @RequestParam nên params phải để trong config của axios
  // Body để null
  const res = await api.post('/api/v1/timesheets/calculate', null, {
    params: { month, year }
  })
  return unwrap(res)
}

// ============================================================
// 3. INDIVIDUAL (Nhân viên xem công mình)
// ============================================================

/**
 * Lấy bảng công cá nhân
 * Mapping: GET /api/v1/timesheets/my-timesheet
 * @param {Object} params { month, year }
 */
export const fetchMyTimesheet = async ({ month, year }) => {
  const res = await api.get('/api/v1/timesheets/my-timesheet', {
    params: { month, year }
  })
  return unwrap(res)
}