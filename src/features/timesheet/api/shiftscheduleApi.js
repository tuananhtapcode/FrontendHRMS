import api from '../../../api/api';

// --- CÁC HÀM XỬ LÝ (VIẾT RIÊNG LẺ) ---

const getAll = async (params) => {
  try {
    const res = await api.get('/api/v1/timeworking/shifts', { params });
    return res;
  } catch (err) {
    console.log('Lỗi gọi API getAll Shifts: ', err);
    throw err;
  }
};

const create = async (data) => {
  try {
    const res = await api.post('/api/v1/timeworking/shifts', data);
    console.log('Tạo mới thành công:', res);
    return res;
  } catch (err) {
    console.error('Lỗi tạo mới ca: ', err);
    throw err;
  }
};

const remove = async (shiftId) => {
  try {
    const res = await api.delete(`/api/v1/timeworking/shifts/${shiftId}`);
    console.log('Xóa thành công:', res);
    return res;
  } catch (err) {
    throw err;
  }
};

const getById = async (shiftId) => {
  try {
    const res = await api.get(`/api/v1/timeworking/shifts/${shiftId}`);
    return res;
  } catch (err) {
    console.error('Lỗi lấy chi tiết ca: ', err);
    throw err;
  }
};

const update = async (shiftId, data) => {
  try {
    const res = await api.put(`/api/v1/timeworking/shifts/${shiftId}`, data);
    console.log('Cập nhật thành công:', res);
    return res;
  } catch (err) {
    console.error('Lỗi cập nhật ca: ', err);
    throw err;
  }
};

// --- CÁC HÀM XỬ LÝ PHÂN CA (SHIFT ASSIGNMENT) ---

// [MỚI THÊM] 0. Lấy toàn bộ lịch phân ca của công ty (theo ngày)
// URL: /api/v1/shift-assignments?startDate=...&endDate=...
const getAllAssignments = async (startDate, endDate) => {
    try {
        const params = { startDate, endDate };
        const res = await api.get('/api/v1/shift-assignments', { params });
        return res;
    } catch (err) {
        console.error('Lỗi lấy toàn bộ lịch phân ca: ', err);
        throw err;
    }
};

// 1. Lấy lịch làm việc theo phòng ban
const getDepartmentSchedule = async (deptId, startDate, endDate) => {
  try {
    const params = { startDate, endDate };
    const res = await api.get(`/api/v1/shift-assignments/department/${deptId}`, { params });
    return res;
  } catch (err) {
    console.error('Lỗi lấy lịch phòng ban: ', err);
    throw err;
  }
};

// 2. Lấy danh sách các Ca làm việc (Dropdown)
const getAllShifts = async () => {
    try {
        const res = await api.get('/api/v1/timeworking/shifts');
        return res;
    } catch (err) {
        console.error('Lỗi lấy danh sách ca: ', err);
        throw err;
    }
}

// 3. Phân ca lẻ
const assignShift = async (data) => {
  try {
    const res = await api.post('/api/v1/shift-assignments', data);
    console.log('Phân ca thành công:', res);
    return res;
  } catch (err) {
    console.error('Lỗi phân ca: ', err);
    throw err;
  }
};

// 4. Phân ca hàng loạt
const bulkAssignByDepartment = async (data) => {
    try {
      const res = await api.post('/api/v1/shift-assignments/bulk-by-department', data);
      console.log('Phân ca hàng loạt thành công:', res);
      return res;
    } catch (err) {
      console.error('Lỗi phân ca hàng loạt: ', err);
      throw err;
    }
  };

// 5. Xóa phân ca
const deleteAssignment = async (id) => {
  try {
    const res = await api.delete(`/api/v1/shift-assignments/${id}`);
    console.log('Xóa phân ca thành công:', res);
    return res;
  } catch (err) {
    throw err;
  }
};

// --- CÁC HÀM VỀ NHÂN VIÊN ---

// 6. Lấy thông tin nhân viên theo ID
const getEmployeeById = async (id) => {
    try {
        const res = await api.get(`/api/v1/employees/${id}`);
        return res;
    } catch (err) {
        console.error('Lỗi lấy thông tin nhân viên:', err);
        throw err;
    }
};

// 7. Lấy danh sách Phòng ban
const getAllDepartments = async () => {
    try {
        const res = await api.get('/api/v1/departments'); 
        return res;
    } catch (err) {
        console.error('Lỗi lấy danh sách phòng ban:', err);
        throw err;
    }
};

// 8. Lấy danh sách tất cả nhân viên
const getAllEmployees = async (params = {}) => {
    try {
        const res = await api.get('/api/v1/employees', { params });
        return res;
    } catch (err) {
        console.error('Lỗi lấy danh sách nhân viên:', err);
        throw err;
    }
};


export const shiftscheduleApi = {
  getAll,
  create,
  delete: remove, 
  getById,
  update,

  getAllAssignments, 
  getDepartmentSchedule,
  getAllShifts,
  assignShift,
  bulkAssignByDepartment,
  deleteAssignment,

  getEmployeeById, 
  getAllEmployees,
  getAllDepartments,
  
};