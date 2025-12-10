import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// Layout & pages
// import TimesheetLayout from './layout/TimesheetLayout'
import LeaveRequestPage from './pages/orderManagenment/leaveRequest'
import LeaveRequestAdd from './pages/orderManagenment/leaverequestAdd'
import OvertimeRequestPage from './pages/orderManagenment/overtimeRequest'
import OvertimeRequestAdd from './pages/orderManagenment/overtimerequestAdd'
import ShiftSwapRequestPage from './pages/orderManagenment/shiftSwap'
import ShiftSwapRequestAdd from './pages/orderManagenment/shiftswapAdd'
import OverviewPage from './pages/overview/overviewPages'
import AttendanceStatsByShiftPage from './pages/report/attenstatbyShift'
import LateEarlyReportPage from './pages/report/lateearlyReport'
import OvertimeEmployeeListPage from './pages/report/overtimeEList'
import OvertimeSummaryPage from './pages/report/overtimeSumE'
import LateEarlySummaryPage from './pages/report/summaryLER'
import TotalWorkingHoursPage from './pages/report/totalworkinghours'
import StandardWorkDays from './pages/setting/attendance1'
import TimesheetConfig from './pages/setting/attendance2'
import MobileAppAttendance from './pages/setting/attendance3'
import AttendanceRules from './pages/setting/attendenceRules'
import EmployeeListPage from './pages/setting/employeeList'
import RawTimesheetPage from './pages/timeKeeping/dataTimesheet'
import DetailedTimesheetPage from './pages/timeKeeping/detailedTimesheet'
import SummaryTimesheet from './pages/timeKeeping/summaryTimesheet'
import ShiftAssignmentAdd from './pages/workShift/shiftassdetailAdd'
import ShiftAssignmentDetail from './pages/workShift/shiftassignmentDetail'
import ShiftAssignmentSummary from './pages/workShift/shiftassignmentSummary'
import ShiftAssignmentByUnit from './pages/workShift/shiftassignmentSummary1'
import ShiftAssignmentByShift from './pages/workShift/shiftassignmentSummary2'
import ShiftRegistrationPage from './pages/workShift/shiftRegistration'
import ShiftScheduleShow from './pages/workShift/shiftscheduleShow'
import WorkShiftAddNew from './pages/workShift/WorkShiftAddNew'


// // Sau này có thể lazy thêm trang khác
// const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))

const TimesheetModule = () => {
  return (
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>
        {/* THAY ĐỔI:
          Tôi đã bỏ 'element={<TimesheetLayout />}' ra khỏi Route cha.
          Trong React Router v6, một Route cha không có 'element' 
          vẫn sẽ render các route con (children) của nó.
          Điều này cho phép bạn test trang OverviewPage mà không cần layout.
        */}
        <Route path="/">
          {/* /timesheet */}
          <Route index element={<OverviewPage />} />
          <Route path="shiftscheduleShow" element={<ShiftScheduleShow />} />
          <Route path="shiftscheduleShow/add" element={<WorkShiftAddNew />} />
          <Route path="ShiftAssignmentDetail" element={<ShiftAssignmentDetail />} />
          <Route path="ShiftAssignmentDetail/add" element={<ShiftAssignmentAdd />} />
          <Route path="shiftassignmentSummary" element={<ShiftAssignmentSummary />} />
          <Route path="shiftassignmentSummary/unit" element={<ShiftAssignmentByUnit />} />
          <Route path="shiftassignmentSummary/shift" element={<ShiftAssignmentByShift />} />

          <Route path="shiftsRegistration" element={<ShiftRegistrationPage />} />

          <Route path="detailedTimesheet" element={<DetailedTimesheetPage />} />

          <Route path="summaryTimesheet" element={<SummaryTimesheet />} />

          <Route path="dataTimesheet" element={<RawTimesheetPage />} />

          <Route path="leaveRequest" element={<LeaveRequestPage />} />
          <Route path="leaveRequest/add" element={<LeaveRequestAdd />} />

          <Route path="overtimeRequest" element={<OvertimeRequestPage />} />
          <Route path="overtimeRequest/add" element={<OvertimeRequestAdd />} />

          <Route path="shiftSwap" element={<ShiftSwapRequestPage />} />
          <Route path="shiftSwap/add" element={<ShiftSwapRequestAdd />} />

          <Route path="lateearlyReport" element={<LateEarlyReportPage />} />

          <Route path="summarylateearlyReport" element={<LateEarlySummaryPage />} />
          <Route path="attendancebyShift" element={<AttendanceStatsByShiftPage />} />
          <Route path="totalworkingHours" element={<TotalWorkingHoursPage />} />
          <Route path="overtimeEList" element={<OvertimeEmployeeListPage />} />
          <Route path="overtimeSummary" element={<OvertimeSummaryPage />} />

          <Route path="employeeList" element={<EmployeeListPage />} />
          <Route path="attendanceRules" element={<AttendanceRules />} />
          <Route path="attendanceRules/standardwork" element={<StandardWorkDays />} />
          <Route path="attendanceRules/custom" element={<TimesheetConfig />} />
          <Route path="attendanceRules/app" element={<MobileAppAttendance />} />

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

          {/* Fallback nếu path không tồn tại */}
          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default TimesheetModule
