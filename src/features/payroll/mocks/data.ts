import { EmployeeLiteDTO, PayrollDTO, PayrollItemDTO, PayrollPeriodDTO, SalaryComponentDTO, SalaryProfileDTO } from '../api/dto';

// Giả lập data nhỏ gọn theo đúng schema DB

export const mockEmployees: EmployeeLiteDTO[] = [
  { employee_id: 1, employee_code: 'NV001', full_name: 'Nguyễn Lan', gender: 'Female', department_id: 10, job_position_id: 101, status: 'Active' },
  { employee_id: 2, employee_code: 'NV002', full_name: 'Trần Long', gender: 'Male', department_id: 10, job_position_id: 102, status: 'Active' },
];

export const mockSalaryComponents: SalaryComponentDTO[] = [
  { salary_component_id: 1, code: 'LUONG_CO_BAN', name: 'Lương cơ bản', type: 'earning', description: null, is_active: 1, created_at: null, updated_at: null },
  { salary_component_id: 2, code: 'BHXH', name: 'BHXH', type: 'deduction', description: null, is_active: 1, created_at: null, updated_at: null },
  { salary_component_id: 3, code: 'BHYT', name: 'BHYT', type: 'deduction', description: null, is_active: 1, created_at: null, updated_at: null },
];

export const mockPayrollPeriods: PayrollPeriodDTO[] = [
  { payroll_period_id: 100, name: 'Kỳ 10/2025', start_date: '2025-10-01', end_date: '2025-10-31', payment_date: '2025-11-05', is_closed: 0, created_at: null, updated_at: null },
  { payroll_period_id: 101, name: 'Kỳ 11/2025', start_date: '2025-11-01', end_date: '2025-11-30', payment_date: '2025-12-05', is_closed: 0, created_at: null, updated_at: null },
];

export const mockSalaryProfiles: SalaryProfileDTO[] = [
  { salary_profile_id: 1000, employee_id: 1, salary_component_id: 1, amount: '8000000.00', note: 'CB', created_at: null, updated_at: null },
  { salary_profile_id: 1001, employee_id: 1, salary_component_id: 2, amount: '800000.00', note: null, created_at: null, updated_at: null },
  { salary_profile_id: 1002, employee_id: 2, salary_component_id: 1, amount: '9000000.00', note: 'CB', created_at: null, updated_at: null },
];

export const mockPayrolls: PayrollDTO[] = [
  { payroll_id: 5000, employee_id: 1, payroll_period_id: 100, salary_profile_id: 1000, total_salary: '7200000.00', created_at: null, updated_at: null },
  { payroll_id: 5001, employee_id: 2, payroll_period_id: 100, salary_profile_id: 1002, total_salary: '9000000.00', created_at: null, updated_at: null },
];

export const mockPayrollItems: PayrollItemDTO[] = [
  { payroll_item_id: 9000, payroll_id: 5000, salary_component_id: 1, amount: '8000000.00' },
  { payroll_item_id: 9001, payroll_id: 5000, salary_component_id: 2, amount: '-800000.00' },
  { payroll_item_id: 9002, payroll_id: 5001, salary_component_id: 1, amount: '9000000.00' },
];
