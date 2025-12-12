// src/features/payroll/mocks/salaryProfiles.mock.js
export const mockSalaryProfiles = [
  // Employee 1
  {
    salaryProfileId: 1,
    employeeId: 1,
    salaryComponentId: 1,   // BASIC
    amount: 20000000.0,
    note: "Lương cơ bản theo HĐ",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },
  {
    salaryProfileId: 2,
    employeeId: 1,
    salaryComponentId: 2,   // ALLOW_POS
    amount: 3000000.0,
    note: "Phụ cấp leader",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },

  // Employee 2
  {
    salaryProfileId: 3,
    employeeId: 2,
    salaryComponentId: 1,
    amount: 15000000.0,
    note: "Lương cơ bản theo HĐ",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },
  {
    salaryProfileId: 4,
    employeeId: 2,
    salaryComponentId: 2,
    amount: 1500000.0,
    note: "Phụ cấp trách nhiệm",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },

  // Employee 3
  {
    salaryProfileId: 5,
    employeeId: 3,
    salaryComponentId: 1,
    amount: 12000000.0,
    note: "Lương cơ bản",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },

  // Employee 4
  {
    salaryProfileId: 6,
    employeeId: 4,
    salaryComponentId: 1,
    amount: 18000000.0,
    note: "Lương cơ bản HR",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },

  // Employee 5
  {
    salaryProfileId: 7,
    employeeId: 5,
    salaryComponentId: 1,
    amount: 25000000.0,
    note: "Lương cơ bản Trưởng phòng",
    createdAt: "2025-01-01T08:00:00",
    updatedAt: "2025-01-01T08:00:00",
  },
];