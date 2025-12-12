import { http, HttpResponse } from 'msw'
import { PAYROLL_API_BASE } from '../config'

// sample data giống bảng salary_component
const salaryComponents = [
  { salary_component_id: 1, code: 'LUONG_CO_BAN', name: 'Lương cơ bản', type: 'earning',  is_active: 1 },
  { salary_component_id: 2, code: 'PHU_CAP_CA',   name: 'Phụ cấp ca',   type: 'earning',  is_active: 1 },
  { salary_component_id: 3, code: 'BHXH',         name: 'BHXH',         type: 'deduction',is_active: 1 },
  { salary_component_id: 4, code: 'BHYT',         name: 'BHYT',         type: 'deduction',is_active: 1 },
]

export const payrollHandlers = [
  http.get(`${PAYROLL_API_BASE}/salary-components`, () => {
    return HttpResponse.json(salaryComponents)
  }),

  http.post(`${PAYROLL_API_BASE}/salary-components`, async ({ request }) => {
    const body = await request.json()
    const nextId = (salaryComponents.at(-1)?.salary_component_id ?? 0) + 1
    const row = { salary_component_id: nextId, is_active: 1, ...body }
    salaryComponents.push(row)
    return HttpResponse.json(row, { status: 201 })
  }),
]