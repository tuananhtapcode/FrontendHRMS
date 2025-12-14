import api from '../../../api/api';


const create = async (data) => {
  const res = await api.post('/api/v1/leave-requests', data);
  return res.data;
};

const update = async (id, data) => {
  const res = await api.put(`/api/v1/leave-requests/${id}`, data);
  return res.data;
};


const getMyRequests = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/me', { params });
  return res.data;
};


const cancel = async (id) => {
  const res = await api.post(`/api/v1/leave-requests/${id}/cancel`);
  return res.data;
};


const getAll = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests', { params });
  return res.data;
};


const getByEmployee = async (employeeId, params = {}) => {
  const res = await api.get(`/api/v1/leave-requests/employee/${employeeId}`, { params });
  return res.data;
};


const approve = async (id, data) => {
  const res = await api.post(`/api/v1/leave-requests/${id}/approve`, data);
  return res.data;
};


const reject = async (id, data) => {
  const res = await api.post(`/api/v1/leave-requests/${id}/reject`, data);
  return res.data;
};


const getById = async (id) => {
  const res = await api.get(`/api/v1/leave-requests/${id}`);
  return res.data;
};


const countAll = async () => {
  const res = await api.get('/api/v1/leave-requests/count');
  return res.data;
};


const countByStatus = async (status) => {
  const res = await api.get('/api/v1/leave-requests/count/status', {
    params: { status },
  });
  return res.data;
};


const countByEmployee = async (employeeId, status) => {
  const params = status ? { status } : {};
  const res = await api.get(`/api/v1/leave-requests/count/employee/${employeeId}`, { params });
  return res.data;
};

const countPending = async () => (await api.get('/api/v1/leave-requests/count/pending')).data;
const countApproved = async () => (await api.get('/api/v1/leave-requests/count/approved')).data;
const countRejected = async () => (await api.get('/api/v1/leave-requests/count/rejected')).data;
const countCancelled = async () => (await api.get('/api/v1/leave-requests/count/cancelled')).data;

const getPending = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/pending', { params });
  return res.data;
};

const getApproved = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/approved', { params });
  return res.data;
};

const getRejected = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/rejected', { params });
  return res.data;
};


const getMyPending = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/my/pending', { params });
  return res.data;
};

const getMyApproved = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/my/approved', { params });
  return res.data;
};

const getMyRejected = async (params = {}) => {
  const res = await api.get('/api/v1/leave-requests/my/rejected', { params });
  return res.data;
};

const getAllEmployees = async (params = {}) => {
  const defaultParams = { page: 0, size: 1000, ...params }; 
  const res = await api.get('/api/v1/employees', { params: defaultParams });
  return res.data;
};


export const leaveService = {
  getAllEmployees,
  create,
  update,
  getMyRequests,
  cancel,


  getAll,
  getByEmployee,
  approve,
  reject,

  getById,

  countAll,
  countByStatus,
  countByEmployee,
  countPending,
  countApproved,
  countRejected,
  countCancelled,

  getPending,
  getApproved,
  getRejected,

  getMyPending,
  getMyApproved,
  getMyRejected,
};

export default leaveService;