import { Route, Routes } from 'react-router-dom';

// Layout & pages
//import TimesheetLayout from './layout/TimesheetLayout'; // Đã import và bỏ comment
// import ShiftScheduleShow from '../workShift/shiftSchedule/pages/shiftscheduleShow';
// import OverviewPage from './pages/overview/overviewPages';


// // Sau này có thể lazy thêm trang khác
// const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))

const TimesheetModule = () => {
  return (
    // Đã bỏ Suspense
    <Routes>
      {/* THAY ĐỔI: Sử dụng TimesheetLayout làm element cho route cha */}
      <Route path="/" element={<TimesheetLayout />}>
        {/* /timesheet */}
        {/* <Route index element={<OverviewPage />} /> */}
        {/* <Route path="shiftscheduleShow" element={<ShiftScheduleShow />} /> */}

   
        {/* /timesheet/attendance
          <Route path="attendance" element={<AttendancePage />} />
          {/* /timesheet/shifts */}
        {/* <Route path="shifts" element={<ShiftsPage />} />
          {/* /timesheet/requests */}
        {/* <Route path="requests" element={<RequestsPage />} /> */}
        {/* /timesheet/approvals */}
        {/* <Route path="approvals" element={<ApprovalsPage />} /> */}
        {/* /timesheet/reports */}
        {/* <Route path="reports" element={<ReportsPage />} /> */}
        {/* /timesheet/settings */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}

        {/* Fallback nội bộ (nếu dùng layout) đã bị xóa, 
            vì fallback bên ngoài sẽ xử lý */}
      </Route>

      {/* Fallback: Trở về trang Overview nếu không khớp route nào */}
      <Route path="*" element={<OverviewPage />} />
    </Routes>
  )
}

export default TimesheetModule

