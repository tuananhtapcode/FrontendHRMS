// DTO bám sát tên cột DB (snake_case) – map sang model FE trong mappers.ts

export type GenderDTO = 'Male' | 'Female' | 'Other';
export type EmployeeStatusDTO = 'Active' | 'OnLeave' | 'Resigned' | 'Terminated';
export type LeaveStatusDTO = 'Pending' | 'Approved' | 'Rejected';
export type AttendanceStatusDTO = 'Present' | 'Late' | 'Absent' | 'OnLeave' | 'OverTime';
export type ShiftPayTypeDTO = 'hourly' | 'fixed';
export type SalaryComponentTypeDTO = 'earning' | 'deduction';

export interface EmployeeLiteDTO {
  employee_id: number;
  employee_code: string;
  full_name: string;
  gender?: GenderDTO;
  department_id?: number | null;
  job_position_id?: number | null;
  status?: EmployeeStatusDTO;
}

export interface SalaryComponentDTO {
  salary_component_id: number;
  code: string;
  name: string;
  type: SalaryComponentTypeDTO; // earning | deduction
  description?: string | null;
  is_active: 0 | 1;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PayrollPeriodDTO {
  payroll_period_id: number;
  name: string;
  start_date: string; // yyyy-mm-dd
  end_date: string;   // yyyy-mm-dd
  payment_date?: string | null;
  is_closed: 0 | 1;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SalaryProfileDTO {
  salary_profile_id: number;
  employee_id: number;
  salary_component_id: number;
  amount: string; // decimal -> string từ DB
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PayrollItemDTO {
  payroll_item_id: number;
  payroll_id: number;
  salary_component_id: number;
  amount: string; // decimal -> string từ DB
}

export interface PayrollDTO {
  payroll_id: number;
  employee_id: number;
  payroll_period_id: number;
  salary_profile_id: number;
  total_salary: string; // decimal -> string từ DB
  created_at?: string | null;
  updated_at?: string | null;
}
