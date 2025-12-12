// src/features/payroll/mocks/payrollPeriods.mock.js
export const mockPayrollPeriods = [
  {
    payrollPeriodId: 1,
    name: "Lương tháng 01/2025",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    paymentDate: "2025-02-05",
    isClosed: 1, // đã chốt
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-02-05T08:00:00",
  },
  {
    payrollPeriodId: 2,
    name: "Lương tháng 02/2025",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    paymentDate: "2025-03-05",
    isClosed: 0, // đang mở
    createdAt: "2025-02-01T08:00:00",
    updatedAt: "2025-02-20T08:00:00",
  },
  {
    payrollPeriodId: 3,
    name: "Lương tháng 03/2025",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    paymentDate: null,
    isClosed: 0, // chưa tính
    createdAt: "2025-03-01T08:00:00",
    updatedAt: "2025-03-01T08:00:00",
  },
];