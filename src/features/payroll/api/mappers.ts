import {
  EmployeeLite,
  Payroll, PayrollItem, PayrollPeriod, SalaryComponent, SalaryProfile
} from '../models/PayrollTypes';
import {
  EmployeeLiteDTO,
  PayrollDTO, PayrollItemDTO, PayrollPeriodDTO, SalaryComponentDTO, SalaryProfileDTO
} from './dto';

// helper chuyển "0|1" -> boolean
const toBool = (v: 0 | 1 | boolean | undefined | null): boolean => {
  if (typeof v === 'boolean') return v;
  return v === 1;
};
// helper decimal string -> number
const toNum = (v: string | number): number => (typeof v === 'string' ? Number(v) : v);

export const mapEmployeeLite = (d: EmployeeLiteDTO): EmployeeLite => ({
  employeeId: d.employee_id,
  employeeCode: d.employee_code,
  fullName: d.full_name,
  gender: d.gender,
  departmentId: d.department_id ?? null,
  jobPositionId: d.job_position_id ?? null,
  status: d.status,
});

export const mapSalaryComponent = (d: SalaryComponentDTO): SalaryComponent => ({
  salaryComponentId: d.salary_component_id,
  code: d.code,
  name: d.name,
  type: d.type,
  description: d.description ?? null,
  isActive: toBool(d.is_active),
  createdAt: d.created_at ?? undefined,
  updatedAt: d.updated_at ?? undefined,
});

export const mapPayrollPeriod = (d: PayrollPeriodDTO): PayrollPeriod => ({
  payrollPeriodId: d.payroll_period_id,
  name: d.name,
  startDate: d.start_date,
  endDate: d.end_date,
  paymentDate: d.payment_date ?? null,
  isClosed: toBool(d.is_closed),
  createdAt: d.created_at ?? undefined,
  updatedAt: d.updated_at ?? undefined,
});

export const mapSalaryProfile = (d: SalaryProfileDTO): SalaryProfile => ({
  salaryProfileId: d.salary_profile_id,
  employeeId: d.employee_id,
  salaryComponentId: d.salary_component_id,
  amount: toNum(d.amount),
  note: d.note ?? null,
  createdAt: d.created_at ?? undefined,
  updatedAt: d.updated_at ?? undefined,
});

export const mapPayrollItem = (d: PayrollItemDTO): PayrollItem => ({
  payrollItemId: d.payroll_item_id,
  payrollId: d.payroll_id,
  salaryComponentId: d.salary_component_id,
  amount: toNum(d.amount),
});

export const mapPayroll = (d: PayrollDTO): Payroll => ({
  payrollId: d.payroll_id,
  employeeId: d.employee_id,
  payrollPeriodId: d.payroll_period_id,
  salaryProfileId: d.salary_profile_id,
  totalSalary: toNum(d.total_salary),
  createdAt: d.created_at ?? undefined,
  updatedAt: d.updated_at ?? undefined,
});
