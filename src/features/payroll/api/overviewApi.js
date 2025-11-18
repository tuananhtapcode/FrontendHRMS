// // src/features/payroll/api/overviewApi.js

// // giả lập gọi mạng
// const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// // dữ liệu mock cho dashboard tiền lương
// const MOCK_OVERVIEW = {
//   kpis: [
//     {
//       title: 'Tổng lương',
//       sub: 'Tất cả đơn vị · Quý này',
//       value: '120.000.000 đ',
//     },
//     {
//       title: 'Thuế TNCN',
//       sub: '',
//       value: '8.500.000 đ',
//     },
//     {
//       title: 'Bảo hiểm khấu trừ',
//       sub: '',
//       value: '12.300.000 đ',
//     },
//   ],
//   reminders: [
//     {
//       color: 'warning',
//       title: 'CHƯA GỬI PHIẾU LƯƠNG',
//       desc: 'Còn 12 nhân viên chưa gửi',
//     },
//     {
//       color: 'info',
//       title: 'NV CHÍNH THỨC CHƯA THAM GIA BHXH',
//       desc: '3 nhân viên cần bổ sung',
//     },
//     {
//       color: 'success',
//       title: 'LƯƠNG ĐÓNG BH NGOÀI QUY ĐỊNH',
//       desc: 'Không có dữ liệu bất thường',
//     },
//   ],
//   // // bạn có thể thêm các số khác cho GaugeCard, biểu đồ… nếu cần
//   // budget: {
//   //   percent: 12,
//   //   plan: 0,
//   //   actual: 0,
//   // },

//   // Dữ liệu cho Gauge “Tình hình thực hiện ngân sách lương”
//   budget: {
//     percent: 68,   // 68%
//     plan: 100,     // 100 tỷ / 100 đơn vị gì đó
//     actual: 68,
//   },

//   // 1) Phân tích mức lương nhân viên – theo phòng ban
//   salaryByDepartment: [
//     { department: 'Bán hàng', avgSalary: 9000000 },
//     { department: 'Thu ngân', avgSalary: 7500000 },
//     { department: 'Kho', avgSalary: 8200000 },
//     { department: 'Quản lý', avgSalary: 15000000 },
//   ],

//   // 2) Cơ cấu thu nhập – % trong tổng thu nhập
//   incomeStructure: [
//     { label: 'Lương cơ bản', value: 65 },
//     { label: 'Phụ cấp', value: 15 },
//     { label: 'Thưởng doanh số', value: 12 },
//     { label: 'Khác', value: 8 },
//   ],

//   // 3) Ngân sách theo thời gian – mỗi tháng
//   budgetByMonth: [
//     { month: '01/2025', plan: 100, actual: 95 },
//     { month: '02/2025', plan: 100, actual: 98 },
//     { month: '03/2025', plan: 100, actual: 102 },
//     { month: '04/2025', plan: 100, actual: 97 },
//     { month: '05/2025', plan: 100, actual: 101 },
//   ],

//   // 4) Thu nhập bình quân theo thời gian
//   avgIncomeByMonth: [
//     { month: '01', value: 7.5 },
//     { month: '02', value: 7.8 },
//     { month: '03', value: 8.1 },
//     { month: '04', value: 8.0 },
//     { month: '05', value: 8.4 },
//   ],

//   // 5) Thu nhập bình quân theo đơn vị
//   avgIncomeByUnit: [
//     { unit: 'Ca sáng', value: 7.8 },
//     { unit: 'Ca chiều', value: 8.0 },
//     { unit: 'Ca tối', value: 8.6 },
//   ],
// }



// // Hàm API duy nhất cho dashboard
// export async function getPayrollOverview() {
//   await delay(300)

//   // sau này bạn chỉ cần thay phần dưới bằng fetch backend:
//   // const res = await fetch('http://localhost:8080/api/payroll/overview')
//   // const json = await res.json()
//   // return { data: json }

//   return { data: MOCK_OVERVIEW }
// }
// src/features/payroll/api/overviewApi.js

// giả lập gọi mạng
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ====== MOCK DATA CHO DASHBOARD ======

// KPI tổng quát cho kỳ lương
const mockSummary = {
  totalSalary: 5432100000,        // Tổng quỹ lương
  personalIncomeTax: 850000000,   // Thuế TNCN
  insuranceDeduction: 1230000000, // Bảo hiểm khấu trừ
  headcount: 1050,                // Số lượng nhân sự
}

// Cơ cấu quỹ lương (để vẽ pie chart)
const mockFundStructure = [
  { label: 'Lương cơ bản', value: 3200000000 },
  { label: 'Phụ cấp',      value: 900000000 },
  { label: 'Tăng ca',      value: 450000000 },
  { label: 'Thưởng',       value: 380000000 },
  { label: 'Khấu trừ',     value: -500000000 },
]

// Biến động quỹ lương theo tháng (line chart)
const mockSalaryTrend = [
  { month: '01/2025', total: 4800000000, avg: 9000000 },
  { month: '02/2025', total: 5100000000, avg: 9200000 },
  { month: '03/2025', total: 5200000000, avg: 9400000 },
  { month: '04/2025', total: 5300000000, avg: 9500000 },
  { month: '05/2025', total: 5400000000, avg: 9600000 },
  { month: '06/2025', total: 5432100000, avg: 9700000 },
]

// Thông tin kỳ lương
const mockCurrentPeriod = {
  name: 'Kỳ lương 06/2025',
  status: 'Đã duyệt',            // hoặc 'Chưa duyệt'
  timeRange: '01/06/2025 – 30/06/2025',
  paymentDate: '05/07/2025',
  approver: 'Nguyễn Văn A',
  totalPaid: 5432100000,
  headcount: 1050,
}

// Lời nhắc
const mockReminders = [
  {
    color: 'warning',
    title: 'CHƯA GỬI PHIẾU LƯƠNG',
    desc: 'Còn 12 nhân viên chưa gửi',
  },
  {
    color: 'info',
    title: 'NV CHÍNH THỨC CHƯA THAM GIA BHXH',
    desc: '3 nhân viên cần bổ sung',
  },
  {
    color: 'success',
    title: 'LƯƠNG ĐÓNG BH NGOÀI QUY ĐỊNH',
    desc: 'Không có dữ liệu bất thường',
  },
]

// Ngân sách lương – dùng cho GaugeCard
const mockBudget = {
  percent: 68,   // 68%
  plan: 100,     // 100 (đơn vị giả định)
  actual: 68,
}

// ====== HÀM API DUY NHẤT ======
export async function fetchOverviewData() {
  await delay(300)

  // sau này thay bằng fetch backend:
  // const res = await fetch('http://localhost:8080/api/payroll/overview')
  // const json = await res.json()
  // return json

  return {
    summary: mockSummary,
    fundStructure: mockFundStructure,
    salaryTrend: mockSalaryTrend,
    currentPeriod: mockCurrentPeriod,
    reminders: mockReminders,
    budget: mockBudget,
  }
}
