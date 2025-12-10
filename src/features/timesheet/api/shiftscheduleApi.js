// // Đề xuất tên file: src/api/workShiftApi.js

// import axios from 'axios'

// // Cài đặt chung
// const axiosClient = axios.create({
//   baseURL: 'http://localhost:8888/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
// // Dùng 'let' để có thể Thêm/Sửa/Xóa (lấy từ file 1, vì đủ trường hơn)
// let allWorkShifts = [
//   {
//     id: 1,
//     code: 'HC',
//     name: 'Ca hành chính',
//     unit: 'Tất cả đơn vị',
//     startTime: '08:00',
//     checkInFrom: '07:00',
//     checkInTo: '09:00',
//     checkOutFrom: '17:00', // <-- Lấy từ file 1
//     checkOutTo: '18:00', // <-- Lấy từ file 1
//     status: 'active',
//   },
//   {
//     id: 2,
//     code: 'TCT',
//     name: 'tăng ca tối',
//     unit: 'HRS',
//     startTime: '06:00',
//     checkInFrom: '06:00',
//     checkInTo: '06:30',
//     checkOutFrom: '14:00', // <-- Lấy từ file 1
//     checkOutTo: '14:30', // <-- Lấy từ file 1
//     status: 'active',
//   },
//   {
//     id: 3,
//     code: 'C3',
//     name: 'Ca 3 (Đêm)',
//     unit: 'Nhà máy',
//     startTime: '22:00',
//     checkInFrom: '21:30',
//     checkInTo: '22:30',
//     checkOutFrom: '06:00', // <-- Lấy từ file 1
//     checkOutTo: '06:30', // <-- Lấy từ file 1
//     status: 'inactive',
//   },
// ]
// // --- HẾT DỮ LIỆU GIẢ LẬP ---

// /**
//  * LẤY danh sách ca (Hỗ trợ tìm kiếm và lọc)
//  * @param {object} params - { search: string, status: 'all' | 'active' | 'inactive' }
//  */
// const getWorkShifts = (params = { search: '', status: 'all' }) => {
//   // PHẦN 1: TẠM THỜI (DÙNG DỮ LIỆU GIẢ)
//   return new Promise((resolve) => {
//     let filteredData = [...allWorkShifts]

//     // 1. Lọc theo Trạng thái
//     if (params.status && params.status !== 'all') {
//       filteredData = filteredData.filter((shift) => shift.status === params.status)
//     }

//     // 2. Lọc theo Tìm kiếm (tìm theo Tên ca hoặc Mã ca)
//     if (params.search) {
//       const searchTerm = params.search.toLowerCase()
//       filteredData = filteredData.filter(
//         (shift) =>
//           shift.name.toLowerCase().includes(searchTerm) ||
//           shift.code.toLowerCase().includes(searchTerm),
//       )
//     }

//     // Giả lập độ trễ mạng
//     setTimeout(() => {
//       resolve({ data: filteredData })
//     }, 500)
//   })

//   // PHẦN 2: KHI CÓ BACKEND THẬT
//   // return axiosClient.get('/work-shifts', { params });
// }

// /**
//  * THÊM ca làm việc mới
//  * @param {object} shiftData - Dữ liệu ca mới từ form
//  */
// const createWorkShift = (shiftData) => {
//   // PHẦN 1: TẠM THỜI (DÙNG DỮ LIỆU GIẢ)
//   return new Promise((resolve) => {
//     // Tạo ID giả (an toàn hơn Date.now())
//     const newId = allWorkShifts.length > 0 ? Math.max(...allWorkShifts.map(s => s.id)) + 1 : 1;
//     const newShift = { ...shiftData, id: newId } // Giả lập ID tăng dần

//     // Đảm bảo có đủ các trường
//     if (!newShift.status) newShift.status = 'active';
//     // Bạn có thể thêm các giá trị mặc định khác ở đây

//     allWorkShifts.push(newShift) // Thêm vào mảng giả
//     console.log('API: Đã thêm ca mới', newShift)
//     console.log('API: Danh sách ca hiện tại:', allWorkShifts)

//     setTimeout(() => {
//       resolve({ data: newShift })
//     }, 500) // Giả lập mạng
//   })

//   // PHẦN 2: KHI CÓ BACKEND THẬT
//   // return axiosClient.post('/work-shifts', shiftData);
// }

// // Export tất cả các hàm
// export const workShiftApi = {
//   getWorkShifts,
//   createWorkShift,
//   // Thêm getWorkShiftById, updateWorkShift, deleteWorkShift ở đây khi cần
// }



import axios from 'axios'

// Cài đặt chung
const axiosClient = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
// Đã cập nhật khớp với các cột trong ảnh screenshot
let allWorkShifts = [
  {
    id: 1,
    code: 'abc1234',
    name: 'ABC',
    unit: 'Tất cả đơn vị',
    startTime: '08:00',
    checkInFrom: '07:00',
    checkInTo: '08:00',
    endTime: '08:30',       // Giờ kết thúc ca
    checkOutFrom: '08:30',  // Chấm ra cuối ca từ
    checkOutTo: '09:00',    // Chấm ra cuối ca đến (Thêm trường này)
    status: 'active',
  },
  {
    id: 2,
    code: 'HC',
    name: 'Ca hành chính',
    unit: 'Tất cả đơn vị',
    startTime: '08:00',
    checkInFrom: '07:00',
    checkInTo: '09:00',
    endTime: '17:30',
    checkOutFrom: '16:30',
    checkOutTo: '18:00',
    status: 'active',
  },
  {
    id: 3,
    code: 'TC1',
    name: 'Tăng ca',
    unit: 'Tất cả đơn vị',
    startTime: '08:00',
    checkInFrom: '07:00',
    checkInTo: '09:00',
    endTime: '17:30',
    checkOutFrom: '16:30',
    checkOutTo: '18:30',
    status: 'active',
  },
  {
    id: 4,
    code: 'CA_DEM',
    name: 'Ca đêm',
    unit: 'Khối sản xuất',
    startTime: '22:00',
    checkInFrom: '21:30',
    checkInTo: '22:15',
    endTime: '06:00',
    checkOutFrom: '06:00',
    checkOutTo: '06:30',
    status: 'inactive',
  },
]

// --- HÀM XỬ LÝ ---

const getWorkShifts = (params = { search: '', status: 'All', unit: 'All' }) => {
  return new Promise((resolve) => {
    let filteredData = [...allWorkShifts]

    // 1. Lọc theo Trạng thái
    if (params.status && params.status !== 'All') {
      filteredData = filteredData.filter((shift) => shift.status === params.status)
    }

    // 2. Lọc theo Đơn vị (Demo logic đơn giản)
    if (params.unit && params.unit !== 'All') {
        // Trong thực tế sẽ so sánh ID đơn vị
        // Ở đây giả lập lọc string
        filteredData = filteredData.filter((shift) => shift.unit.includes(params.unit) || shift.unit === 'Tất cả đơn vị')
    }

    // 3. Lọc theo Tìm kiếm
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      filteredData = filteredData.filter(
        (shift) =>
          shift.name.toLowerCase().includes(searchTerm) ||
          shift.code.toLowerCase().includes(searchTerm),
      )
    }

    // Giả lập độ trễ
    setTimeout(() => {
      resolve({ data: filteredData })
    }, 300)
  })
}

const createWorkShift = (shiftData) => {
  return new Promise((resolve) => {
    const newId = allWorkShifts.length > 0 ? Math.max(...allWorkShifts.map(s => s.id)) + 1 : 1;
    const newShift = { 
        ...shiftData, 
        id: newId,
        // Điền giá trị mặc định nếu thiếu để không lỗi bảng
        unit: shiftData.unit || 'Tất cả đơn vị',
        status: 'active'
    } 
    allWorkShifts.push(newShift)
    setTimeout(() => {
      resolve({ data: newShift })
    }, 300)
  })
}

export const workShiftApi = {
  getWorkShifts,
  createWorkShift,
}