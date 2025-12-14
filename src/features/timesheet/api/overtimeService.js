import api from '../../../api/api';

// ✅ 1) Nhân viên tạo yêu cầu OT
const create = async (data) => {
  const res = await api.post('/api/v1/overtime-requests', data);
  return res.data;
};

// ✅ 2) Cập nhật yêu cầu OT
const update = async (id, data) => {
  const res = await api.put(`/api/v1/overtime-requests/${id}`, data);
  return res.data;
};

// ✅ 3) Manager duyệt yêu cầu OT
const approve = async (id, data) => {
  const res = await api.post(`/api/v1/overtime-requests/${id}/approve`, data);
  return res.data;
};

// ✅ 4) Manager từ chối yêu cầu OT
const reject = async (id, data) => {
  const res = await api.post(`/api/v1/overtime-requests/${id}/reject`, data);
  return res.data;
};

// ✅ 5) Huỷ yêu cầu OT
const cancel = async (id) => {
  const res = await api.post(`/api/v1/overtime-requests/${id}/cancel`);
  return res.data;
};

// ==========================================
// 2. DANH SÁCH & CHI TIẾT
// ==========================================

// ✅ 6) Lấy danh sách OT (cho admin/manager)
const getAll = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests', { params });
  return res.data;
};

// ✅ 7) Nhân viên xem danh sách OT của chính mình
const getMyRequests = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/me', { params });
  return res.data;
};

// ✅ 8) Admin xem tất cả request của 1 nhân viên
const getByEmployee = async (employeeId, params = {}) => {
  const res = await api.get(`/api/v1/overtime-requests/employee/${employeeId}`, { params });
  return res.data;
};

// ✅ 9) Xem chi tiết đơn OT
const getById = async (id) => {
  const res = await api.get(`/api/v1/overtime-requests/${id}`);
  return res.data;
};

// ==========================================
// 3. THỐNG KÊ (COUNT & DASHBOARD)
// ==========================================

const countAll = async () => {
  const res = await api.get('/api/v1/overtime-requests/count/all');
  return res.data;
};

const countByStatus = async (status) => {
  const res = await api.get('/api/v1/overtime-requests/count', {
    params: { status },
  });
  return res.data;
};

const countByEmployee = async (employeeId, status) => {
  const params = status ? { status } : {};
  const res = await api.get(`/api/v1/overtime-requests/employee/${employeeId}/count`, { params });
  return res.data;
};

// Dashboard KPIs (Đếm nhanh)
const countPending = async () => (await api.get('/api/v1/overtime-requests/dashboard/pending')).data;
const countApproved = async () => (await api.get('/api/v1/overtime-requests/dashboard/approved')).data;
const countRejected = async () => (await api.get('/api/v1/overtime-requests/dashboard/rejected')).data;
const countCancelled = async () => (await api.get('/api/v1/overtime-requests/dashboard/cancelled')).data;

// Dashboard OT Hours (Tổng phút làm thêm)
const getTotalMinutesAll = async () => {
  const res = await api.get('/api/v1/overtime-requests/dashboard/total-minutes');
  return res.data;
};

const getTotalMinutesByEmployee = async (id) => {
  const res = await api.get(`/api/v1/overtime-requests/dashboard/employee/${id}/total-minutes`);
  return res.data;
};

// Dashboard Monthly (Thống kê theo tháng)
const getMonthlyStats = async (year) => {
  const res = await api.get('/api/v1/overtime-requests/dashboard/monthly', { params: { year } });
  return res.data;
};

// ==========================================
// 4. DANH SÁCH RIÊNG (ADMIN / MANAGER)
// ==========================================

const getAllPending = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/pending', { params });
  return res.data;
};

const getAllApproved = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/approved', { params });
  return res.data;
};

const getAllRejected = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/rejected', { params });
  return res.data;
};

// ==========================================
// 5. DANH SÁCH RIÊNG (EMPLOYEE)
// ==========================================

const getMyPending = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/my/pending', { params });
  return res.data;
};

const getMyApproved = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/my/approved', { params });
  return res.data;
};

const getMyRejected = async (params = {}) => {
  const res = await api.get('/api/v1/overtime-requests/my/rejected', { params });
  return res.data;
};

// ==========================================
// 6. HELPER (LẤY NHÂN VIÊN ĐỂ MAP TÊN)
// ==========================================
const getAllEmployees = async (params = {}) => {
  const defaultParams = { page: 0, size: 1000, ...params }; 
  const res = await api.get('/api/v1/employees', { params: defaultParams });
  return res.data;
};


// ==========================================
// EXPORT
// ==========================================

export const overtimeService = {
  // Helper
  getAllEmployees,

  // Core
  create,
  update,
  approve,
  reject,
  cancel,

  // Lists
  getAll,
  getMyRequests,
  getByEmployee,
  getById,

  // Count
  countAll,
  countByStatus,
  countByEmployee,
  
  // Dashboard KPIs
  countPending,
  countApproved,
  countRejected,
  countCancelled,
  
  // Dashboard Stats
  getTotalMinutesAll,
  getTotalMinutesByEmployee,
  getMonthlyStats,

  // Admin Lists
  getAllPending,
  getAllApproved,
  getAllRejected,

  // Employee Lists
  getMyPending,
  getMyApproved,
  getMyRejected,
};

export default overtimeService;