// Các model FE (camelCase) — dùng xuyên suốt UI

export type Gender = 'Male' | 'Female' | 'Other';
export type EmployeeStatus = 'Active' | 'OnLeave' | 'Resigned' | 'Terminated';
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'OnLeave' | 'OverTime';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type ShiftPayType = 'hourly' | 'fixed';
export type SalaryComponentType = 'earning' | 'deduction';

export interface EmployeeLite {
  employeeId: number;
  employeeCode: string;
  fullName: string;
  gender?: Gender;
  departmentId?: number | null;
  jobPositionId?: number | null;
  status?: EmployeeStatus;
}

export interface SalaryComponent {
  salaryComponentId: number;
  code: string;
  name: string;
  type: SalaryComponentType; // earning | deduction
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayrollPeriod {
  payrollPeriodId: number;
  name: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  paymentDate?: string | null;
  isClosed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryProfile {
  salaryProfileId: number;
  employeeId: number;
  salaryComponentId: number;
  amount: number; // decimal(15,2)
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayrollItem {
  payrollItemId: number;
  payrollId: number;
  salaryComponentId: number;
  amount: number; // decimal(15,2)
}

export interface Payroll {
  payrollId: number;
  employeeId: number;
  payrollPeriodId: number;
  salaryProfileId: number;
  totalSalary: number;
  createdAt?: string;
  updatedAt?: string;
}
