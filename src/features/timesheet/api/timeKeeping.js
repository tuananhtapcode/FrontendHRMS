import api from '../../../api/api';

const getTimesheetSummary = async (month, year, departmentId) => {
  try {

    const params = { month, year, departmentId };
    const res = await api.get('/api/v1/timesheets/summary', { params });
    return res;
  } catch (err) {
    console.error('Lỗi lấy bảng tổng hợp chấm công: ', err);
    throw err;
  }
};


const triggerDailyProcess = async (date) => {
  try {

    const res = await api.post('/api/v1/timesheets/process-daily', null, { 
      params: { date } 
    });
    console.log(`Đã kích hoạt xử lý công cho ngày ${date}:`, res);
    return res;
  } catch (err) {
    console.error('Lỗi chạy xử lý công thủ công: ', err);
    throw err;
  }
};


const getTimesheetDetails = async (month, year, departmentId) => {
  try {
    const params = { month, year, departmentId };
    const res = await api.get('/api/v1/timesheets/details', { params });
    return res;
  } catch (err) {
    console.error('Lỗi lấy bảng công chi tiết: ', err);
    throw err;
  }
};


const getMyTimesheet = async (month, year) => {
  try {
    const params = { month, year };
    const res = await api.get('/api/v1/timesheets/me', { params });
    return res;
  } catch (err) {
    console.error('Lỗi lấy bảng công cá nhân: ', err);
    throw err;
  }
};

const getAttendanceLogs = async (employeeId, date, page = 0, size = 20) => {
  try {
    const params = { employeeId, date, page, size };
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== null && v !== undefined)
    );

    const res = await api.get('/api/v1/attendance-logs', { params: filteredParams });
    return res;
  } catch (err) {
    console.error('Lỗi lấy danh sách nhật ký chấm công: ', err);
    throw err;
  }
};

const getMonthlyAttendanceSummary = async (month, year) => {
  try {
    const params = { month, year };
    const res = await api.get('/api/v1/attendance/summary', { params });
    return res;
  } catch (err) {
    console.error('Lỗi lấy bảng công tổng hợp (Attendance): ', err);
    throw err;
  }
};

export const timesheetApi = {
  getTimesheetSummary,
  triggerDailyProcess,
  getTimesheetDetails,
  getMyTimesheet,
  getAttendanceLogs,
  getMonthlyAttendanceSummary,
};