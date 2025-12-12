import axios from 'axios';

// Giả sử backend của bạn chạy ở đây
const axiosClient = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- DỮ LIỆU GIẢ LẬP (ĐÃ CẬP NHẬT) ---
const mockData = {
  stats: {
    // SỬA LẠI DỮ LIỆU Ở ĐÂY
    late: { value: 3, change: 1 }, // <-- ĐÃ SỬA
    onLeave: { value: 2, change: 1 },
    plannedLeave: { value: 5, change: 0 },
  },
  leaveByDept: {
    labels: ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Nhân sự', 'Kế toán'],
    datasets: [
      {
        label: 'Số ngày nghỉ (ĐVT: Ngày công)',
        backgroundColor: '#f87979',
        data: [12, 19, 3, 17, 6],
      },
    ],
  },
  leaveTypeAnalysis: {
    labels: ['Nghỉ phép năm', 'Nghỉ ốm', 'Nghỉ không lương'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
        data: [40, 20, 15],
      },
    ],
  },
  topOnLeaveEmployees: [
    { id: 1, name: 'Nguyễn Văn A', position: 'Kỹ sư phần mềm', days: 3 },
    { id: 2, name: 'Trần Thị B', position: 'Nhân viên kinh doanh', days: 2.5 },
    { id: 3, name: 'Lê Văn C', position: 'Trưởng phòng Marketing', days: 2 },
  ],
  topLateEmployees: [
    { id: 4, name: 'Phạm Thị D', position: 'Kế toán', times: 5 },
    { id: 5, name: 'Đặng Văn E', position: 'Kỹ sư phần mềm', times: 4 },
  ],
  lateFrequency: [
    { label: 'Dưới 3 lần', count: 15 },
    { label: 'Từ 3-5 lần', count: 5 },
    { label: 'Trên 5 lần', count: 2 },
  ],
};
// --- HẾT DỮ LIỆU GIẢ LẬP ---

// const getDashboardStats = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ data: mockData });
//     }, 1000);
//   });
// };


// export const timesheetApi = {
//   getDashboardStats,
// };


// Hàm 1: Lấy 3 thẻ StatCard (vẫn có thể gộp chung)
const getStats = (settings = null) => {
  console.log('API: Đang tải Stats...', settings)
  // Tương lai: return axiosClient.get('/dashboard/stats', { params: settings });
  return new Promise((resolve) => {
    // Giả lập thay đổi dữ liệu khi reload
    const randomStats = {
      late: { value: Math.floor(Math.random() * 10) },
      onLeave: { value: Math.floor(Math.random() * 5) },
      plannedLeave: { value: Math.floor(Math.random() * 10) },
    }
    setTimeout(() => resolve({ data: randomStats }), 500) // Trả về phần 'stats'
  })
}

// Hàm 2: Lấy dữ liệu "Tình hình nghỉ"
const getLeaveByDept = (settings = null) => {
  console.log('API: Đang tải LeaveByDept...', settings)
  // Tương lai: return axiosClient.get('/dashboard/leave-by-dept', { params: settings });
  return new Promise((resolve) => {
    // Giả lập dữ liệu mới
    const newData = { ...mockData.leaveByDept }
    newData.datasets[0].data = [Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20]
    setTimeout(() => resolve({ data: newData }), 1000) // Giả lập tải chậm
  })
}

// Hàm 3: Lấy dữ liệu "Nhân viên nghỉ nhiều nhất"
const getTopOnLeave = (settings = null) => {
  console.log('API: Đang tải TopOnLeave...', settings)
  // Tương lai: return axiosClient.get('/dashboard/top-on-leave', { params: settings });
  return new Promise((resolve) => {
    // Giả lập: trả về mảng rỗng nếu cài đặt
    if (settings?.limitValue > 5) {
      setTimeout(() => resolve({ data: [] }), 1000)
    } else {
      setTimeout(() => resolve({ data: mockData.topOnLeaveEmployees }), 1000)
    }
  })
}

// Hàm 4: Lấy dữ liệu "Nhân viên đi muộn"
const getTopLate = (settings = null) => {
  console.log('API: Đang tải TopLate...', settings)
  // Tương lai: return axiosClient.get('/dashboard/top-late', { params: settings });
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: mockData.topLateEmployees }), 1000)
  })
}

// Hàm 5: Lấy dữ liệu "Phân tích loại nghỉ"
const getLeaveTypeAnalysis = (settings = null) => {
  console.log('API: Đang tải LeaveTypeAnalysis...', settings)
  // Tương lai: return axiosClient.get('/dashboard/leave-type-analysis', { params: settings });
  return new Promise((resolve) => {
    const newData = { ...mockData.leaveTypeAnalysis }
    newData.datasets[0].data = [Math.random() * 50, Math.random() * 30, Math.random() * 20]
    setTimeout(() => resolve({ data: newData }), 1000)
  })
}

// Hàm 6: Lấy dữ liệu "Tần suất đi muộn"
const getLateFrequency = (settings = null) => {
  console.log('API: Đang tải LateFrequency...', settings)
  // Tương lai: return axiosClient.get('/dashboard/late-frequency', { params: settings });
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: mockData.lateFrequency }), 1000)
  })
}

// Export tất cả các hàm mới
export const timesheetApi = {
  getStats,
  getLeaveByDept,
  getTopOnLeave,
  getTopLate,
  getLeaveTypeAnalysis,
  getLateFrequency,
}